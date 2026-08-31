import { access, cp, mkdir, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const raizDoPacote = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const itensDaDistribuicao = [
  '.env.example', '.gitignore', 'AGENTS.md', 'INSTALAR-COM-CODEX.md', 'README.md',
  'package.json', 'package-lock.json', 'automacoes', 'conteudos', 'documentacao',
  'exemplos', 'habilidades', 'previas', 'recursos', 'saidas', 'templates', 'testes'
];

async function existe(caminho) {
  try { await access(caminho, constants.F_OK); return true; } catch { return false; }
}

function caminhoPermitido(origem) {
  const rel = relative(raizDoPacote, origem).replaceAll('\\', '/');
  if (!rel || rel === '.') return true;
  if (rel === '.env' || rel.startsWith('node_modules/') || rel.startsWith('.git/')) return false;
  if (/^recursos\/(fotos|logos|referencias)\/.+/.test(rel)) return rel.endsWith('/.gitkeep');
  if (/^saidas\/.+/.test(rel)) return rel.endsWith('/.gitkeep');
  if (/^previas\/.+/.test(rel)) return rel.endsWith('/.gitkeep');
  return true;
}

function indiceDoDestino(args) {
  const opcoesComValor = new Set(['--modo', '--dominio', '--destino-habilidades', '--diretorio']);
  for (let indice = 0; indice < args.length; indice++) {
    if (opcoesComValor.has(args[indice])) { indice++; continue; }
    if (!args[indice].startsWith('--')) return indice;
  }
  return -1;
}

function argumentosDoConfigurador(args) {
  const ignoradas = new Set(['--sem-configurar']);
  const indiceDestino = indiceDoDestino(args);
  return args.filter((arg, indice) => indice !== indiceDestino && !ignoradas.has(arg));
}

export async function instalarProjeto({
  args = process.argv.slice(2),
  diretorioAtual = process.cwd(),
  origem = raizDoPacote,
  executarConfiguracao = !args.includes('--sem-configurar')
} = {}) {
  const versaoNode = Number(process.versions.node.split('.')[0]);
  if (!Number.isInteger(versaoNode) || versaoNode < 20) throw new Error('Instale Node.js 20 ou superior e execute novamente.');

  const indiceDestino = indiceDoDestino(args);
  const nomeInformado = indiceDestino >= 0 ? args[indiceDestino] : 'meu-social-media';
  const destino = resolve(diretorioAtual, nomeInformado);
  const raizResolvida = resolve(origem);
  if (destino === raizResolvida || destino.startsWith(`${raizResolvida}${sep}`)) throw new Error('Escolha uma pasta fora do código-fonte do instalador.');

  if (await existe(destino)) {
    const itens = await readdir(destino);
    if (itens.length) throw new Error(`A pasta já existe e não está vazia: ${destino}`);
  } else {
    await mkdir(destino, { recursive: true });
  }

  console.log(`\nCriando o Social Media Studio em:\n${destino}\n`);
  for (const item of itensDaDistribuicao) {
    const fonte = join(raizResolvida, item);
    if (!(await existe(fonte))) throw new Error(`Arquivo necessário ausente no instalador: ${item}`);
    await cp(fonte, join(destino, item), { recursive: true, force: false, filter: caminhoPermitido });
  }

  if (!executarConfiguracao) return { destino, configurado: false };

  console.log('Arquivos preparados. Agora vou instalar e configurar tudo com você.\n');
  const resultado = spawnSync(process.execPath, [join(destino, 'automacoes', 'configurar.mjs'), ...argumentosDoConfigurador(args)], {
    cwd: destino,
    stdio: 'inherit',
    shell: false
  });
  if (resultado.error) throw resultado.error;
  if (resultado.status !== 0) throw new Error(`A configuração não terminou. Os arquivos foram preservados em ${destino}.`);

  console.log(`\nInstalação concluída. Para voltar ao projeto depois:\ncd "${destino}"`);
  return { destino, configurado: true };
}

async function main() {
  await instalarProjeto();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((erro) => { console.error(`\nNão foi possível instalar: ${erro.message}`); process.exitCode = 1; });
}
