import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');

const vazio = (valor) => !valor || /^(a definir|pendente|nao_iniciado)$/i.test(String(valor).trim());
const corHex = (valor, padrao) => /^#[0-9a-f]{6}$/i.test(String(valor).trim()) ? String(valor).trim().toLowerCase() : padrao;

async function perguntar(rl, rotulo, atual = '') {
  const sufixo = !vazio(atual) ? ` [Enter preserva: ${atual}]` : '';
  const resposta = (await rl.question(`${rotulo}${sufixo}: `)).trim();
  return resposta || (!vazio(atual) ? atual : 'A definir');
}

function extrairSecao(markdown, titulo) {
  const padrao = new RegExp(`^## ${titulo}\\s*\\r?\\n+([\\s\\S]*?)(?=^## |\\Z)`, 'mi');
  return markdown.match(padrao)?.[1]?.trim().replace(/\n+/g, ' ') || '';
}

function extrairCampo(markdown, rotulo) {
  const escapado = rotulo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return markdown.match(new RegExp(`^- ${escapado}:\\s*(.+)$`, 'mi'))?.[1]?.trim().replaceAll('`', '') || '';
}

export function montarDesignSystem(dados) {
  return `# Design system da marca

## Essência visual

- Personalidade: ${dados.personalidade}
- Sensação principal: ${dados.sensacao}
- Nível de energia: ${dados.energia}
- Grau de formalidade: ${dados.formalidade}

## Princípios de direção de arte

${dados.principios}

## Paleta

- Primária: \`${dados.primaria}\`
- Secundária: \`${dados.secundaria}\`
- Fundo principal: \`${dados.fundo}\`
- Texto principal: \`${dados.texto}\`
- Acento: \`${dados.acento}\`

Uso e proporção das cores: ${dados.usoCores}

## Tipografia

- Títulos: ${dados.fonteTitulo}
- Texto: ${dados.fonteTexto}
- Ênfases e números: ${dados.enfase}
- Regras de caixa, peso e espaçamento: ${dados.regrasTipo}

## Fotografia e pessoas

- Tratamento fotográfico: ${dados.fotografia}
- Enquadramentos, cenários, luz e expressão: ${dados.enquadramento}
- Identidade pessoal: usar somente fotos autorizadas em \`recursos/fotos/\` e reprovar resultados que não preservem a pessoa.

## Composição

- Densidade e espaço negativo: ${dados.densidade}
- Formas, texturas e componentes: ${dados.componentes}
- Hierarquia típica: ${dados.hierarquia}
- Margens seguras: manter textos, rostos, logos e CTAs afastados das bordas.

## Logo

- Arquivo principal: ${dados.logo}
- Uso: aplicar o arquivo oficial de \`recursos/logos/\`; nunca pedir ao gerador que redesenhe o logo.

## Referências

Use \`recursos/referencias/\` para inspiração de ritmo, composição e tratamento. Referências não substituem este design system e nunca autorizam cópia literal.

## Anti-padrões

${dados.antiPadroes}

## Aplicação por formato

- Carrossel: manter continuidade visual e variação de ritmo entre slides.
- Post individual: uma ideia e um ponto focal dominante.
- Criativo de anúncio: priorizar hipótese, oferta e leitura rápida.
- Preview: exibir os PNGs finais sem redesenhar as peças em HTML.
`;
}

