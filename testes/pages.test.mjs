import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { publicarNoGitHubPages } from '../automacoes/publicar-github-pages.mjs';

test('GitHub Pages envia somente entrega e grava URLs públicas sem expor token', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-pages-'));
  try {
    const pasta = join(raiz, 'saidas', 'posts-individuais', 'primeiro-post');
    await mkdir(pasta, { recursive: true });
    await mkdir(join(raiz, 'previas'), { recursive: true });
    await writeFile(join(raiz, '.env'), 'GITHUB_PAGES_OWNER=cliente\nGITHUB_PAGES_REPO=previews\nGITHUB_PAGES_BRANCH=main\nGITHUB_PAGES_TOKEN=token-secreto\n');
    const imagem = join(pasta, 'slide-01.png');
    const manifesto = join(pasta, 'publicacao.json');
    await writeFile(imagem, 'png-ficticio');
    await writeFile(join(raiz, 'previas', 'primeiro-post.html'), '<img src="../saidas/posts-individuais/primeiro-post/slide-01.png">');
    await writeFile(manifesto, JSON.stringify({ id: 'POST-001', slug: 'primeiro-post', tipo: 'post-individual', titulo: 'Primeiro', legenda: 'Legenda', imagens: [imagem], criadoEm: '2026-01-01' }));

    const chamadas = [];
    const fetchFn = async (url, opcoes = {}) => {
      chamadas.push({ url: String(url), opcoes });
      if (String(url).endsWith('/repos/cliente/previews')) return { ok: true, status: 200, json: async () => ({ private: false }) };
      if (!opcoes.method) return { ok: false, status: 404, json: async () => ({}) };
      return { ok: true, status: 201, json: async () => ({ content: { sha: 'novo' } }) };
    };
    const resultado = await publicarNoGitHubPages({ caminhoManifesto: manifesto, diretorioRaiz: raiz, fetchFn });
    assert.equal(resultado.imagens[0], 'https://cliente.github.io/previews/saidas/posts-individuais/primeiro-post/slide-01.png');
    assert.equal(chamadas.filter((item) => item.opcoes.method === 'PUT').length, 4);
    assert.ok(chamadas.every((item) => !item.url.includes('token-secreto') && !String(item.opcoes.body || '').includes('token-secreto')));
    const salvo = JSON.parse(await readFile(manifesto, 'utf8'));
    assert.equal(salvo.previewPublico, 'https://cliente.github.io/previews/previas/primeiro-post.html');
  } finally { await rm(raiz, { recursive: true, force: true }); }
});
