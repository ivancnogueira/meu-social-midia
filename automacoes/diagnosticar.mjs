import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const diretorioDoProjeto = join(dirname(fileURLToPath(import.meta.url)), '..');
const exigirMeta = process.argv.includes('--exigir-meta');

async function existe(caminho) {
  try {
    await access(caminho, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function lerEnv(conteudo) {
  const valores = new Map();
  for (const linhaOriginal of conteudo.split(/\r?\n/)) {
    const linha = linhaOriginal.trim();
    if (!linha || linha.startsWith('#')) continue;
    const separador = linha.indexOf('=');
    if (separador < 1) continue;
    const chave = linha.slice(0, separador).trim();
    const valor = linha.slice(separador + 1).trim();
    valores.set(chave, valor);
  }
  return valores;
}

function configurado(valor) {
  return Boolean(valor && !/^<.*>$/.test(valor) && !/^(alterar|preencher|exemplo)/i.test(valor));
}

function estadoCampo(nome, valor, obrigatorio) {
  const estado = configurado(valor) ? 'configurado' : obrigatorio ? 'pendente' : 'opcional pendente';
  console.log(`- ${nome}: ${estado}`);
  return configurado(valor);
}

function estadoFerramenta(nome, comando, args) {
  try {
    const versao = execFileSync(comando, args, { encoding: 'utf8' }).trim();
    console.log(`- ${nome}: disponível (${versao})`);
    return true;
  } catch {
    console.log(`- ${nome}: não encontrado`);
    return false;
  }
}

async function main() {
  console.log('Diagnóstico do Social Media Studio');
  estadoFerramenta('Node.js', process.execPath, ['--version']);
  estadoFerramenta('Git', 'git', ['--version']);

  const arquivosObrigatorios = [
    'conteudos/perfil-da-marca.md',
    'conteudos/pilares-de-conteudo.md',
    'conteudos/banco-de-ideias.md',
    'conteudos/campanhas.md',
    'documentacao/configurar-meta.md',
    'habilidades/nucleo-social-media/SKILL.md'
  ];
  const ausentes = [];
  for (const arquivo of arquivosObrigatorios) {
    if (!(await existe(join(diretorioDoProjeto, arquivo)))) ausentes.push(arquivo);
  }
  console.log(`- Estrutura do projeto: ${ausentes.length ? `incompleta (${ausentes.join(', ')})` : 'pronta'}`);

  const caminhoEnv = join(diretorioDoProjeto, '.env');
  if (!(await existe(caminhoEnv))) {
    console.log('- .env: não encontrado. Execute npm run configurar.');
    if (exigirMeta) process.exitCode = 1;
    return;
  }

  const env = lerEnv(await readFile(caminhoEnv, 'utf8'));
  console.log('- .env: encontrado (valores mantidos em sigilo)');
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

  if (metaPronta) {
    console.log('Meta / Instagram: campos locais preenchidos. A validação remota será adicionada na fase de publicação.');
  } else {
    console.log('Meta / Instagram: siga documentacao/configurar-meta.md antes de testar uma integração.');
    if (exigirMeta) process.exitCode = 1;
  }
}

main().catch((erro) => {
  console.error(`Diagnóstico interrompido: ${erro.message}`);
  process.exitCode = 1;
});

export { configurado, lerEnv };
