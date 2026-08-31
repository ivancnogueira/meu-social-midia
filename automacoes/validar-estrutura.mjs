import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const arquivos = [
  'package.json',
  '.env.example',
  'automacoes/configurar.mjs',
  'automacoes/diagnosticar.mjs',
  'automacoes/criar-previa.mjs',
  'automacoes/criar-conteudo.mjs',
  'automacoes/atualizar-vitrine.mjs',
  'automacoes/servidor-previas.mjs',
  'automacoes/publicar-instagram.mjs',
  'automacoes/ponte-de-aprovacao.mjs',
  'automacoes/robo-telegram.mjs',
  'automacoes/cli.mjs',
  'conteudos/perfil-da-marca.md',
  'conteudos/pilares-de-conteudo.md',
  'conteudos/banco-de-ideias.md',
  'conteudos/campanhas.md',
  'conteudos/identidade-visual.yml',
  'templates/preview-instagram.html',
  'exemplos/publicacao-exemplo.json',
  'documentacao/configurar-meta.md',
  'documentacao/fluxo-completo.md',
  'documentacao/configurar-telegram.md',
  'documentacao/guia-do-workshop.md'
];
const habilidades = [
  'nucleo-social-media',
  'configurar-instagram',
  'copywriter-instagram',
  'criar-carrossel',
  'criar-post-individual',
  'criar-post-anuncio',
  'planejar-conteudo'
];

async function existe(caminho) {
  try {
    await access(caminho, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const problemas = [];
  for (const arquivo of arquivos) {
    if (!(await existe(join(raiz, arquivo)))) problemas.push(`Arquivo obrigatório ausente: ${arquivo}`);
  }

  for (const habilidade of habilidades) {
    const caminho = join(raiz, 'habilidades', habilidade, 'SKILL.md');
    if (!(await existe(caminho))) {
      problemas.push(`Habilidade ausente: ${habilidade}`);
      continue;
    }
    const conteudo = await readFile(caminho, 'utf8');
    if (!conteudo.startsWith('---\n') || !conteudo.includes(`name: ${habilidade}`) || !/description:\s*\S/.test(conteudo)) {
      problemas.push(`Frontmatter inválido: habilidades/${habilidade}/SKILL.md`);
    }
  }

  if (problemas.length) {
    for (const problema of problemas) console.error(`- ${problema}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Estrutura validada: ${arquivos.length} arquivos-base e ${habilidades.length} habilidades.`);
}

main().catch((erro) => {
  console.error(`Validação interrompida: ${erro.message}`);
  process.exitCode = 1;
});
