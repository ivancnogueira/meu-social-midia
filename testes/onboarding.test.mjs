import test from 'node:test';
import assert from 'node:assert/strict';
import { montarPerfil } from '../automacoes/onboarding.mjs';

test('onboarding produz perfil estratégico completo sem dados de cliente embutidos', () => {
  const perfil = montarPerfil({
    negocio: 'Negócio de teste', publico: 'Público de teste', contextoPublico: 'Contexto',
    posicionamento: 'Ponto de vista', oferta: 'Oferta', transformacao: 'Transformação e método',
    provas: 'Provas', tom: 'Tom', vocabulario: 'Vocabulário', cta: 'CTA',
    objetivos: 'Objetivos', capacidade: 'Capacidade', limites: 'Limites'
  });
  for (const secao of ['Público prioritário', 'Posicionamento e ponto de vista', 'Provas e ativos de autoridade', 'Objetivos do Instagram', 'Capacidade de produção']) assert.match(perfil, new RegExp(`## ${secao}`));
  assert.doesNotMatch(perfil, /Silvana|Pack Prosperar|Claude Code|AIOS/i);
});
