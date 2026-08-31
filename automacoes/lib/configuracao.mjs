import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { access, readFile, writeFile } from 'node:fs/promises';

export const MODOS = ['local', 'servidor'];

export function normalizarModo(valor) {
  const modo = String(valor || '').trim().toLowerCase();
  if (!MODOS.includes(modo)) throw new Error('O modo deve ser "local" ou "servidor".');
  return modo;
}

export function normalizarUrlBase(valor) {
  const entrada = String(valor || '').trim();
  if (!entrada) throw new Error('Informe o domínio do modo servidor.');
  const url = new URL(/^https?:\/\//i.test(entrada) ? entrada : `https://${entrada}`);
  if (url.protocol !== 'https:') throw new Error('O modo servidor exige uma URL HTTPS.');
  if (url.username || url.password || url.search || url.hash || (url.pathname && url.pathname !== '/')) {
    throw new Error('Informe somente o domínio ou a URL HTTPS sem caminho, usuário, consulta ou fragmento.');
  }
  if (!url.hostname.includes('.') || ['localhost', '127.0.0.1'].includes(url.hostname)) {
    throw new Error('Informe um domínio público válido para o modo servidor.');
  }
  return url.origin;
}

export async function detectarAmbiente({ plataforma = process.platform, ambiente = process.env, accessFn = access } = {}) {
  const sinais = [];
  const ssh = Boolean(ambiente.SSH_CONNECTION || ambiente.SSH_TTY || ambiente.SSH_CLIENT);
  if (ssh) sinais.push('sessão SSH');
  if (plataforma === 'linux') sinais.push('Linux');
  let systemd = false;
  let container = false;
  if (plataforma === 'linux') {
    try { await accessFn('/run/systemd/system'); systemd = true; sinais.push('systemd'); } catch {}
    try { await accessFn('/.dockerenv'); container = true; sinais.push('contêiner'); } catch {}
  }
  const recomendacao = (ssh && plataforma === 'linux') || container ? 'servidor' : 'local';
  return { recomendacao, sinais, ssh, systemd, container, plataforma };
}

export function atualizarEnvTexto(texto, valores) {
  let saida = String(texto || '').replace(/\r\n/g, '\n');
  for (const [chave, valorOriginal] of Object.entries(valores)) {
    const valor = String(valorOriginal ?? '');
    if (/\r|\n/.test(valor)) throw new Error(`Valor inválido para ${chave}.`);
    const linha = `${chave}=${valor}`;
    const expressao = new RegExp(`^${chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=.*$`, 'm');
    if (expressao.test(saida)) saida = saida.replace(expressao, linha);
    else saida = `${saida.trimEnd()}\n${linha}\n`;
  }
  return saida.endsWith('\n') ? saida : `${saida}\n`;
}

export async function atualizarArquivoEnv(caminho, valores) {
  const atual = await readFile(caminho, 'utf8').catch((erro) => {
    if (erro.code === 'ENOENT') return '';
    throw erro;
  });
  await writeFile(caminho, atualizarEnvTexto(atual, valores), 'utf8');
}

export function criarSegredo(bytes = 32) {
  return randomBytes(bytes).toString('base64url');
}

function assinatura(segredo, conteudo) {
  return createHmac('sha256', segredo).update(conteudo).digest('base64url');
}

function assinaturasIguais(a, b) {
  const esquerda = Buffer.from(String(a || ''));
  const direita = Buffer.from(String(b || ''));
  return esquerda.length === direita.length && timingSafeEqual(esquerda, direita);
}

export function criarTokenPreview(segredo, slug, expiraEm) {
  if (!segredo) throw new Error('PREVIEW_TOKEN_SECRET não configurado.');
  const exp = Math.floor(Number(expiraEm));
  if (!Number.isSafeInteger(exp) || exp <= 0) throw new Error('Expiração de preview inválida.');
  return `${exp}.${assinatura(segredo, `preview:${slug}:${exp}`)}`;
}

export function validarTokenPreview(segredo, slug, token, agora = Date.now()) {
  const [expTexto, recebido, extra] = String(token || '').split('.');
  const exp = Number(expTexto);
  if (extra || !Number.isSafeInteger(exp) || exp * 1000 < agora || !recebido || !segredo) return false;
  return assinaturasIguais(recebido, assinatura(segredo, `preview:${slug}:${exp}`));
}

function caminhoUrl(relativo) {
  const partes = String(relativo || '').replaceAll('\\', '/').split('/').filter(Boolean);
  if (!partes.length || partes.some((parte) => parte === '.' || parte === '..')) throw new Error('Caminho de mídia inválido.');
  return partes.map(encodeURIComponent).join('/');
}

export function criarTokenMidia(segredo, relativo) {
  if (!segredo) return '';
  return assinatura(segredo, `midia:${caminhoUrl(relativo)}`);
}

export function validarTokenMidia(segredo, relativo, token) {
  if (!segredo) return true;
  return assinaturasIguais(token, criarTokenMidia(segredo, relativo));
}

export function criarUrlMidia(base, relativo, segredo = '') {
  const url = new URL(`${String(base).replace(/\/$/, '')}/${caminhoUrl(relativo)}`);
  const token = criarTokenMidia(segredo, relativo);
  if (token) url.searchParams.set('token', token);
  return url.toString();
}

export function criarUrlPreview({ base, slug, segredo, ttlHoras = 168, agora = Date.now() }) {
  if (!base) return '';
  const expiraEm = Math.floor(agora / 1000) + Math.max(1, Number(ttlHoras) || 168) * 3600;
  const url = new URL(`/revisao/${encodeURIComponent(slug)}`, base);
  url.searchParams.set('token', criarTokenPreview(segredo, slug, expiraEm));
  return url.toString();
}
