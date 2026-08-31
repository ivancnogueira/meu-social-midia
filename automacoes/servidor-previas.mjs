import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerEnv } from './lib/arquivos.mjs';
import { criarUrlMidia, validarTokenMidia, validarTokenPreview } from './lib/configuracao.mjs';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');
const tipos = {
  '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};
const extensoesImagem = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function cabecalhos(tipo, cache = 'no-store') {
  return {
    'content-type': tipo,
    'cache-control': cache,
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'no-referrer',
    'x-robots-tag': 'noindex, nofollow',
    'content-security-policy': "default-src 'self'; img-src 'self' data: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'"
  };
}

async function caminhoSeguro(base, pedido) {
  const relativo = String(pedido || '').replaceAll('\\', '/').replace(/^\/+/, '');
  const candidato = resolve(base, relativo);
  const rel = relative(resolve(base), candidato);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) throw new Error('Caminho recusado.');
  const [baseReal, arquivoReal] = await Promise.all([realpath(base), realpath(candidato)]);
  const relReal = relative(baseReal, arquivoReal);
  if (!relReal || relReal.startsWith('..') || isAbsolute(relReal)) throw new Error('Caminho recusado.');
  const info = await stat(arquivoReal);
  if (!info.isFile()) throw new Error('Arquivo não encontrado.');
  return arquivoReal;
}

async function enviarArquivo(res, base, pedido, extensoes, cache) {
  const caminho = await caminhoSeguro(base, pedido);
  const ext = extname(caminho).toLowerCase();
  if (!extensoes.has(ext)) throw new Error('Tipo recusado.');
  res.writeHead(200, cabecalhos(tipos[ext] || 'application/octet-stream', cache));
  res.end(await readFile(caminho));
}

function adaptarPreview(html, env) {
  const baseMidia = env.IMAGE_PUBLIC_BASE_URL || `${env.APP_BASE_URL}/midia`;
  return html.replace(/\.\.\/saidas\/([^"'\s<]+)/g, (_todo, caminho) => criarUrlMidia(baseMidia, decodeURIComponent(caminho), env.MEDIA_TOKEN_SECRET));
}

export function criarServidorPreview({ diretorioRaiz = raizPadrao, env = {} } = {}) {
  const raiz = resolve(diretorioRaiz);
  const modo = env.APP_MODE === 'servidor' ? 'servidor' : 'local';
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://local');
      const pathname = decodeURIComponent(url.pathname);
      if (pathname === '/health') {
        res.writeHead(200, cabecalhos('application/json; charset=utf-8'));
        res.end(JSON.stringify({ ok: true, modo }));
        return;
      }

      if (modo === 'servidor') {
        const revisao = pathname.match(/^\/revisao\/([a-z0-9-]+)$/i);
        if (revisao) {
          const slug = revisao[1];
          if (!validarTokenPreview(env.PREVIEW_TOKEN_SECRET, slug, url.searchParams.get('token'))) throw new Error('Token inválido.');
          const caminho = await caminhoSeguro(join(raiz, 'previas'), `${slug}.html`);
          const html = adaptarPreview(await readFile(caminho, 'utf8'), env);
          res.writeHead(200, cabecalhos('text/html; charset=utf-8'));
          res.end(html);
          return;
        }
        if (pathname.startsWith('/midia/')) {
          const relativo = pathname.slice('/midia/'.length);
          if (!validarTokenMidia(env.MEDIA_TOKEN_SECRET, relativo, url.searchParams.get('token'))) throw new Error('Token inválido.');
          await enviarArquivo(res, join(raiz, 'saidas'), relativo, extensoesImagem, 'public, max-age=86400, immutable');
          return;
        }
        throw new Error('Rota não encontrada.');
      }

      if (pathname === '/') {
        res.writeHead(302, { location: '/previas/index.html', 'cache-control': 'no-store' });
        res.end();
        return;
      }
      if (pathname.startsWith('/previas/')) {
        await enviarArquivo(res, join(raiz, 'previas'), pathname.slice('/previas/'.length), new Set(['.html']), 'no-store');
        return;
      }
      if (pathname.startsWith('/saidas/')) {
        await enviarArquivo(res, join(raiz, 'saidas'), pathname.slice('/saidas/'.length), extensoesImagem, 'no-store');
        return;
      }
      if (pathname.startsWith('/recursos/')) {
        await enviarArquivo(res, join(raiz, 'recursos'), pathname.slice('/recursos/'.length), extensoesImagem, 'no-store');
        return;
      }
      throw new Error('Rota não encontrada.');
    } catch {
      res.writeHead(404, cabecalhos('text/plain; charset=utf-8'));
      res.end('Não encontrado');
    }
  });
}

async function main() {
  const arquivoEnv = await lerEnv(join(raizPadrao, '.env'));
  const env = { ...arquivoEnv };
  for (const chave of ['APP_MODE', 'APP_BASE_URL', 'IMAGE_PUBLIC_BASE_URL', 'PREVIEW_TOKEN_SECRET', 'MEDIA_TOKEN_SECRET', 'PREVIEW_PORT']) {
    if (process.env[chave] !== undefined) env[chave] = process.env[chave];
  }
  const porta = Number(env.PREVIEW_PORT) || 4173;
  const host = '127.0.0.1';
  criarServidorPreview({ diretorioRaiz: raizPadrao, env }).listen(porta, host, () => {
    const destino = env.APP_MODE === 'servidor' ? env.APP_BASE_URL : `http://${host}:${porta}`;
    console.log(`Servidor de prévias ativo em ${destino}.`);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(`Servidor não iniciado: ${erro.message}`);
  process.exitCode = 1;
});
