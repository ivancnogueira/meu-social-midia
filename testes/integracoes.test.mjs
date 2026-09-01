import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { integracoesValidadasRecentemente, validarIntegracoes } from '../automacoes/validar-integracoes.mjs';

test('valida Meta, repositório público e branch sem persistir credenciais', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-integracoes-'));
  try {
    await writeFile(join(raiz, '.env'), 'APP_MODE=local\nMETA_API_VERSION=v99.0\nINSTAGRAM_BUSINESS_ID=123\nINSTAGRAM_ACCESS_TOKEN=segredo-meta\nGITHUB_PAGES_OWNER=cliente\nGITHUB_PAGES_REPO=previas\nGITHUB_PAGES_TOKEN=segredo-github\nGITHUB_PAGES_BRANCH=main\n');
    const urls = [];
    const fetchFn = async (url) => {
      urls.push(String(url));
      if (String(url).includes('graph.facebook.com')) return { ok: true, json: async () => ({ id: '123', username: 'marca', account_type: 'BUSINESS' }) };
      if (String(url).endsWith('/branches/main')) return { ok: true, json: async () => ({ name: 'main' }) };
      return { ok: true, json: async () => ({ private: false }) };
    };
    const resultado = await validarIntegracoes({ diretorioRaiz: raiz, fetchFn, agora: new Date('2026-09-01T12:00:00Z') });
    assert.equal(resultado.meta.ok, true);
    assert.equal(resultado.pages.ok, true);
    assert.equal(await integracoesValidadasRecentemente(raiz, Date.parse('2026-09-01T13:00:00Z')), true);
    const registro = await readFile(join(raiz, 'runtime', 'validacao-integracoes.json'), 'utf8');
    assert.doesNotMatch(registro, /segredo-/);
    assert.ok(urls.every((url) => !url.includes('segredo-')));
  } finally { await rm(raiz, { recursive: true, force: true }); }
});

test('rejeita repositório privado antes de liberar primeira mídia', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-integracoes-'));
  try {
    await mkdir(join(raiz, 'runtime'), { recursive: true });
    await writeFile(join(raiz, '.env'), 'APP_MODE=local\nMETA_API_VERSION=v99.0\nINSTAGRAM_BUSINESS_ID=123\nINSTAGRAM_ACCESS_TOKEN=ok\nGITHUB_PAGES_OWNER=cliente\nGITHUB_PAGES_REPO=previas\nGITHUB_PAGES_TOKEN=ok\n');
    const fetchFn = async (url) => String(url).includes('graph.facebook.com') ? { ok: true, json: async () => ({ id: '123', username: 'marca' }) } : { ok: true, json: async () => ({ private: true }) };
    await assert.rejects(validarIntegracoes({ diretorioRaiz: raiz, fetchFn }), /repositório de preview é privado/);
  } finally { await rm(raiz, { recursive: true, force: true }); }
});
