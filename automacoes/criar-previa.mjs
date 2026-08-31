import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const valor = (nome) => { const i = process.argv.indexOf(nome); return i < 0 ? undefined : process.argv[i + 1]; };
const escapar = (texto = '') => String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const seguroJson = (dados) => JSON.stringify(dados).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

export function validarDados(dados) {
  if (!dados || !/^[a-z0-9-]+$/i.test(dados.slug || '')) throw new Error('Use um slug com letras, números e hífens.');
  if (!Array.isArray(dados.slides) || !dados.slides.length) throw new Error('Informe ao menos um slide em slides.');
  for (const slide of dados.slides) { const src = typeof slide === 'string' ? slide : slide?.src; if (!src || isAbsolute(src) || src.includes('..\\')) throw new Error('Cada slide deve usar um caminho relativo seguro.'); }
}

export function gerarHtml(dados) {
  validarDados(dados); const perfil = dados.perfil ?? {}; const usuario = perfil.usuario || 'seu_perfil'; const iniciais = usuario.replace(/[^\p{L}\p{N}]/gu, '').slice(0, 2).toUpperCase() || 'SM';
  const slides = dados.slides.map((slide) => typeof slide === 'string' ? { src: slide } : slide);
  const normalizado = { slides, legenda: dados.legenda || '', curtidas: dados.curtidas || '', horario: dados.horario || '' };
  const avatar = perfil.avatar ? `<img src="${escapar(perfil.avatar)}" alt="Avatar de ${escapar(usuario)}">` : escapar(iniciais);
  return dados.template.replaceAll('{{PAGE_TITLE}}', escapar(dados.titulo || `Prévia — ${usuario}`)).replaceAll('{{USERNAME}}', escapar(usuario)).replace('{{AVATAR}}', avatar).replace('{{VERIFIED_CLASS}}', perfil.verificado ? '' : 'hidden').replace('{{PREVIEW_DATA}}', seguroJson(normalizado));
}

async function main() {
  const entrada = valor('--dados') || process.argv.slice(2).find((item) => !item.startsWith('--')); if (!entrada) throw new Error('Uso: npm run criar-previa -- caminho/arquivo.json');
  const dados = JSON.parse(await readFile(resolve(entrada), 'utf8')); validarDados(dados);
  const [template, identidade] = await Promise.all([readFile(join(raiz, 'templates', 'preview-instagram.html'), 'utf8'), readFile(join(raiz, 'conteudos', 'identidade-visual.yml'), 'utf8')]);
  const campos = Object.fromEntries([...identidade.matchAll(/^\s{2}(usuario|avatar|verificado|curtidas|horario):\s*(.*)$/gm)].map((m) => [m[1], m[2].trim()]));
  dados.perfil = { usuario: campos.usuario || 'seu_perfil', avatar: campos.avatar || '', verificado: campos.verificado === 'true', ...dados.perfil };
  dados.curtidas ??= campos.curtidas || ''; dados.horario ??= campos.horario || ''; dados.template = template;
  const destino = join(raiz, 'previas', `${dados.slug}.html`); await mkdir(dirname(destino), { recursive: true }); await writeFile(destino, gerarHtml(dados), 'utf8');
  console.log(`Prévia criada: previas/${dados.slug}.html`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => { console.error(`Prévia não criada: ${erro.message}`); process.exitCode = 1; });
