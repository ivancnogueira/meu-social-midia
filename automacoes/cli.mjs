#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { instalarProjeto } from './instalar.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const [comando = 'ajuda', ...args] = process.argv.slice(2);
const comandos = {
  configurar: 'configurar.mjs',
  onboarding: 'onboarding.mjs',
  diagnosticar: 'diagnosticar.mjs',
  'criar-conteudo': 'criar-conteudo.mjs',
  'criar-previa': 'criar-previa.mjs',
  'atualizar-vitrine': 'atualizar-vitrine.mjs',
  aprovar: 'ponte-de-aprovacao.mjs',
  publicar: 'publicar-instagram.mjs',
  telegram: 'robo-telegram.mjs',
  'vps-config': 'gerar-config-vps.mjs'
};

function ajuda() {
  console.log(`Social Media Studio

Instalação nova, guiada:
  social-media-studio instalar [pasta]

Comandos dentro de um projeto:
  configurar, onboarding, diagnosticar, criar-conteudo, criar-previa,
  atualizar-vitrine, aprovar, publicar, telegram, vps-config`);
}

async function main() {
  if (comando === 'instalar') {
    await instalarProjeto({ args });
    return;
  }
  if (comando === 'ajuda' || !comandos[comando]) {
    ajuda();
    if (comando !== 'ajuda') process.exitCode = 1;
    return;
  }
  const resultado = spawnSync(process.execPath, [join(raiz, 'automacoes', comandos[comando]), ...args], { cwd: raiz, stdio: 'inherit' });
  if (resultado.error) throw resultado.error;
  process.exitCode = resultado.status ?? 1;
}

main().catch((erro) => { console.error(`Erro: ${erro.message}`); process.exitCode = 1; });
