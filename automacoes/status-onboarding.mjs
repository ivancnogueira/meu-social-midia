import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raizPadrao = join(dirname(fileURLToPath(import.meta.url)), '..');

const etapas = [
  { campo: 'perfil', numero: 2, nome: 'perfil estratégico', acao: 'No Codex, o nucleo-social-media deve concluir negócio, público, oferta, posicionamento, voz, objetivos e limites.' },
  { campo: 'ativos_visuais', numero: 3, nome: 'inventário de ativos visuais', acao: 'O usuário deve declarar fotos, logo, referências e direitos de uso — ou aprovar explicitamente a ausência de cada item nesta primeira peça.' },
  { campo: 'identidade_visual', numero: 3, nome: 'identidade visual', acao: 'Escolha “já tenho identidade” ou “quero criar”; o núcleo deve sincronizar brandbook, design system, tokens e identidade-visual.yml.' },
  { campo: 'direcao_visual', numero: 3, nome: 'direção visual aprovada', acao: 'Mostre conceito, ponto focal, composição, componentes e tratamento; só avance após aprovação explícita da direção.' },
  { campo: 'integracao_instagram', numero: 4, nome: 'configurações Meta e hospedagem', acao: 'Oriente a criação do app Meta, repositório GitHub Pages ou domínio e o preenchimento local do .env, sem revelar segredos.' },
  { campo: 'pilares', numero: 5, nome: 'pilares e primeira pauta', acao: 'No Codex, o nucleo-social-media deve acionar planejar-conteudo para propor e validar de três a cinco pilares.' },
  { campo: 'primeiro_briefing', numero: 5, nome: 'briefing do primeiro post', acao: 'No Codex, planejar-conteudo deve criar um briefing executável e encaminhá-lo ao copywriter-instagram.' },
  { campo: 'primeiro_post', numero: 5, nome: 'primeiro post e preview', acao: 'No Codex, o copywriter e a habilidade visual adequada devem gerar a arte final, o manifesto e o preview para revisão.' },
  { campo: 'validacao_usuario', numero: 5, nome: 'aprovação visual do primeiro post', acao: 'Mostre o preview e aplique os ajustes solicitados antes de preparar a publicação.' },
  { campo: 'primeira_publicacao', numero: 6, nome: 'primeira publicação', acao: 'Valide a URL HTTPS, faça dry-run, crie o job, peça no chat APROVAR ID-DO-JOB e publique somente essa versão pela API oficial.' }
];

function campoYaml(conteudo, nome) {
  return conteudo.match(new RegExp(`^ {2}${nome}:\\s*(.*?)\\s*$`, 'm'))?.[1] || 'pendente';
}

export function analisarEstadoOnboarding(conteudo) {
  const status = campoYaml(conteudo, 'status');
  const pendente = etapas.find((etapa) => !['preenchido', 'preenchida', 'validado', 'pronto', 'aprovado', 'configurado', 'publicado'].includes(campoYaml(conteudo, etapa.campo)));
  return { status, pendente, pronto: status === 'pronto' && !pendente };
}

export async function mostrarStatusOnboarding(diretorioRaiz = raizPadrao) {
  const conteudo = await readFile(join(resolve(diretorioRaiz), 'conteudos', 'estado-do-studio.yml'), 'utf8');
  const estado = analisarEstadoOnboarding(conteudo);
  console.log('\nEstado do onboarding:');
  if (estado.pronto) {
    console.log('- Studio instalado: estratégia validada e primeira publicação registrada.');
    console.log('- Próxima ação: criar a próxima publicação.');
    return estado;
  }
  console.log('- Instalação técnica: concluída.');
  console.log(`- Onboarding estratégico: em andamento — etapa ${estado.pendente.numero} de 6 (${estado.pendente.nome}).`);
  console.log(`- Próxima ação concreta: ${estado.pendente.acao}`);
  console.log('- Para retomar no terminal: npm run onboarding. Para a experiência completa, abra o projeto no Codex e peça para continuar o onboarding guiado.');
  return estado;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mostrarStatusOnboarding(process.argv[2] || raizPadrao).catch((erro) => {
    console.error(`Não foi possível ler o onboarding: ${erro.message}`);
    process.exitCode = 1;
  });
}
