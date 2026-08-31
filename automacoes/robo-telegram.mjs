import { readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerEnv, escreverJsonAtomico } from './lib/arquivos.mjs';
import { listarJobs } from './lib/fila.mjs';
import { processarAcao } from './ponte-de-aprovacao.mjs';
import { criarUrlPreview } from './lib/configuracao.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const limitar = (texto, maximo) => String(texto || '').length > maximo ? `${String(texto).slice(0, maximo - 1)}…` : String(texto || '');

export function interpretarTelegram(update) {
  const mensagem = update.message || update.callback_query?.message;
  const chatId = String(mensagem?.chat?.id || '');
  const remetente = String(update.callback_query?.from?.id || update.message?.from?.id || mensagem?.chat?.id || '');
  const texto = String(update.callback_query?.data || mensagem?.text || '').trim();
  const partes = texto.match(/^(APROVAR|AJUSTE|CANCELAR)(?::|\s+)([A-Z0-9-]+)(?:\s+(.+))?$/i);
  if (!partes) return null;
  return {
    chatId,
    remetente,
    acao: { APROVAR: 'aprovar', AJUSTE: 'ajuste', CANCELAR: 'cancelar' }[partes[1].toUpperCase()],
    codigo: partes[2].toUpperCase(),
    observacao: partes[3] || ''
  };
}

async function api(token, metodo, body, fetchFn = fetch) {
  const resposta = await fetchFn(`https://api.telegram.org/bot${token}/${metodo}`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body)
  });
  const dados = await resposta.json();
  if (!dados.ok) throw new Error(`Telegram recusou ${metodo}.`);
  return dados.result;
}

async function enviarFoto(token, chatId, caminho, legenda = '', fetchFn = fetch) {
  const formulario = new FormData();
  formulario.set('chat_id', chatId);
  formulario.set('photo', new Blob([await readFile(caminho)]), basename(caminho));
  if (legenda) formulario.set('caption', limitar(legenda, 1024));
  const resposta = await fetchFn(`https://api.telegram.org/bot${token}/sendPhoto`, { method: 'POST', body: formulario });
  const dados = await resposta.json();
  if (!dados.ok) throw new Error('Telegram recusou sendPhoto.');
  return dados.result;
}

export function montarResumo(job, env, agora = Date.now()) {
  const publicacao = job.publicacao || {};
  const link = publicacao.slug && env.APP_MODE === 'servidor' && env.APP_BASE_URL && env.PREVIEW_TOKEN_SECRET
    ? criarUrlPreview({ base: env.APP_BASE_URL, slug: publicacao.slug, segredo: env.PREVIEW_TOKEN_SECRET, ttlHoras: env.PREVIEW_TOKEN_TTL_HOURS, agora })
    : '';
  const partes = [
    `Publicação ${job.id} pronta para revisão.`,
    publicacao.titulo ? `Título: ${publicacao.titulo}` : '',
    publicacao.legenda ? `\nLegenda:\n${limitar(publicacao.legenda, 2800)}` : '',
    link ? `\nPreview protegido:\n${link}` : '\nOs slides foram enviados acima.'
  ];
  return partes.filter(Boolean).join('\n');
}

export async function notificarPendentes(env, { diretorioRaiz = raiz, fetchFn = fetch } = {}) {
  for (const job of await listarJobs(diretorioRaiz, 'pronto_para_aprovar')) {
    if (job.telegramNotificadoEm) continue;
    const imagens = job.publicacao?.imagens || [];
    for (let i = 0; i < imagens.length; i++) {
      await enviarFoto(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_AUTHORIZED_CHAT_ID, imagens[i], `${job.id} — slide ${i + 1}/${imagens.length}`, fetchFn);
    }
    await api(env.TELEGRAM_BOT_TOKEN, 'sendMessage', {
      chat_id: env.TELEGRAM_AUTHORIZED_CHAT_ID,
      text: montarResumo(job, env),
      disable_web_page_preview: false,
      reply_markup: { inline_keyboard: [
        [{ text: 'Aprovar', callback_data: `APROVAR:${job.id}` }],
        [{ text: 'Pedir ajuste', callback_data: `AJUSTE:${job.id}` }, { text: 'Cancelar', callback_data: `CANCELAR:${job.id}` }]
      ] }
    }, fetchFn);
    job.telegramNotificadoEm = new Date().toISOString();
    await escreverJsonAtomico(join(diretorioRaiz, 'runtime', 'fila', `${job.id}.json`), job);
  }
}

async function main() {
  const env = await lerEnv(join(raiz, '.env'));
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_AUTHORIZED_CHAT_ID) throw new Error('Telegram não configurado.');
  let offset = 0;
  console.log('Robô Telegram ativo.');
  while (true) {
    await notificarPendentes(env);
    const updates = await api(env.TELEGRAM_BOT_TOKEN, 'getUpdates', { offset, timeout: 25, allowed_updates: ['message', 'callback_query'] });
    for (const update of updates) {
      offset = Math.max(offset, update.update_id + 1);
      const comando = interpretarTelegram(update);
      if (!comando) continue;
      try {
        const job = await processarAcao(comando);
        if (update.callback_query?.id) await api(env.TELEGRAM_BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id, text: `${job.id}: ${job.status}` });
        await api(env.TELEGRAM_BOT_TOKEN, 'sendMessage', {
          chat_id: env.TELEGRAM_AUTHORIZED_CHAT_ID,
          text: `${job.id}: ${job.status}.${job.status === 'aprovado' ? ' A aprovação não publica automaticamente.' : ''}`
        });
      } catch (erro) {
        if (update.callback_query?.id) await api(env.TELEGRAM_BOT_TOKEN, 'answerCallbackQuery', { callback_query_id: update.callback_query.id, text: 'Ação recusada.', show_alert: true }).catch(() => {});
        await api(env.TELEGRAM_BOT_TOKEN, 'sendMessage', { chat_id: env.TELEGRAM_AUTHORIZED_CHAT_ID, text: `Ação recusada: ${erro.message}` });
      }
    }
    await esperar(Number(env.TELEGRAM_POLL_INTERVAL_MS) || 2000);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(`Robô encerrado: ${erro.message}`);
  process.exitCode = 1;
});
