import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gerarHtml } from '../automacoes/criar-previa.mjs';

test('gera preview com dados fictícios e sem selo obrigatório', async () => {
  const dados = JSON.parse(await readFile(new URL('./fixtures/preview-ficticio.json', import.meta.url), 'utf8'));
  dados.template = await readFile(new URL('../templates/preview-instagram.html', import.meta.url), 'utf8');
  const html = gerarHtml(dados);
  assert.match(html, /negocio_exemplo/);
  assert.match(html, /slide-01\.png/);
  assert.match(html, /verified hidden/);
  assert.doesNotMatch(html, /\{\{PREVIEW_DATA\}\}/);
});
