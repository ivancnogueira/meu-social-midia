import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { lookup } from 'node:dns/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizarUrlBase } from './lib/configuracao.mjs';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');
const argumentos = process.argv.slice(2);
const valor = (nome) => { const i = argumentos.indexOf(nome); return i < 0 ? undefined : argumentos[i + 1]; };
const diretorioDoProjeto = resolve(valor('--diretorio') || raizPadrao);
const exigirMeta = argumentos.includes('--exigir-meta');
const exigirServidor = argumentos.includes('--exigir-servidor');
const exigirPages = argumentos.includes('--exigir-pages');
const verificarRede = argumentos.includes('--rede');

async function existe(caminho) {
  try { await access(caminho, constants.F_OK); return true; } catch { return false; }
}

export function lerEnvDiagnostico(conteudo) {
  const valores = new Map();
  for (const original of conteudo.split(/\r?\n/)) {
    const linha = original.trim();
    if (!linha || linha.startsWith('#')) continue;
    const separador = linha.indexOf('=');
    if (separador > 0) valores.set(linha.slice(0, separador).trim(), linha.slice(separador + 1).trim().replace(/^['"]|['"]$/g, ''));
  }
  return valores;
}

export function configurado(valor) {
  return Boolean(valor && !/^<.*>$/.test(valor) && !/^(alterar|preencher|exemplo)/i.test(valor));
}

function estadoCampo(nome, valorCampo, obrigatorio) {
  const pronto = configurado(valorCampo);
  console.log(`- ${nome}: ${pronto ? 'configurado' : obrigatorio ? 'pendente' : 'opcional pendente'}`);
  return pronto;
}

function estadoFerramenta(nome, comando, args) {
  try {
    const versao = execFileSync(comando, args, { encoding: 'utf8' }).trim().split(/\r?\n/)[0];
    console.log(`- ${nome}: disponível (${versao})`);
    return true;
  } catch { console.log(`- ${nome}: não encontrado`); return false; }
}

async function diagnosticarServidor(env) {
  console.log('Servidor/VPS:');
  let pronto = true;
  let base = '';
  try { base = normalizarUrlBase(env.get('APP_BASE_URL')); console.log('- APP_BASE_URL: configurado com HTTPS'); }
  catch { console.log('- APP_BASE_URL: pendente ou inválido'); pronto = false; }
  pronto = estadoCampo('PREVIEW_TOKEN_SECRET', env.get('PREVIEW_TOKEN_SECRET'), true) && pronto;
  pronto = estadoCampo('MEDIA_TOKEN_SECRET', env.get('MEDIA_TOKEN_SECRET'), true) && pronto;
  pronto = estadoCampo('IMAGE_PUBLIC_BASE_URL', env.get('IMAGE_PUBLIC_BASE_URL'), true) && pronto;
  estadoFerramenta('Caddy', 'caddy', ['version']);
  if (process.platform === 'linux') estadoFerramenta('systemd', 'systemctl', ['--version']);
  if (verificarRede && base) {
    try { await lookup(new URL(base).hostname); console.log('- DNS: domínio resolvido'); }
    catch { console.log('- DNS: domínio ainda não resolve'); pronto = false; }
    try {
      const resposta = await fetch(`${base}/health`, { signal: AbortSignal.timeout(8000) });
      console.log(`- HTTPS /health: ${resposta.ok ? 'disponível' : `respondeu HTTP ${resposta.status}`}`);
      if (!resposta.ok) pronto = false;
    } catch { console.log('- HTTPS /health: indisponível'); pronto = false; }
  }
  if (!pronto && exigirServidor) process.exitCode = 1;
}

async function main() {
  console.log('Diagnóstico do Social Media Studio');
  const nodeOk = Number(process.versions.node.split('.')[0]) >= 20;
  console.log(`- Node.js: ${nodeOk ? 'disponível' : 'versão incompatível'} (${process.version})`);
  if (!nodeOk) process.exitCode = 1;
  estadoFerramenta('Git', 'git', ['--version']);

  const obrigatorios = [
    'conteudos/perfil-da-marca.md', 'conteudos/pilares-de-conteudo.md', 'conteudos/banco-de-ideias.md',
    'conteudos/campanhas.md', 'documentacao/configurar-meta.md', 'habilidades/nucleo-social-media/SKILL.md'
  ];
  const ausentes = [];
  for (const arquivo of obrigatorios) if (!(await existe(join(diretorioDoProjeto, arquivo)))) ausentes.push(arquivo);
  console.log(`- Estrutura do projeto: ${ausentes.length ? `incompleta (${ausentes.join(', ')})` : 'pronta'}`);

  const caminhoEnv = join(diretorioDoProjeto, '.env');
  if (!(await existe(caminhoEnv))) {
    console.log('- .env: não encontrado. Execute npm run configurar.');
    if (exigirMeta || exigirServidor) process.exitCode = 1;
    return;
  }
  const env = lerEnvDiagnostico(await readFile(caminhoEnv, 'utf8'));
  const modo = env.get('APP_MODE') === 'servidor' ? 'servidor' : 'local';
  console.log('- .env: encontrado (valores mantidos em sigilo)');
  console.log(`- Modo: ${modo}`);
  if (modo === 'servidor') await diagnosticarServidor(env);
  else if (exigirServidor) { console.log('- Servidor/VPS: modo servidor não configurado'); process.exitCode = 1; }

  if (modo === 'local') {
    console.log('GitHub Pages:');
    const pagesPronto = [
      estadoCampo('GITHUB_PAGES_OWNER', env.get('GITHUB_PAGES_OWNER'), true),
      estadoCampo('GITHUB_PAGES_REPO', env.get('GITHUB_PAGES_REPO'), true),
      estadoCampo('GITHUB_PAGES_TOKEN', env.get('GITHUB_PAGES_TOKEN'), true)
    ].every(Boolean);
    console.log(`- GITHUB_PAGES_BRANCH: ${env.get('GITHUB_PAGES_BRANCH') || 'main (padrão)'}`);
    if (!pagesPronto) console.log('GitHub Pages: siga documentacao/configurar-github-pages.md antes da primeira publicação.');
    if (!pagesPronto && exigirPages) process.exitCode = 1;
  }

  console.log('Meta / Instagram:');
  const metaPronta = [
    estadoCampo('META_API_VERSION', env.get('META_API_VERSION'), true),
    estadoCampo('INSTAGRAM_BUSINESS_ID', env.get('INSTAGRAM_BUSINESS_ID'), true),
    estadoCampo('FACEBOOK_PAGE_ID', env.get('FACEBOOK_PAGE_ID'), true),
    estadoCampo('INSTAGRAM_ACCESS_TOKEN', env.get('INSTAGRAM_ACCESS_TOKEN'), true)
  ].every(Boolean);
  console.log('Telegram:');
  estadoCampo('TELEGRAM_BOT_TOKEN', env.get('TELEGRAM_BOT_TOKEN'), false);
  estadoCampo('TELEGRAM_AUTHORIZED_CHAT_ID', env.get('TELEGRAM_AUTHORIZED_CHAT_ID'), false);
  estadoCampo('TELEGRAM_AUTHORIZED_USER_ID', env.get('TELEGRAM_AUTHORIZED_USER_ID'), false);
  if (!metaPronta) {
    console.log('Meta / Instagram: siga documentacao/configurar-meta.md antes da integração.');
    if (exigirMeta) process.exitCode = 1;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(`Diagnóstico interrompido: ${erro.message}`);
  process.exitCode = 1;
});
