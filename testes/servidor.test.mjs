import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { criarServidorPreview } from '../automacoes/servidor-previas.mjs';
import { criarTokenMidia, criarTokenPreview } from '../automacoes/lib/configuracao.mjs';

async function iniciar(raiz, env) {
  const servidor = criarServidorPreview({ diretorioRaiz: raiz, env });
  await new Promise((resolve) => servidor.listen(0, '127.0.0.1', resolve));
  const { port } = servidor.address();
  return { servidor, base: `http://127.0.0.1:${port}` };
}

test('servidor VPS protege preview, mídia e arquivos internos', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-servidor-'));
  const segredoPreview = 'preview-teste';
  const segredoMidia = 'midia-teste';
  try {
    await mkdir(join(raiz, 'previas'), { recursive: true });
    await mkdir(join(raiz, 'saidas', 'carrosseis', 'teste'), { recursive: true });
    await writeFile(join(raiz, '.env'), 'SEGREDO=nao-servir');
    await writeFile(join(raiz, 'previas', 'teste.html'), '<img src="../saidas/carrosseis/teste/slide-01.png">');
    await writeFile(join(raiz, 'saidas', 'carrosseis', 'teste', 'slide-01.png'), Buffer.from('imagem'));
    const env = { APP_MODE: 'servidor', APP_BASE_URL: 'https://studio.exemplo.com', IMAGE_PUBLIC_BASE_URL: 'https://studio.exemplo.com/midia', PREVIEW_TOKEN_SECRET: segredoPreview, MEDIA_TOKEN_SECRET: segredoMidia };
    const { servidor, base } = await iniciar(raiz, env);
    try {
      assert.equal((await fetch(`${base}/revisao/teste`)).status, 404);
      const previewToken = criarTokenPreview(segredoPreview, 'teste', Math.floor(Date.now() / 1000) + 60);
      const html = await (await fetch(`${base}/revisao/teste?token=${previewToken}`)).text();
      assert.match(html, /https:\/\/studio\.exemplo\.com\/midia\/carrosseis\/teste\/slide-01\.png\?token=/);
      assert.equal((await fetch(`${base}/.env`)).status, 404);
      assert.equal((await fetch(`${base}/midia/carrosseis/teste/slide-01.png`)).status, 404);
      const mediaToken = criarTokenMidia(segredoMidia, 'carrosseis/teste/slide-01.png');
      assert.equal((await fetch(`${base}/midia/carrosseis/teste/slide-01.png?token=${mediaToken}`)).status, 200);
      assert.deepEqual(await (await fetch(`${base}/health`)).json(), { ok: true, modo: 'servidor' });
    } finally { await new Promise((resolve) => servidor.close(resolve)); }
  } finally { await rm(raiz, { recursive: true, force: true }); }
});

test('modo local serve somente preview, saídas e recursos', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-local-'));
  try {
    await mkdir(join(raiz, 'previas'), { recursive: true });
    await mkdir(join(raiz, 'saidas'), { recursive: true });
    await mkdir(join(raiz, 'recursos'), { recursive: true });
    await writeFile(join(raiz, 'previas', 'index.html'), 'ok');
    await writeFile(join(raiz, '.env'), 'SEGREDO=nao-servir');
    const { servidor, base } = await iniciar(raiz, { APP_MODE: 'local' });
    try {
      assert.equal((await fetch(`${base}/`, { redirect: 'manual' })).status, 302);
      assert.equal(await (await fetch(`${base}/previas/index.html`)).text(), 'ok');
      assert.equal((await fetch(`${base}/.env`)).status, 404);
    } finally { await new Promise((resolve) => servidor.close(resolve)); }
  } finally { await rm(raiz, { recursive: true, force: true }); }
});
