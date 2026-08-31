import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { gerarHtml } from './criar-previa.mjs';
import { escreverJsonAtomico, lerEnv } from './lib/arquivos.mjs';
import { criarUrlMidia } from './lib/configuracao.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const opcao = (nome) => { const i = process.argv.indexOf(nome); return i < 0 ? undefined : process.argv[i + 1]; };
const escapar = (valor = '') => String(valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugSeguro = (slug) => /^[a-z0-9-]+$/.test(slug || '');

function linhas(texto, maximo = 24) {
  const palavras = String(texto).trim().split(/\s+/); const saida = []; let atual = '';
  for (const palavra of palavras) { const teste = atual ? `${atual} ${palavra}` : palavra; if (teste.length > maximo && atual) { saida.push(atual); atual = palavra; } else atual = teste; }
  if (atual) saida.push(atual); return saida.slice(0, 6);
}

function svgSlide({ titulo, apoio = '', indice, total, cores }) {
  const tituloSvg = linhas(titulo).map((linha, i) => `<text x="90" y="${470 + i * 94}" font-size="82" font-weight="760" fill="${escapar(cores.texto)}">${escapar(linha)}</text>`).join('');
  const apoioSvg = linhas(apoio, 46).map((linha, i) => `<text x="92" y="${930 + i * 48}" font-size="34" fill="${escapar(cores.texto)}" opacity=".82">${escapar(linha)}</text>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><rect width="1080" height="1350" fill="${escapar(cores.fundo)}"/><rect x="72" y="76" width="936" height="12" rx="6" fill="${escapar(cores.destaque)}"/><text x="90" y="170" font-family="Arial,sans-serif" font-size="30" fill="${escapar(cores.texto)}" opacity=".72">${String(indice).padStart(2,'0')} / ${String(total).padStart(2,'0')}</text><g font-family="Arial,sans-serif">${tituloSvg}${apoioSvg}</g><circle cx="940" cy="1230" r="34" fill="${escapar(cores.destaque)}"/></svg>`;
}

function lerCores(yaml) {
  const obter = (chave, padrao) => (yaml.match(new RegExp(`^\\s{2}${chave}:\\s*(.+)$`, 'm'))?.[1]?.trim() || padrao).replace(/^['"]|['"]$/g, '');
  return { fundo: obter('cor_fundo', '#F4F1EA'), texto: obter('cor_texto', '#142C2C'), destaque: obter('cor_destaque', '#2A9D8F') };
}

export async function criarConteudo(dados, diretorioRaiz = raiz) {
  if (!slugSeguro(dados.slug)) throw new Error('Use um slug com letras minúsculas, números e hífens.');
  if (!['carrossel', 'post-individual', 'post-anuncio'].includes(dados.tipo)) throw new Error('Tipo inválido.');
  if (!Array.isArray(dados.slides) || !dados.slides.length || dados.slides.length > 10) throw new Error('Informe de 1 a 10 slides.');
  const mapa = { carrossel: 'carrosseis', 'post-individual': 'posts-individuais', 'post-anuncio': 'posts-de-anuncio' };
  const pasta = join(diretorioRaiz, 'saidas', mapa[dados.tipo], dados.slug); await mkdir(pasta, { recursive: true });
  const identidade = await readFile(join(diretorioRaiz, 'conteudos', 'identidade-visual.yml'), 'utf8'); const cores = lerCores(identidade);
  const imagens = [];
  for (let i = 0; i < dados.slides.length; i++) { const nome = `slide-${String(i + 1).padStart(2, '0')}.png`; const destino = join(pasta, nome); await sharp(Buffer.from(svgSlide({ ...dados.slides[i], indice: i + 1, total: dados.slides.length, cores }))).png().toFile(destino); imagens.push(destino); }
  const id = String(dados.id || dados.slug).toUpperCase();
  const env = await lerEnv(join(diretorioRaiz, '.env'));
  let urlsPublicas = Array.isArray(dados.urlsPublicas) && dados.urlsPublicas.length ? dados.urlsPublicas : [];
  if (!urlsPublicas.length && env.IMAGE_PUBLIC_BASE_URL) {
    if (env.APP_MODE === 'servidor' && !env.MEDIA_TOKEN_SECRET) throw new Error('MEDIA_TOKEN_SECRET não configurado no modo servidor.');
    urlsPublicas = imagens.map((imagem) => criarUrlMidia(env.IMAGE_PUBLIC_BASE_URL, relative(join(diretorioRaiz, 'saidas'), imagem), env.MEDIA_TOKEN_SECRET));
  }
  const publicacao = { id, slug: dados.slug, tipo: dados.tipo, titulo: dados.titulo || dados.slides[0].titulo, legenda: dados.legenda || '', imagens, urlsPublicas, status: 'rascunho', criadoEm: new Date().toISOString() };
  await escreverJsonAtomico(join(pasta, 'publicacao.json'), publicacao);
  const template = await readFile(join(diretorioRaiz, 'templates', 'preview-instagram.html'), 'utf8');
  const relativos = imagens.map((imagem) => ({ src: `../${imagem.slice(diretorioRaiz.length + 1).replaceAll('\\', '/')}`, alt: 'Arte da publicação' }));
  const preview = gerarHtml({ slug: dados.slug, titulo: publicacao.titulo, perfil: dados.perfil || {}, slides: relativos, legenda: publicacao.legenda, horario: 'Rascunho', template });
  await writeFile(join(diretorioRaiz, 'previas', `${dados.slug}.html`), preview, 'utf8');
  return publicacao;
}

async function main() { const entrada = opcao('--dados') || process.argv.slice(2).find((item)=>!item.startsWith('--')); if (!entrada) throw new Error('Uso: npm run criar-conteudo -- arquivo.json'); const dados = JSON.parse(await readFile(resolve(entrada), 'utf8')); const resultado = await criarConteudo(dados); console.log(`Conteúdo criado: ${resultado.imagens.length} PNG(s) em 1080x1350 e preview local.`); }
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => { console.error(`Conteúdo não criado: ${erro.message}`); process.exitCode = 1; });
