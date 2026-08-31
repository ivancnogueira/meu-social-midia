import { access, copyFile, cp, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { gerarConfigVps } from './gerar-config-vps.mjs';
import { executarOnboarding } from './onboarding.mjs';
import { lerEnv } from './lib/arquivos.mjs';
import { atualizarArquivoEnv, criarSegredo, detectarAmbiente, normalizarModo, normalizarUrlBase } from './lib/configuracao.mjs';

const arquivoAtual = fileURLToPath(import.meta.url);
const diretorioPadrao = resolve(dirname(arquivoAtual), '..');
const argumentos = process.argv.slice(2);

function valorDaOpcao(nome) {
  const indice = argumentos.indexOf(nome);
  if (indice === -1) return undefined;
  const valor = argumentos[indice + 1];
  if (!valor || valor.startsWith('--')) throw new Error(`A opção ${nome} precisa de um valor.`);
  return valor;
}

function possui(nome) { return argumentos.includes(nome); }

function mostrarAjuda() {
  console.log(`Uso interativo: npm run configurar
Atalhos: npm run configurar:local | npm run configurar:servidor -- DOMINIO
Automação/Codex: node automacoes/configurar.mjs [opções]

Opções:
  --modo local|servidor   Define explicitamente o perfil de execução.
  --dominio DOMINIO       Domínio HTTPS usado no modo servidor.
  --sem-interacao         Executa sem perguntas; usa local como padrão seguro.
  --sem-instalar          Não executa npm install.
  --sem-habilidades       Não instala as habilidades no Codex.
  --instalar-habilidades  Autoriza habilidades no modo não interativo.
  --destino-habilidades   Diretório alternativo das habilidades.
  --diretorio DIRETORIO   Diretório do projeto, útil em validações.
  --ajuda                 Mostra esta ajuda.`);
}

async function existe(caminho) {
  try { await access(caminho, constants.F_OK); return true; } catch { return false; }
}

function verificarRuntime() {
  const versao = Number(process.versions.node.split('.')[0]);
  if (!Number.isInteger(versao) || versao < 20) throw new Error('É necessário usar Node.js 20 ou superior.');
  try { execFileSync('git', ['--version'], { stdio: 'ignore' }); } catch { throw new Error('Git não foi encontrado.'); }
}

function instalarDependencias(diretorioDoProjeto) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  console.log('Verificando dependências do projeto...');
  execFileSync(npm, ['install', '--ignore-scripts', '--no-audit', '--no-fund'], {
    cwd: diretorioDoProjeto,
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
}

async function garantirDiretorios(diretorioDoProjeto) {
  const diretorios = [
    'conteudos', 'documentacao', 'previas', 'recursos/logos', 'recursos/fotos',
    'recursos/referencias', 'saidas/carrosseis', 'saidas/posts-individuais',
    'saidas/posts-de-anuncio', 'runtime', 'logs'
  ];
  await Promise.all(diretorios.map((pasta) => mkdir(join(diretorioDoProjeto, pasta), { recursive: true })));
}

async function criarEnvSeNecessario(diretorioDoProjeto) {
  const destino = join(diretorioDoProjeto, '.env');
  if (await existe(destino)) {
    console.log('.env preservado: nenhuma credencial existente foi substituída.');
    return;
  }
  await copyFile(join(diretorioDoProjeto, '.env.example'), destino);
  console.log('.env criado a partir de .env.example. Preencha credenciais somente neste arquivo local.');
}

export async function escolherModo({ diretorioDoProjeto, modoNaoInterativo, terminalInterativo = input.isTTY && output.isTTY }) {
  const env = await lerEnv(join(diretorioDoProjeto, '.env'));
  const detectado = await detectarAmbiente();
  const modoPosicional = argumentos.find((item) => ['local', 'servidor'].includes(String(item).toLowerCase()));
  const explicito = valorDaOpcao('--modo') || modoPosicional;
  let modo = explicito ? normalizarModo(explicito) : env.APP_MODE && ['local', 'servidor'].includes(env.APP_MODE) ? env.APP_MODE : undefined;

  if (!explicito && !modoNaoInterativo && terminalInterativo) {
    const padrao = modo || detectado.recomendacao;
    const sinais = detectado.sinais.length ? ` (${detectado.sinais.join(', ')})` : '';
    console.log(`\nAmbiente detectado: recomendação ${detectado.recomendacao}${sinais}.`);
    console.log('1. Local — preview neste computador e Telegram enquanto ele estiver ligado.');
    console.log('2. Servidor/VPS — domínio HTTPS e processos persistentes.');
    const rl = createInterface({ input, output });
    try {
      const resposta = (await rl.question(`Escolha [1/2] (Enter = ${padrao}): `)).trim();
      modo = resposta === '1' ? 'local' : resposta === '2' ? 'servidor' : padrao;
    } finally { rl.close(); }
  }
  modo = normalizarModo(modo || 'local');

  let base = '';
  if (modo === 'servidor') {
    const indiceModo = argumentos.findIndex((item) => String(item).toLowerCase() === modo);
    const dominioPosicional = indiceModo >= 0 && argumentos[indiceModo + 1] && !argumentos[indiceModo + 1].startsWith('--') ? argumentos[indiceModo + 1] : '';
    let dominio = valorDaOpcao('--dominio') || dominioPosicional || env.APP_BASE_URL;
    if (!dominio && !modoNaoInterativo && terminalInterativo) {
      const rl = createInterface({ input, output });
      try { dominio = (await rl.question('Domínio ou URL HTTPS do Studio: ')).trim(); } finally { rl.close(); }
    }
    if (!dominio) throw new Error('O modo servidor exige --dominio ou APP_BASE_URL no .env.');
    base = normalizarUrlBase(dominio);
  }
  return { modo, base, detectado, env };
}

async function salvarModo(diretorioDoProjeto, escolha) {
  const env = escolha.env;
  const valores = {
    APP_MODE: escolha.modo,
    APP_BASE_URL: escolha.base,
    PREVIEW_HOST: '127.0.0.1',
    PREVIEW_PORT: env.PREVIEW_PORT || '4173',
    PREVIEW_TOKEN_TTL_HOURS: env.PREVIEW_TOKEN_TTL_HOURS || '168',
    IMAGE_PUBLIC_BASE_URL: escolha.modo === 'servidor' ? `${escolha.base}/midia` : ''
  };
  if (escolha.modo === 'servidor') {
    valores.PREVIEW_TOKEN_SECRET = env.PREVIEW_TOKEN_SECRET || criarSegredo();
    valores.MEDIA_TOKEN_SECRET = env.MEDIA_TOKEN_SECRET || criarSegredo();
  }
  await atualizarArquivoEnv(join(diretorioDoProjeto, '.env'), valores);
  console.log(`Modo ${escolha.modo} configurado${escolha.base ? ` para ${escolha.base}` : ''}.`);
}

function modeloPerfil({ nicho, publico, oferta, tom, cta }) {
  return `# Perfil da marca\n\nEste arquivo descreve o negócio que será atendido. Atualize-o sempre que a estratégia mudar.\n\n## Negócio e nicho\n\n${nicho}\n\n## Público prioritário\n\n${publico}\n\n## Oferta principal\n\n${oferta}\n\n## Tom de voz\n\n${tom}\n\n## Chamada para ação preferida\n\n${cta}\n\n## Limites e cuidados\n\n- Não inventar preços, promessas, resultados, depoimentos ou informações reguladas.\n- Confirmar detalhes que não estejam definidos neste arquivo antes de usá-los em uma publicação.\n`;
}

async function oferecerOnboarding(diretorioDoProjeto) {
  if (!input.isTTY || !output.isTTY) return;
  const rl = createInterface({ input, output });
  let iniciar = false;
  try {
    const resposta = (await rl.question('Executar agora o onboarding estratégico completo da marca? [S/n] ')).trim().toLowerCase();
    iniciar = !['n', 'nao', 'não'].includes(resposta);
  } finally { rl.close(); }
  if (iniciar) await executarOnboarding({ diretorioRaiz: diretorioDoProjeto });
  else console.log('Onboarding adiado. Execute depois com npm run onboarding ou use nucleo-social-media no Codex.');
}

async function instalarHabilidades(diretorioDoProjeto, modoNaoInterativo) {
  if (possui('--sem-habilidades')) return;
  let instalar = possui('--instalar-habilidades');
  if (!instalar && !modoNaoInterativo && input.isTTY && output.isTTY) {
    const rl = createInterface({ input, output });
    try {
      const resposta = (await rl.question('Instalar ou atualizar as habilidades internas no Codex? [S/n] ')).trim().toLowerCase();
      instalar = !['n', 'nao', 'não'].includes(resposta);
    } finally { rl.close(); }
  }
  if (!instalar) { console.log('Habilidades não instaladas; é necessária autorização explícita.'); return; }
  const destino = resolve(valorDaOpcao('--destino-habilidades') ?? join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills'));
  const nomes = ['nucleo-social-media', 'configurar-instagram', 'copywriter-instagram', 'criar-carrossel', 'criar-post-individual', 'criar-post-anuncio', 'planejar-conteudo'];
  await mkdir(destino, { recursive: true });
  for (const nome of nomes) {
    const origem = join(diretorioDoProjeto, 'habilidades', nome);
    if (!(await existe(join(origem, 'SKILL.md')))) throw new Error(`Habilidade ausente ou inválida: ${nome}.`);
    await cp(origem, join(destino, nome), { recursive: true, force: true });
  }
  console.log(`${nomes.length} habilidades instaladas ou atualizadas no Codex.`);
}

function abrirGuia(caminho) {
  const comando = process.platform === 'win32' ? 'cmd.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', caminho] : [caminho];
  const processo = spawn(comando, args, { detached: true, stdio: 'ignore' }); processo.unref();
}

async function oferecerGuias(diretorioDoProjeto, modoNaoInterativo, modo) {
  if (modoNaoInterativo || !input.isTTY || !output.isTTY) return;
  const rl = createInterface({ input, output });
  try {
    const guia = modo === 'servidor' ? 'configurar-vps.md' : 'configurar-meta.md';
    const abrir = (await rl.question(`Abrir agora documentacao/${guia}? [s/N] `)).trim().toLowerCase();
    if (['s', 'sim'].includes(abrir)) abrirGuia(join(diretorioDoProjeto, 'documentacao', guia));
  } finally { rl.close(); }
}

async function executarDiagnostico(diretorioDoProjeto) {
  console.log('\nDiagnóstico:');
  execFileSync(process.execPath, [join(diretorioDoProjeto, 'automacoes', 'diagnosticar.mjs'), '--diretorio', diretorioDoProjeto], { cwd: diretorioDoProjeto, stdio: 'inherit' });
}

async function main() {
  if (possui('--ajuda')) { mostrarAjuda(); return; }
  const diretorioDoProjeto = resolve(valorDaOpcao('--diretorio') ?? diretorioPadrao);
  const modoNaoInterativo = possui('--sem-interacao');
  if (!(await existe(join(diretorioDoProjeto, 'package.json'))) || !(await existe(join(diretorioDoProjeto, '.env.example')))) throw new Error('Diretório sem a estrutura esperada.');
  verificarRuntime();
  if (!possui('--sem-instalar')) instalarDependencias(diretorioDoProjeto);
  await garantirDiretorios(diretorioDoProjeto);
  await criarEnvSeNecessario(diretorioDoProjeto);
  const escolha = await escolherModo({ diretorioDoProjeto, modoNaoInterativo });
  await salvarModo(diretorioDoProjeto, escolha);
  if (escolha.modo === 'servidor') {
    const resultado = await gerarConfigVps({ diretorioRaiz: diretorioDoProjeto });
    console.log(`Arquivos de implantação gerados para revisão em ${resultado.destino}.`);
  }
  if (!modoNaoInterativo) await oferecerOnboarding(diretorioDoProjeto);
  await instalarHabilidades(diretorioDoProjeto, modoNaoInterativo);
  await oferecerGuias(diretorioDoProjeto, modoNaoInterativo, escolha.modo);
  await executarDiagnostico(diretorioDoProjeto);
  console.log('\nConfiguração concluída. Nenhuma publicação ou alteração de sistema foi executada.');
}

if (process.argv[1] === arquivoAtual) main().catch((erro) => {
  console.error(`Configuração interrompida: ${erro.message}`);
  process.exitCode = 1;
});

export { modeloPerfil };
