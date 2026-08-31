import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');

const vazio = (valor) => !valor || /^(a definir|pendente|nao_iniciado)$/i.test(String(valor).trim());

async function perguntar(rl, rotulo, atual = '') {
  const sufixo = !vazio(atual) ? ` [Enter preserva: ${atual}]` : '';
  const resposta = (await rl.question(`${rotulo}${sufixo}: `)).trim();
  return resposta || (!vazio(atual) ? atual : 'A definir');
}

function extrairSecao(markdown, titulo) {
  const padrao = new RegExp(`^## ${titulo}\\s*\\r?\\n+([\\s\\S]*?)(?=^## |\\Z)`, 'mi');
  return markdown.match(padrao)?.[1]?.trim().replace(/\n+/g, ' ') || '';
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
  const rl = createInterface({ input, output });
  try {
    console.log('\nOnboarding estratégico do Social Media Studio');
    console.log('Responda o que souber. Pressione Enter para preservar respostas existentes.\n');
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
    await writeFile(join(diretorioRaiz, 'conteudos', 'estado-do-studio.yml'), `versao: 1\nonboarding:\n  status: em_andamento\n  perfil: preenchido\n  identidade_visual: pendente\n  pilares: pendente\n  integracao_instagram: opcional\nproducao:\n  ultimo_briefing:\n  proximo_passo: validar_identidade_visual\n`, 'utf8');
    console.log('\nPerfil estratégico salvo. Próximo passo: validar identidade visual e pilares com o nucleo-social-media.');
  } finally { rl.close(); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  executarOnboarding().catch((erro) => { console.error(`Onboarding interrompido: ${erro.message}`); process.exitCode = 1; });
}
