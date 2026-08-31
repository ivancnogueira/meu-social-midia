import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { alterarJob, criarJob, listarJobs } from './lib/fila.mjs';
import { lerEnv } from './lib/arquivos.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const opcao = (nome) => { const i = process.argv.indexOf(nome); return i < 0 ? undefined : process.argv[i + 1]; };

export async function processarAcao({ diretorioRaiz = raiz, codigo, chatId, remetente, acao, observacao = '' }) {
  const env = await lerEnv(join(diretorioRaiz, '.env'));
  const chat = String(chatId ?? remetente ?? '');
  const usuario = String(remetente ?? chatId ?? '');
  if (!env.TELEGRAM_AUTHORIZED_CHAT_ID || chat !== String(env.TELEGRAM_AUTHORIZED_CHAT_ID)) throw new Error('Chat não autorizado.');
  if (env.TELEGRAM_AUTHORIZED_USER_ID && usuario !== String(env.TELEGRAM_AUTHORIZED_USER_ID)) throw new Error('Remetente não autorizado.');
  return alterarJob(diretorioRaiz, String(codigo).toUpperCase(), usuario, acao, observacao);
}

async function main() {
  const pos = process.argv.slice(2).filter((item) => !item.startsWith('--'));
  if (process.argv.includes('--criar')) {
    const caminho = opcao('--dados') || pos[0];
    if (!caminho) throw new Error('Informe o caminho de publicacao.json.');
    const job = await criarJob(raiz, JSON.parse(await readFile(resolve(caminho), 'utf8')));
    console.log(`Tarefa ${job.id} pronta para aprovação.`);
    return;
  }
  if (process.argv.includes('--listar')) {
    for (const job of await listarJobs(raiz, opcao('--status'))) console.log(`${job.id}: ${job.status}`);
    return;
  }
  const acao = ['aprovar', 'ajuste', 'cancelar'].find((item) => process.argv.includes(`--${item}`));
  const codigo = acao ? opcao(`--${acao}`) : '';
  const remetente = opcao('--remetente');
  const chatId = opcao('--chat') || remetente;
  if (!acao || !codigo || !remetente || !chatId) throw new Error('Informe ação, código, --chat e --remetente.');
  const job = await processarAcao({ codigo, chatId, remetente, acao, observacao: opcao('--observacao') || '' });
  console.log(`Tarefa ${job.id}: ${job.status}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(`Aprovação não processada: ${erro.message}`);
  process.exitCode = 1;
});
