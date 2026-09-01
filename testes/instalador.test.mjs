import test from 'node:test';
import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { instalarProjeto } from '../automacoes/instalar.mjs';

test('instalador cria distribuição limpa sem segredo ou artefatos de usuário', async () => {
  const base = await mkdtemp(join(tmpdir(), 'sms-instalador-'));
  try {
    const resultado = await instalarProjeto({ args: ['studio-teste', '--sem-configurar'], diretorioAtual: base });
    const pacote = JSON.parse(await readFile(join(resultado.destino, 'package.json'), 'utf8'));
    assert.equal(pacote.version, '0.7.0');
    await access(join(resultado.destino, 'recursos', 'brand', 'design-system.md'));
    await access(join(resultado.destino, 'recursos', 'brand', 'brandbook.md'));
    await access(join(resultado.destino, '.gitignore'));
    await access(join(resultado.destino, 'habilidades', 'nucleo-social-media', 'SKILL.md'));
    await access(join(resultado.destino, 'habilidades', 'criar-identidade-visual', 'SKILL.md'));
    await assert.rejects(access(join(resultado.destino, '.env')));
    assert.equal(resultado.configurado, false);
  } finally { await rm(base, { recursive: true, force: true }); }
});

test('instalador não sobrescreve pasta com arquivos', async () => {
  const base = await mkdtemp(join(tmpdir(), 'sms-instalador-cheio-'));
  try {
    const destino = join(base, 'existente');
    await mkdir(destino);
    await writeFile(join(destino, 'meu-arquivo.txt'), 'preservar');
    await assert.rejects(instalarProjeto({ args: ['existente', '--sem-configurar'], diretorioAtual: base }), /não está vazia/);
    assert.equal(await readFile(join(destino, 'meu-arquivo.txt'), 'utf8'), 'preservar');
  } finally { await rm(base, { recursive: true, force: true }); }
});
