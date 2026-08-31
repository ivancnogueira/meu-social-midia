import test from 'node:test';
import assert from 'node:assert/strict';
import { montarDesignSystem, montarIdentidadeVisual, montarPerfil, montarTokens } from '../automacoes/onboarding.mjs';

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

test('onboarding visual mantém design system, tokens e YAML coerentes', () => {
  const visual = {
    personalidade: 'Precisa', sensacao: 'Confiança', energia: 'Moderada', formalidade: 'Próxima',
    principios: '1. Clareza\n2. Contraste\n3. Consistência', primaria: '#112233', secundaria: '#223344',
    fundo: '#f4f4f4', texto: '#101010', acento: '#ee9900', textoSuave: '#666666', usoCores: 'Primária em acentos',
    fonteTitulo: 'Inter', fonteTexto: 'Source Sans 3', enfase: 'Negrito', regrasTipo: 'Títulos curtos',
    fotografia: 'Luz natural', enquadramento: 'Planos médios', densidade: 'Baixa', componentes: 'Linhas finas',
    hierarquia: 'Título, apoio, CTA', logo: 'recursos/logos/logo.svg', antiPadroes: 'Sem neon'
  };
  const design = montarDesignSystem(visual);
  const tokens = montarTokens(visual);
  const yaml = montarIdentidadeVisual({ ...visual, usuario: 'marca_teste', avatar: '' });
  for (const texto of [design, tokens, yaml]) assert.match(texto, /#112233/i);
  assert.match(design, /recursos\/logos\/logo\.svg/);
  assert.match(tokens, /--brand-font-heading: "Inter"/);
  assert.match(yaml, /design_system: recursos\/brand\/design-system\.md/);
});
