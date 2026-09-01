import test from 'node:test';
import assert from 'node:assert/strict';
import { montarDesignSystem, montarIdentidadeVisual, montarPerfil, montarTokens } from '../automacoes/onboarding.mjs';
import { analisarEstadoOnboarding } from '../automacoes/status-onboarding.mjs';
import { estadoAposPrimeiraPublicacao } from '../automacoes/lib/estado-onboarding.mjs';

test('onboarding produz perfil estratégico completo sem dados de cliente embutidos', () => {
  const perfil = montarPerfil({
    negocio: 'Negócio de teste', publico: 'Público de teste', contextoPublico: 'Contexto',
    posicionamento: 'Ponto de vista', oferta: 'Oferta', transformacao: 'Transformação e método',
    provas: 'Provas', tom: 'Tom', vocabulario: 'Vocabulário', cta: 'CTA',
    objetivos: 'Objetivos', capacidade: 'Capacidade', limites: 'Limites'
  });
  for (const secao of ['Público prioritário', 'Posicionamento e ponto de vista', 'Provas e ativos de autoridade', 'Objetivos do Instagram', 'Capacidade de produção']) assert.match(perfil, new RegExp(`## ${secao}`));
  assert.doesNotMatch(perfil, /marca de cliente|projeto de origem/i);
});

test('status não confunde instalação técnica com primeiro post concluído', () => {
  const andamento = analisarEstadoOnboarding(`onboarding:\n  status: em_andamento\n  perfil: preenchido\n  identidade_visual: preenchida\n  pilares: validado\n  primeiro_briefing: preenchido\n  primeiro_post: pendente\n  validacao_usuario: pendente\n`);
  assert.equal(andamento.pronto, false);
  assert.equal(andamento.pendente.campo, 'primeiro_post');

  const pronto = analisarEstadoOnboarding(`onboarding:\n  status: pronto\n  perfil: preenchido\n  identidade_visual: preenchida\n  pilares: validado\n  primeiro_briefing: preenchido\n  primeiro_post: aprovado\n  validacao_usuario: validado\n  integracao_instagram: configurado\n  primeira_publicacao: publicado\n`);
  assert.equal(pronto.pronto, true);
});

test('primeira publicação conclui somente onboarding com estratégia pronta', () => {
  const base = `onboarding:\n  status: em_andamento\n  etapa_atual: primeira_publicacao\n  perfil: preenchido\n  identidade_visual: preenchida\n  pilares: validado\n  primeiro_briefing: preenchido\n  primeiro_post: pendente\n  validacao_usuario: pendente\n  integracao_instagram: pendente\n  integracao_telegram: opcional\n  primeira_publicacao: pendente\nproducao:\n  ultimo_briefing: BRIEF-001\n  proximo_passo: publicar\n`;
  const atualizado = estadoAposPrimeiraPublicacao(base, { mediaId: 'media-1', permalink: 'https://instagram.example/p/1' });
  assert.match(atualizado, /status: pronto/);
  assert.match(atualizado, /primeira_publicacao: publicado/);
  assert.match(atualizado, /primeira_publicacao_id: "media-1"/);
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
