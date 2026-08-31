import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const escapar = (v='') => String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

async function localizar(pasta) { let itens=[]; for (const item of await readdir(pasta,{withFileTypes:true}).catch(()=>[])) { const caminho=join(pasta,item.name); if(item.isDirectory()) itens=itens.concat(await localizar(caminho)); else if(item.name==='publicacao.json') itens.push(caminho); } return itens; }

export async function atualizarVitrine(diretorioRaiz=raiz) {
  const arquivos=await localizar(join(diretorioRaiz,'saidas')); const publicacoes=await Promise.all(arquivos.map(async(c)=>JSON.parse(await readFile(c,'utf8'))));
  const cards=publicacoes.sort((a,b)=>String(b.criadoEm).localeCompare(String(a.criadoEm))).map((p)=>{ const thumb=p.imagens?.[0]?`../${relative(diretorioRaiz,p.imagens[0]).replaceAll('\\','/')}`:''; return `<article><img src="${escapar(thumb)}" alt="Capa"><div><span class="status">${escapar(p.status||'rascunho')}</span><h2>${escapar(p.titulo||p.slug)}</h2><a href="${encodeURIComponent(p.slug)}.html">Abrir prévia</a></div></article>`; }).join('\n');
  const html=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prévias</title><style>body{margin:0;background:#eef1f3;font:16px system-ui;color:#182124}.shell{max-width:1120px;margin:auto;padding:32px 16px}h1{font-size:clamp(32px,6vw,64px)}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}article{overflow:hidden;background:#fff;border-radius:12px;box-shadow:0 10px 28px #0001}img{width:100%;aspect-ratio:4/5;object-fit:cover;background:#ddd}article div{padding:16px}.status{font-size:12px;text-transform:uppercase;color:#566}a{display:inline-block;margin-top:10px;color:#075e62;font-weight:700}@media(max-width:850px){.grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:560px){.grid{grid-template-columns:1fr}}</style></head><body><main class="shell"><h1>Vitrine de prévias</h1><section class="grid">${cards||'<p>Nenhuma prévia criada.</p>'}</section></main></body></html>`;
  await mkdir(join(diretorioRaiz,'previas'),{recursive:true}); await writeFile(join(diretorioRaiz,'previas','index.html'),html,'utf8'); return publicacoes.length;
}
if(process.argv[1]===fileURLToPath(import.meta.url)) atualizarVitrine().then((n)=>console.log(`Vitrine atualizada com ${n} publicação(ões).`)).catch((e)=>{console.error(`Vitrine não atualizada: ${e.message}`);process.exitCode=1;});
