# Contexto do projeto

Este e um repositorio novo, generico e instalavel. Ele sera vendido como uma ferramenta de social media para qualquer negocio ou profissional e tambem usado em workshops.

## Escopo

Construir um sistema local que permita:

1. instalar dependencias e habilidades do Codex com um unico comando;
2. registrar o perfil do negocio, publico, voz, oferta e pilares de conteudo;
3. criar carrosseis, posts individuais e criativos para anuncios;
4. gerar copy especifica para Instagram;
5. criar previas e artefatos de publicacao;
6. publicar no Instagram por meio da Meta Graph API, apenas apos aprovacao;
7. enviar uma solicitacao de aprovacao pelo Telegram na primeira versao;

## Limites de produto

- Nao copiar ou mencionar marcas, pessoas, ferramentas ou ativos de qualquer projeto usado como referencia durante o desenvolvimento.
- Nao incluir imagens de pessoas, logos, tokens, contas, URLs ou credenciais de clientes.
- Nao embutir `OPENAI_API_KEY` no fluxo basico. O trial precisa funcionar com texto, fotos proprias e layouts locais; imagem por IA e opcional.
- Nao publicar por uma resposta vaga. Exigir remetente autorizado, identificador unico da publicacao, confirmacao unica e registro de auditoria.
- Nao revelar tokens em saida de terminal, logs, mensagens ou commits.

## Decisoes tecnicas iniciais

- Runtime principal: Node.js 20+ e npm.
- Instalador: `npm run configurar` e, depois, uma distribuicao `npx` opcional.
- Publicacao Instagram: adaptador Node com `fetch` nativo, lendo `.env` local.
- Conteudo e configuracao: arquivos Markdown/YAML legiveis por humanos.
- Previas: HTML local e imagens exportadas. O robo pode receber a imagem diretamente; link externo fica para uma fase posterior.
- Aprovacao V1: Telegram por long polling, para evitar exigir um servidor publico no computador do cliente.

## Uso das habilidades internas

As habilidades que serao criadas em `habilidades/` precisam ser genericas, pequenas e focadas. Cada uma deve ter `SKILL.md` valido para Codex e nunca presumir uma marca especifica.

Skills esperadas:

- `nucleo-social-media`: conhece os arquivos de perfil, conteudo, saida e aprovacao;
- `configurar-instagram`: guia a configuracao manual de Meta e valida as credenciais;
- `copywriter-instagram`: escreve copy para posts, carrosseis e legendas;
- `criar-carrossel`: monta carrosseis;
- `criar-post-individual`: monta posts individuais;
- `criar-post-anuncio`: monta criativos de anuncio;
- `planejar-conteudo`: transforma ideias do cliente em calendario e briefs.

Leia `PLANO-DO-PROJETO.md` antes de tomar decisoes estruturais. Mantenha o projeto simples para instalacao autonoma.
