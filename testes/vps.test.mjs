import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gerarConfigVps } from '../automacoes/gerar-config-vps.mjs';

test('gera Caddy e serviços sem instalar ou expor segredos', async () => {
  const raiz = await mkdtemp(join(tmpdir(), 'sms-vps-'));
  try {
    await writeFile(join(raiz, '.env'), 'APP_MODE=servidor\nAPP_BASE_URL=https://studio.exemplo.com\nPREVIEW_PORT=4173\nPREVIEW_TOKEN_SECRET=nao-copiar\n');
    const resultado = await gerarConfigVps({ diretorioRaiz: raiz, usuario: 'studio' });
    const caddy = await readFile(join(resultado.destino, 'Caddyfile'), 'utf8');
    const servico = await readFile(join(resultado.destino, 'social-media-studio-preview.service'), 'utf8');
    const instrucoes = await readFile(join(resultado.destino, 'INSTRUCOES.txt'), 'utf8');
    assert.match(caddy, /^studio\.exemplo\.com \{/);
    assert.match(caddy, /reverse_proxy 127\.0\.0\.1:4173/);
    assert.match(servico, /NoNewPrivileges=true/);
    assert.match(instrucoes, /não foram instalados automaticamente/);
    assert.doesNotMatch(`${caddy}${servico}${instrucoes}`, /nao-copiar/);
  } finally { await rm(raiz, { recursive: true, force: true }); }
});
