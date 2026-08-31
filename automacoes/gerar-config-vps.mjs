import { mkdir, writeFile } from 'node:fs/promises';
import { userInfo } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerEnv } from './lib/arquivos.mjs';
import { normalizarUrlBase } from './lib/configuracao.mjs';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');
const opcao = (nome) => { const i = process.argv.indexOf(nome); return i < 0 ? undefined : process.argv[i + 1]; };

function valorSystemd(valor) {
  return `"${String(valor).replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

export async function gerarConfigVps({ diretorioRaiz = raizPadrao, usuario = userInfo().username } = {}) {
  const raiz = resolve(diretorioRaiz);
  const env = await lerEnv(join(raiz, '.env'));
  if (env.APP_MODE !== 'servidor') throw new Error('Configure APP_MODE=servidor antes de gerar os arquivos da VPS.');
  const base = normalizarUrlBase(env.APP_BASE_URL);
  if (!/^[a-z_][a-z0-9_-]*$/i.test(usuario)) throw new Error('Usuário Linux inválido para o serviço.');
  const porta = Number(env.PREVIEW_PORT) || 4173;
  const destino = join(raiz, 'runtime', 'vps');
  await mkdir(destino, { recursive: true });

  const servico = (nome, script) => `[Unit]\nDescription=Social Media Studio - ${nome}\nAfter=network-online.target\nWants=network-online.target\n\n[Service]\nType=simple\nUser=${usuario}\nWorkingDirectory=${valorSystemd(raiz)}\nEnvironmentFile=${valorSystemd(join(raiz, '.env'))}\nExecStart=${valorSystemd(process.execPath)} ${valorSystemd(join(raiz, 'automacoes', script))}\nRestart=always\nRestartSec=5\nNoNewPrivileges=true\nPrivateTmp=true\nProtectSystem=strict\nReadWritePaths=${valorSystemd(raiz)}\n\n[Install]\nWantedBy=multi-user.target\n`;
  const caddy = `${new URL(base).hostname} {\n  encode zstd gzip\n  reverse_proxy 127.0.0.1:${porta}\n  header {\n    X-Content-Type-Options nosniff\n    Referrer-Policy no-referrer\n    X-Frame-Options DENY\n  }\n}\n`;
  const instrucoes = `Arquivos gerados para revisão.\n\n1. Confirme que o DNS aponta para esta VPS.\n2. Mescle Caddyfile no arquivo do Caddy; não sobrescreva configurações existentes sem revisar.\n3. Copie os arquivos .service desejados para /etc/systemd/system/.\n4. Execute: sudo systemctl daemon-reload\n5. Ative o preview: sudo systemctl enable --now social-media-studio-preview\n6. Somente depois de configurar o bot, ative: sudo systemctl enable --now social-media-studio-telegram\n7. Valide: curl -fsS ${base}/health\n\nOs arquivos não foram instalados automaticamente e nenhuma porta ou firewall foi alterado.\n`;

  await Promise.all([
    writeFile(join(destino, 'Caddyfile'), caddy, 'utf8'),
    writeFile(join(destino, 'social-media-studio-preview.service'), servico('preview', 'servidor-previas.mjs'), 'utf8'),
    writeFile(join(destino, 'social-media-studio-telegram.service'), servico('telegram', 'robo-telegram.mjs'), 'utf8'),
    writeFile(join(destino, 'INSTRUCOES.txt'), instrucoes, 'utf8')
  ]);
  return { destino, base, porta };
}

async function main() {
  const resultado = await gerarConfigVps({ diretorioRaiz: opcao('--diretorio') || raizPadrao, usuario: opcao('--usuario') || userInfo().username });
  console.log(`Configuração de VPS gerada em ${resultado.destino}. Revise antes de instalar no sistema.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((erro) => {
  console.error(`Configuração de VPS não gerada: ${erro.message}`);
  process.exitCode = 1;
});
