import test from 'node:test';
import assert from 'node:assert/strict';
import {
  atualizarEnvTexto, criarTokenMidia, criarTokenPreview, criarUrlMidia, criarUrlPreview,
  detectarAmbiente, normalizarUrlBase, validarTokenMidia, validarTokenPreview
} from '../automacoes/lib/configuracao.mjs';

test('normaliza domínio HTTPS e rejeita caminhos', () => {
  assert.equal(normalizarUrlBase('studio.exemplo.com'), 'https://studio.exemplo.com');
  assert.throws(() => normalizarUrlBase('http://studio.exemplo.com'), /HTTPS/);
  assert.throws(() => normalizarUrlBase('https://studio.exemplo.com/admin'), /somente o domínio/);
});

test('detecção recomenda servidor sem substituir decisão do usuário', async () => {
  const resultado = await detectarAmbiente({ plataforma: 'linux', ambiente: { SSH_CONNECTION: 'x' }, accessFn: async () => { throw Object.assign(new Error('não'), { code: 'ENOENT' }); } });
  assert.equal(resultado.recomendacao, 'servidor');
  assert.ok(resultado.sinais.includes('sessão SSH'));
});

test('atualiza env preservando campos e gera links assinados', () => {
  const env = atualizarEnvTexto('TOKEN=preservado\nAPP_MODE=\n', { APP_MODE: 'servidor', APP_BASE_URL: 'https://studio.exemplo.com' });
  assert.match(env, /TOKEN=preservado/);
  assert.match(env, /APP_MODE=servidor/);
  const segredo = 'segredo-de-teste';
  const tokenPreview = criarTokenPreview(segredo, 'teste', 2_000_000_000);
  assert.equal(validarTokenPreview(segredo, 'teste', tokenPreview, 1_900_000_000_000), true);
  assert.equal(validarTokenPreview(segredo, 'outro', tokenPreview, 1_900_000_000_000), false);
  const tokenMidia = criarTokenMidia(segredo, 'carrosseis/teste/slide-01.png');
  assert.equal(validarTokenMidia(segredo, 'carrosseis/teste/slide-01.png', tokenMidia), true);
  assert.match(criarUrlMidia('https://studio.exemplo.com/midia', 'carrosseis/teste/slide-01.png', segredo), /^https:\/\/studio\.exemplo\.com\/midia\//);
  assert.match(criarUrlPreview({ base: 'https://studio.exemplo.com', slug: 'teste', segredo, agora: 1_900_000_000_000 }), /\/revisao\/teste\?token=/);
});
