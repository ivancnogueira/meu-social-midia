import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { gerarHtml } from './criar-previa.mjs';
import { escreverJsonAtomico, lerEnv } from './lib/arquivos.mjs';
import { criarUrlMidia } from './lib/configuracao.mjs';
import { coresDaIdentidade, localizarFotoAutorizada, localizarLogoAutorizado, validarIdentidadeParaArte } from './lib/identidade.mjs';
import { integracoesValidadasRecentemente } from './validar-integracoes.mjs';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const opcao = (nome) => { const i = process.argv.indexOf(nome); return i < 0 ? undefined : process.argv[i + 1]; };
const escapar = (valor = '') => String(valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugSeguro = (slug) => /^[a-z0-9-]+$/.test(slug || '');

function linhas(texto, maximo = 20) {
  const palavras = String(texto).trim().split(/\s+/); const saida = []; let atual = '';
  for (const palavra of palavras) { const teste = atual ? `${atual} ${palavra}` : palavra; if (teste.length > maximo && atual) { saida.push(atual); atual = palavra; } else atual = teste; }
  if (atual) saida.push(atual); return saida;
}

function svgSlide({ titulo, apoio = '', indice, total, cores, direcao = {} }) {
  const tituloLinhas = linhas(titulo, titulo.length > 95 ? 18 : 22).slice(0, 7);
  const tamanhoTitulo = tituloLinhas.length <= 3 ? 88 : tituloLinhas.length <= 5 ? 72 : 60;
  const entrelinha = Math.round(tamanhoTitulo * 1.13);
  const inicioTitulo = 372;
  const tituloSvg = tituloLinhas.map((linha, i) => `<text x="104" y="${inicioTitulo + i * entrelinha}" font-size="${tamanhoTitulo}" font-weight="800" letter-spacing="-${Math.max(1, Math.round(tamanhoTitulo / 34))}" fill="${escapar(cores.texto)}">${escapar(linha)}</text>`).join('');
  const inicioApoio = Math.min(1030, inicioTitulo + tituloLinhas.length * entrelinha + 96);
  const apoioSvg = linhas(apoio, 48).slice(0, 2).map((linha, i) => `<text x="128" y="${inicioApoio + 44 + i * 42}" font-size="30" font-weight="500" fill="${escapar(cores.texto)}" opacity=".84">${escapar(linha)}</text>`).join('');
  const selo = direcao.selo || 'IDEIA PRÁTICA';
  const assinatura = direcao.assinatura || cores.usuario || 'Sua marca';
  const estrutura = String(direcao.estrutura || '').toLowerCase();
  const layout = String(direcao.layout || '').toLowerCase();
  const etapas = Array.isArray(direcao.etapas) ? direcao.etapas.filter(Boolean).slice(0, 4) : [];
  const usaFluxo = /fluxo|etapa|processo|diagrama/.test(`${layout} ${estrutura}`) && etapas.length >= 2;
  const usaPainel = /card|painel|editorial|bloco/.test(estrutura);
  const painel = usaPainel ? `<rect x="80" y="${inicioApoio - 22}" width="920" height="${apoio ? 142 : 86}" rx="28" fill="#ffffff" opacity=".76"/>` : '';
  const formas = usaFluxo
    ? `<path d="M0 0H1080V184H0Z" fill="${escapar(cores.secundaria)}"/><rect x="80" y="76" width="12" height="1198" rx="6" fill="${escapar(cores.destaque)}"/>`
    : usaPainel
    ? `<path d="M774 90H1080V512C998 430 911 364 774 326Z" fill="${escapar(cores.secundaria)}" opacity=".96"/><circle cx="912" cy="248" r="126" fill="${escapar(cores.acento)}" opacity=".88"/><circle cx="912" cy="248" r="72" fill="${escapar(cores.destaque)}"/>`
    : `<path d="M700 0H1080V580C952 486 871 393 700 344Z" fill="${escapar(cores.destaque)}" opacity=".88"/><path d="M768 0H1080V286C965 242 886 183 768 168Z" fill="${escapar(cores.acento)}" opacity=".82"/>`;
  const inicioFluxo = 875;
  const fluxo = usaFluxo ? etapas.map((etapa, i) => {
    const x = 104 + i * Math.floor(872 / etapas.length); const largura = Math.floor(820 / etapas.length);
    const seta = i < etapas.length - 1 ? `<text x="${x + largura + 10}" y="${inicioFluxo + 68}" font-size="34" font-weight="800" fill="${escapar(cores.destaque)}">→</text>` : '';
    return `<rect x="${x}" y="${inicioFluxo}" width="${largura}" height="164" rx="18" fill="${escapar(cores.secundaria)}"/><rect x="${x}" y="${inicioFluxo}" width="${largura}" height="8" rx="4" fill="${escapar(cores.destaque)}"/><text x="${x + 24}" y="${inicioFluxo + 44}" font-size="19" font-weight="700" fill="${escapar(cores.acento)}" letter-spacing="2">${String(i + 1).padStart(2, '0')}</text><text x="${x + 24}" y="${inicioFluxo + 94}" font-size="27" font-weight="800" fill="#ffffff">${escapar(String(etapa).slice(0, 18))}</text>${seta}`;
  }).join('') : '';
  const topo = usaFluxo ? `<rect x="104" y="68" width="${Math.min(560, 54 + selo.length * 17)}" height="54" rx="27" fill="#ffffff" opacity=".98"/><text x="132" y="104" font-size="23" font-weight="800" fill="${escapar(cores.secundaria)}" letter-spacing="1.8">${escapar(selo.toUpperCase())}</text>` : `<rect x="104" y="112" width="${Math.min(360, 44 + selo.length * 17)}" height="52" rx="26" fill="${escapar(cores.secundaria)}"/><text x="128" y="146" font-size="23" font-weight="700" fill="#ffffff" letter-spacing="1.8">${escapar(selo.toUpperCase())}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><defs><pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="${escapar(cores.secundaria)}" stroke-opacity=".10" stroke-width="1"/></pattern></defs><rect width="1080" height="1350" fill="${escapar(cores.fundo)}"/><rect width="1080" height="1350" fill="url(#grid)"/>${formas}${!usaFluxo ? `<rect x="80" y="76" width="12" height="1198" rx="6" fill="${escapar(cores.destaque)}"/>` : ''}<g font-family="${escapar(cores.fonteTitulo)},Arial,sans-serif">${topo}<text x="104" y="${usaFluxo ? 250 : 232}" font-size="28" font-weight="700" fill="${escapar(cores.texto)}" opacity=".58">${String(indice).padStart(2,'0')} / ${String(total).padStart(2,'0')}</text>${tituloSvg}</g>${painel}<g font-family="${escapar(cores.fonteTexto)},Arial,sans-serif">${apoioSvg}${fluxo}<line x1="104" y1="1210" x2="976" y2="1210" stroke="${escapar(cores.secundaria)}" stroke-opacity=".22"/><text x="104" y="1254" font-size="27" font-weight="700" fill="${escapar(cores.texto)}">${escapar(assinatura)}</text><text x="976" y="1254" text-anchor="end" font-size="24" font-weight="700" fill="${escapar(cores.destaque)}">${escapar(direcao.ctaVisual || 'SALVE ESTE POST')}</text></g></svg>`;
}

export async function criarConteudo(dados, diretorioRaiz = raiz) {
  if (!slugSeguro(dados.slug)) throw new Error('Use um slug com letras minúsculas, números e hífens.');
  if (!['carrossel', 'post-individual', 'post-anuncio'].includes(dados.tipo)) throw new Error('Tipo inválido.');
  if (!Array.isArray(dados.slides) || !dados.slides.length || dados.slides.length > 10) throw new Error('Informe de 1 a 10 slides.');
  const imagensEntrada = Array.isArray(dados.imagens) ? dados.imagens : [];
  if (imagensEntrada.length && imagensEntrada.length !== dados.slides.length) throw new Error('imagens e slides precisam ter a mesma quantidade.');
  const mapa = { carrossel: 'carrosseis', 'post-individual': 'posts-individuais', 'post-anuncio': 'posts-de-anuncio' };
  const pasta = join(diretorioRaiz, 'saidas', mapa[dados.tipo], dados.slug); await mkdir(pasta, { recursive: true });
  const identidade = await readFile(join(diretorioRaiz, 'conteudos', 'identidade-visual.yml'), 'utf8');
  const env = await lerEnv(join(diretorioRaiz, '.env'));
  const cores = coresDaIdentidade(identidade);
  const exigeIdentidade = dados.primeiroPostOnboarding === true || dados.exigirIdentidadeVisual === true;
  if (exigeIdentidade) {
    await validarIdentidadeParaArte(diretorioRaiz, dados.direcaoVisual);
    if (dados.primeiroPostOnboarding === true && env.INSTAGRAM_ACCESS_TOKEN && !(await integracoesValidadasRecentemente(diretorioRaiz))) throw new Error('Integrações ainda não foram validadas por conexão real. Execute npm run validar:integracoes antes da primeira arte.');
  }
  const logo = await localizarLogoAutorizado(diretorioRaiz, dados.logo || '');
  const fotoDestaque = await localizarFotoAutorizada(diretorioRaiz, dados.fotoDestaque || dados.direcaoVisual?.fotoDestaque || '');
  const imagens = [];
  for (let i = 0; i < dados.slides.length; i++) {
    const nome = `slide-${String(i + 1).padStart(2, '0')}.png`; const destino = join(pasta, nome);
    if (imagensEntrada.length) {
      const informado = String(imagensEntrada[i] || '');
      if (!informado || isAbsolute(informado)) throw new Error('Use caminhos relativos para as imagens geradas.');
      const origem = resolve(diretorioRaiz, informado);
      const limite = `${resolve(diretorioRaiz)}${sep}`;
      if (!origem.startsWith(limite)) throw new Error('Imagem fora do diretório do projeto.');
      const png = await sharp(origem).resize(1080, 1350, { fit: 'contain', background: cores.fundo }).png().toBuffer();
      await writeFile(destino, png);
    } else {
      let arte = await sharp(Buffer.from(svgSlide({ ...dados.slides[i], indice: i + 1, total: dados.slides.length, cores, direcao: dados.direcaoVisual }))).png().toBuffer();
      const camadas = [];
      if (fotoDestaque) {
        const fotoNormalizada = await sharp(fotoDestaque).resize(300, 374, { fit: 'cover', position: 'attention' }).png().toBuffer();
        const moldura = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="324" height="398"><rect x="0" y="0" width="324" height="398" rx="34" fill="${escapar(cores.fundo)}"/><rect x="10" y="10" width="304" height="378" rx="26" fill="none" stroke="${escapar(cores.acento)}" stroke-width="4"/></svg>`);
        camadas.push({ input: fotoNormalizada, left: 706, top: 126 }, { input: moldura, left: 694, top: 114 });
      }
      if (logo) {
        const logoNormalizado = await sharp(logo).resize({ width: 150, height: 84, fit: 'inside', withoutEnlargement: true }).png().toBuffer();
        camadas.push({ input: logoNormalizado, left: 830, top: 1140 });
      }
      if (camadas.length) arte = await sharp(arte).composite(camadas).png().toBuffer();
      await writeFile(destino, arte);
    }
    imagens.push(destino);
  }
  const id = String(dados.id || dados.slug).toUpperCase();
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

async function main() { const entrada = opcao('--dados') || process.argv.slice(2).find((item)=>!item.startsWith('--')); if (!entrada) throw new Error('Uso: npm run criar-conteudo -- arquivo.json'); const dados = JSON.parse(await readFile(resolve(entrada), 'utf8')); const resultado = await criarConteudo(dados); console.log(`Conteúdo preparado: ${resultado.imagens.length} PNG(s) em 1080x1350 e preview local.`); }
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => { console.error(`Conteúdo não criado: ${erro.message}`); process.exitCode = 1; });