export function montarTokens(dados) {
  const familia = (valor) => String(valor).replace(/["';{}]/g, '').trim() || 'Arial';
  return `:root {\n  --brand-primary: ${dados.primaria};\n  --brand-secondary: ${dados.secundaria};\n  --brand-accent: ${dados.acento};\n  --brand-background: ${dados.fundo};\n  --brand-surface: #ffffff;\n  --brand-text: ${dados.texto};\n  --brand-text-muted: ${dados.textoSuave};\n\n  --brand-font-heading: "${familia(dados.fonteTitulo)}", sans-serif;\n  --brand-font-body: "${familia(dados.fonteTexto)}", sans-serif;\n\n  --brand-radius-small: 12px;\n  --brand-radius-medium: 20px;\n  --brand-radius-large: 32px;\n  --brand-space-safe: 72px;\n  --brand-shadow: 0 18px 45px rgb(0 0 0 / 14%);\n}\n`;
}

export function montarIdentidadeVisual(dados) {
  return `# Configuração estruturada usada pelos scripts locais.\nperfil:\n  usuario: ${dados.usuario}\n  avatar: ${dados.avatar}\n  verificado: false\n\npreview:\n  curtidas:\n  horario: Agora\n\ntema:\n  cor_fundo: "${dados.fundo}"\n  cor_texto: "${dados.texto}"\n  cor_destaque: "${dados.primaria}"\n  cor_secundaria: "${dados.secundaria}"\n  cor_acento: "${dados.acento}"\n  fonte_titulo: "${dados.fonteTitulo}"\n  fonte_texto: "${dados.fonteTexto}"\n\nbrand:\n  design_system: recursos/brand/design-system.md\n  tokens: recursos/brand/tokens.css\n`;
}

export function montarPerfil(dados) {
  return `# Perfil da marca

## Negócio e nicho

${dados.negocio}

## Público prioritário

${dados.publico}

## Momento, dores e desejos do público

${dados.contextoPublico}

## Posicionamento e ponto de vista

${dados.posicionamento}

## Oferta principal

${dados.oferta}

## Transformação e mecanismo

${dados.transformacao}

## Provas e ativos de autoridade

${dados.provas}

## Tom de voz

${dados.tom}

## Vocabulário e expressões

${dados.vocabulario}

## Chamada para ação preferida

${dados.cta}

## Objetivos do Instagram

${dados.objetivos}

## Capacidade de produção

${dados.capacidade}

## Limites e cuidados

${dados.limites}

- Não inventar preços, promessas, resultados, depoimentos ou informações reguladas.
- Confirmar detalhes não definidos antes de usá-los em uma publicação.
`;
}

export async function executarOnboarding({ diretorioRaiz = raizPadrao, terminalInterativo = input.isTTY && output.isTTY } = {}) {
  if (!terminalInterativo) throw new Error('O onboarding guiado exige um terminal interativo. No Codex, use a habilidade nucleo-social-media.');
  const caminho = join(diretorioRaiz, 'conteudos', 'perfil-da-marca.md');
  const atual = await readFile(caminho, 'utf8');
  const caminhoDesign = join(diretorioRaiz, 'recursos', 'brand', 'design-system.md');
  const designAtual = await readFile(caminhoDesign, 'utf8');
  const identidadeAtual = await readFile(join(diretorioRaiz, 'conteudos', 'identidade-visual.yml'), 'utf8');
  const rl = createInterface({ input, output });
  try {
    console.log('\nOnboarding estratégico do Social Media Studio');
    console.log('Percurso: 1) ambiente  2) perfil  3) voz  4) identidade  5) pilares  6) primeiro post  7) aprovação e publicação.');
    console.log('Responda o que souber. Pressione Enter para preservar respostas existentes.\n');
    console.log('Onboarding — etapas 2 e 3 de 7: perfil, estratégia e voz\n');
    const dados = {
      negocio: await perguntar(rl, 'Negócio, especialidade e nicho', extrairSecao(atual, 'Negócio e nicho')),
      publico: await perguntar(rl, 'Público prioritário', extrairSecao(atual, 'Público prioritário')),
      contextoPublico: await perguntar(rl, 'Momento, dores, desejos e objeções do público', extrairSecao(atual, 'Momento, dores e desejos do público')),
      posicionamento: await perguntar(rl, 'Posicionamento, crença ou ponto de vista', extrairSecao(atual, 'Posicionamento e ponto de vista')),
      oferta: await perguntar(rl, 'Oferta principal e condições confirmadas', extrairSecao(atual, 'Oferta principal')),
      transformacao: await perguntar(rl, 'Transformação entregue e como ela acontece', extrairSecao(atual, 'Transformação e mecanismo')),
      provas: await perguntar(rl, 'Provas, casos, experiência ou ativos de autoridade', extrairSecao(atual, 'Provas e ativos de autoridade')),
      tom: await perguntar(rl, 'Tom de voz', extrairSecao(atual, 'Tom de voz')),
      vocabulario: await perguntar(rl, 'Palavras que usa e palavras que evita', extrairSecao(atual, 'Vocabulário e expressões')),
      cta: await perguntar(rl, 'CTA preferido', extrairSecao(atual, 'Chamada para ação preferida')),
      objetivos: await perguntar(rl, 'Objetivos do Instagram', extrairSecao(atual, 'Objetivos do Instagram')),
      capacidade: await perguntar(rl, 'Frequência e formatos que consegue produzir', extrairSecao(atual, 'Capacidade de produção')),
      limites: await perguntar(rl, 'Restrições, promessas proibidas ou cuidados', extrairSecao(atual, 'Limites e cuidados'))
    };
    await writeFile(caminho, montarPerfil(dados), 'utf8');
    console.log('\nOnboarding — etapa 4 de 7: identidade visual');
    console.log('Agora vamos configurar uma direção reproduzível. Depois, o planejador criará pilares e o briefing do primeiro post. Use cores hexadecimais, como #2a9d8f.\n');
    const visual = {
      personalidade: await perguntar(rl, 'Personalidade visual', extrairCampo(designAtual, 'Personalidade')),
      sensacao: await perguntar(rl, 'Sensação que a marca deve transmitir', extrairCampo(designAtual, 'Sensação principal')),
      energia: await perguntar(rl, 'Nível de energia visual', extrairCampo(designAtual, 'Nível de energia')),
      formalidade: await perguntar(rl, 'Grau de formalidade', extrairCampo(designAtual, 'Grau de formalidade')),
      principios: await perguntar(rl, 'Três princípios de direção de arte', extrairSecao(designAtual, 'Princípios de direção de arte')),
      primaria: corHex(await perguntar(rl, 'Cor primária', extrairCampo(designAtual, 'Primária')), '#2a9d8f'),
      secundaria: corHex(await perguntar(rl, 'Cor secundária', extrairCampo(designAtual, 'Secundária')), '#142c2c'),
      fundo: corHex(await perguntar(rl, 'Cor de fundo principal', extrairCampo(designAtual, 'Fundo principal')), '#f4f1ea'),
      texto: corHex(await perguntar(rl, 'Cor de texto principal', extrairCampo(designAtual, 'Texto principal')), '#142c2c'),
      acento: corHex(await perguntar(rl, 'Cor de acento', extrairCampo(designAtual, 'Acento')), '#e9c46a'),
      textoSuave: '#5f6b6b',
      usoCores: await perguntar(rl, 'Como as cores devem ser distribuídas', ''),
      fonteTitulo: await perguntar(rl, 'Fonte de títulos', extrairCampo(designAtual, 'Títulos')),
      fonteTexto: await perguntar(rl, 'Fonte de textos', extrairCampo(designAtual, 'Texto')),
      enfase: await perguntar(rl, 'Estilo para ênfases e números', extrairCampo(designAtual, 'Ênfases e números')),
      regrasTipo: await perguntar(rl, 'Regras de caixa, peso e espaçamento', extrairCampo(designAtual, 'Regras de caixa, peso e espaçamento')),
      fotografia: await perguntar(rl, 'Tratamento fotográfico', extrairCampo(designAtual, 'Tratamento fotográfico')),
      enquadramento: await perguntar(rl, 'Enquadramentos, cenários, luz e expressão', ''),
      densidade: await perguntar(rl, 'Densidade e espaço negativo', ''),
      componentes: await perguntar(rl, 'Formas, texturas e componentes recorrentes', ''),
      hierarquia: await perguntar(rl, 'Hierarquia visual típica', ''),
      logo: await perguntar(rl, 'Caminho do logo principal ou A definir', extrairCampo(designAtual, 'Arquivo principal')),
      antiPadroes: await perguntar(rl, 'Estilos e elementos que a marca não deve usar', '')
    };
    const usuario = identidadeAtual.match(/^\s{2}usuario:\s*(.*)$/m)?.[1]?.trim() || 'seu_perfil';
    const avatar = identidadeAtual.match(/^\s{2}avatar:\s*(.*)$/m)?.[1]?.trim() || '';
    await writeFile(caminhoDesign, montarDesignSystem(visual), 'utf8');
    await writeFile(join(diretorioRaiz, 'recursos', 'brand', 'tokens.css'), montarTokens(visual), 'utf8');
    await writeFile(join(diretorioRaiz, 'conteudos', 'identidade-visual.yml'), montarIdentidadeVisual({ ...visual, usuario, avatar }), 'utf8');
    await writeFile(join(diretorioRaiz, 'conteudos', 'estado-do-studio.yml'), `versao: 2\nonboarding:\n  status: em_andamento\n  etapa_atual: pilares_e_pauta\n  perfil: preenchido\n  identidade_visual: preenchida\n  pilares: pendente\n  primeiro_briefing: pendente\n  primeiro_post: pendente\n  validacao_usuario: pendente\n  integracao_instagram: pendente\n  integracao_telegram: opcional\n  primeira_publicacao: pendente\nproducao:\n  ultimo_briefing:\n  proximo_passo: criar_pilares_e_primeiro_post\n`, 'utf8');
    console.log('\nPerfil e identidade visual salvos.');
    console.log('Onboarding ainda em andamento — etapa 5 de 7: pilares e primeira pauta.');
    console.log('Próxima ação concreta: abra este projeto no Codex e peça ao nucleo-social-media para continuar o onboarding guiado. Ele criará os pilares e o primeiro post individual; depois pedirá a aprovação do job no chat e publicará na Meta.');
  } finally { rl.close(); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  executarOnboarding().catch((erro) => { console.error(`Onboarding interrompido: ${erro.message}`); process.exitCode = 1; });
}
