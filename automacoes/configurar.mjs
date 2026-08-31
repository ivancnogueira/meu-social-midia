import { access, copyFile, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const arquivoAtual = fileURLToPath(import.meta.url);
const diretorioDoScript = dirname(arquivoAtual);
const diretorioPadrao = resolve(diretorioDoScript, '..');
const argumentos = process.argv.slice(2);

function valorDaOpcao(nome) {
  const indice = argumentos.indexOf(nome);
  if (indice === -1) return undefined;
  const valor = argumentos[indice + 1];
  if (!valor || valor.startsWith('--')) {
    throw new Error(`A opção ${nome} precisa de um caminho.`);
  }
  return valor;
}

function possui(nome) {
  return argumentos.includes(nome);
}

function mostrarAjuda() {
  console.log(`Uso: npm run configurar -- [opções]

Opções:
  --sem-interacao          Cria apenas o necessário, sem perguntas.
  --sem-instalar           Não executa npm install.
  --sem-habilidades        Não instala as habilidades no Codex.
  --instalar-habilidades   Instala habilidades também no modo não interativo.
  --destino-habilidades    Diretório alternativo para instalar habilidades.
  --diretorio              Diretório do projeto (útil para testes locais).
  --ajuda                  Mostra esta ajuda.`);
}

async function existe(caminho) {
  try {
    await access(caminho, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function verificarRuntime() {
  const versao = Number(process.versions.node.split('.')[0]);
  if (!Number.isInteger(versao) || versao < 20) {
    throw new Error('É necessário usar Node.js 20 ou superior. Instale ou atualize o Node.js e tente novamente.');
  }

  try {
    execFileSync('git', ['--version'], { stdio: 'ignore' });
  } catch {
    throw new Error('Git não foi encontrado. Instale o Git e tente novamente.');
  }
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
    'conteudos',
    'documentacao',
    'previas',
    'recursos/logos',
    'recursos/fotos',
    'recursos/referencias',
    'saidas/carrosseis',
    'saidas/posts-individuais',
    'saidas/posts-de-anuncio',
    'runtime',
    'logs'
  ];

  await Promise.all(diretorios.map((pasta) => mkdir(join(diretorioDoProjeto, pasta), { recursive: true })));
}

async function criarEnvSeNecessario(diretorioDoProjeto) {
  const destino = join(diretorioDoProjeto, '.env');
  if (await existe(destino)) {
    console.log('.env preservado: nenhuma configuração existente foi substituída.');
    return;
  }

  await copyFile(join(diretorioDoProjeto, '.env.example'), destino);
  console.log('.env criado a partir de .env.example. Preencha-o somente no seu computador.');
}

function modeloPerfil({ nicho, publico, oferta, tom, cta }) {
  return `# Perfil da marca

Este arquivo descreve o negócio que será atendido. Atualize-o sempre que a estratégia mudar.

## Negócio e nicho

${nicho}

## Público prioritário

${publico}

## Oferta principal

${oferta}

## Tom de voz

${tom}

## Chamada para ação preferida

${cta}

## Limites e cuidados

- Não inventar preços, promessas, resultados, depoimentos ou informações reguladas.
- Confirmar detalhes que não estejam definidos neste arquivo antes de usá-los em uma publicação.
`;
}

async function perguntarPerfil(diretorioDoProjeto) {
  const caminhoPerfil = join(diretorioDoProjeto, 'conteudos', 'perfil-da-marca.md');
  const atual = await readFile(caminhoPerfil, 'utf8');
  const ehModelo = atual.includes('<!-- social-media-studio: modelo-inicial -->');
  const terminalInterativo = input.isTTY && output.isTTY;
  if (!terminalInterativo) return;

  const rl = createInterface({ input, output });
  try {
    if (!ehModelo) {
      const atualizar = (await rl.question('Já existem dados de negócio. Atualizar o perfil? [s/N] ')).trim().toLowerCase();
      if (!['s', 'sim'].includes(atualizar)) {
        console.log('Perfil existente preservado.');
        return;
      }
    }

    console.log('\nResponda com o que já souber; "A definir" pode ser refinado depois.');
    const respostas = {
      nicho: (await rl.question('Nicho ou tipo de negócio: ')).trim() || 'A definir',
      publico: (await rl.question('Público prioritário: ')).trim() || 'A definir',
      oferta: (await rl.question('Oferta principal: ')).trim() || 'A definir',
      tom: (await rl.question('Tom de voz: ')).trim() || 'A definir',
      cta: (await rl.question('CTA preferido: ')).trim() || 'A definir'
    };

    await writeFile(caminhoPerfil, modeloPerfil(respostas), 'utf8');
    console.log('Perfil inicial salvo em conteudos/perfil-da-marca.md.');
  } finally {
    rl.close();
  }
}

async function instalarHabilidades(diretorioDoProjeto, modoNaoInterativo) {
  if (possui('--sem-habilidades')) return;

  let instalar = possui('--instalar-habilidades');
  const terminalInterativo = input.isTTY && output.isTTY;
  if (!instalar && !modoNaoInterativo && terminalInterativo) {
    const rl = createInterface({ input, output });
    try {
      const resposta = (await rl.question('Instalar ou atualizar as habilidades internas no Codex? [S/n] ')).trim().toLowerCase();
      instalar = !['n', 'nao', 'não'].includes(resposta);
    } finally {
      rl.close();
    }
  }

  if (!instalar) {
    console.log('Habilidades não instaladas. Execute novamente e confirme quando quiser instalá-las.');
    return;
  }

  const destino = resolve(
    valorDaOpcao('--destino-habilidades')
      ?? join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills')
  );
  const origem = join(diretorioDoProjeto, 'habilidades');
  const nomes = [
    'nucleo-social-media',
    'configurar-instagram',
    'copywriter-instagram',
    'criar-carrossel',
    'criar-post-individual',
    'criar-post-anuncio',
    'planejar-conteudo'
  ];

  await mkdir(destino, { recursive: true });
  for (const nome of nomes) {
    const origemDaHabilidade = join(origem, nome);
    if (!(await existe(join(origemDaHabilidade, 'SKILL.md')))) {
      throw new Error(`Habilidade ausente ou inválida: ${nome}.`);
    }
    await cp(origemDaHabilidade, join(destino, nome), { recursive: true, force: true });
  }
  console.log(`${nomes.length} habilidades instaladas ou atualizadas em um diretório local do Codex.`);
}

function abrirGuia(caminho) {
  const comando = process.platform === 'win32' ? 'cmd.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  const args = process.platform === 'win32' ? ['/c', 'start', '', caminho] : [caminho];
  const processo = spawn(comando, args, { detached: true, stdio: 'ignore' });
  processo.unref();
}

async function oferecerGuias(diretorioDoProjeto, modoNaoInterativo) {
  if (modoNaoInterativo || !input.isTTY || !output.isTTY) return;
  const rl = createInterface({ input, output });
  try {
    const abrirMeta = (await rl.question('Abrir agora o guia de configuração da Meta? [s/N] ')).trim().toLowerCase();
    if (['s', 'sim'].includes(abrirMeta)) abrirGuia(join(diretorioDoProjeto, 'documentacao', 'configurar-meta.md'));

    const abrirTelegram = (await rl.question('Abrir também o guia do Telegram? [s/N] ')).trim().toLowerCase();
    if (['s', 'sim'].includes(abrirTelegram)) abrirGuia(join(diretorioDoProjeto, 'documentacao', 'configurar-telegram.md'));
  } finally {
    rl.close();
  }
}

async function executarDiagnostico(diretorioDoProjeto) {
  console.log('\nDiagnóstico local:');
  execFileSync(process.execPath, [join(diretorioDoProjeto, 'automacoes', 'diagnosticar.mjs')], {
    cwd: diretorioDoProjeto,
    stdio: 'inherit'
  });
}

async function main() {
  if (possui('--ajuda')) {
    mostrarAjuda();
    return;
  }

  const diretorioDoProjeto = resolve(valorDaOpcao('--diretorio') ?? diretorioPadrao);
  const modoNaoInterativo = possui('--sem-interacao');
  if (!(await existe(join(diretorioDoProjeto, 'package.json'))) || !(await existe(join(diretorioDoProjeto, '.env.example')))) {
    throw new Error('O diretório informado não contém a estrutura esperada do Social Media Studio.');
  }

  verificarRuntime();
  if (!possui('--sem-instalar')) instalarDependencias(diretorioDoProjeto);
  await garantirDiretorios(diretorioDoProjeto);
  await criarEnvSeNecessario(diretorioDoProjeto);
  await perguntarPerfil(diretorioDoProjeto);
  await instalarHabilidades(diretorioDoProjeto, modoNaoInterativo);
  await oferecerGuias(diretorioDoProjeto, modoNaoInterativo);
  await executarDiagnostico(diretorioDoProjeto);
  console.log('\nConfiguração inicial concluída. Nenhuma publicação foi criada ou enviada.');
}

main().catch((erro) => {
  console.error(`Configuração interrompida: ${erro.message}`);
  process.exitCode = 1;
});

export { modeloPerfil };
