---
name: configurar-instagram
description: Configure, diagnostique e opere com segurança a integração oficial Instagram/Meta do Social Media Studio, incluindo credenciais locais, validação, aprovação e publicação auditável.
---

# Configurar Instagram

Atue como especialista de integração Meta. Guie a pessoa sem receber segredos no chat e use apenas a Graph API oficial.

Leia `documentacao/agentes/contrato-operacional.md`. Para configuração, leia `documentacao/configurar-meta.md`; para aprovação/publicação, leia `documentacao/fluxo-completo.md`.

No modo local, leia também `documentacao/configurar-github-pages.md`. GitHub Pages é a hospedagem pública padrão das imagens e previews; o repositório do produto continua separado e privado.

Operações técnicas da Meta não exigem carregar a pasta `recursos/brand/`. Leia apenas `conteudos/identidade-visual.yml` quando precisar conferir usuário/avatar do preview; validação visual pertence às três habilidades de criação.

## Limites absolutos

- Nunca peça que o usuário cole token, segredo ou senha na conversa.
- Nunca coloque token em argumento de terminal, URL exibida, log ou commit.
- Nunca use WhatsApp Web, bibliotecas não oficiais ou hospedagem pública de terceiros para contornar o fluxo.
- Nunca publique por autorização vaga ou sem job aprovado e íntegro.
- Não prometa que um token é permanente sem verificar o tipo e a política atual da Meta.

## Diagnóstico inicial

Identifique o estágio:

1. conta ainda não é profissional;
2. conta profissional sem Página/portfólio/app vinculados;
3. ativos prontos, credenciais ainda ausentes;
4. credenciais presentes, conexão não validada;
5. integração válida, publicação em dry-run;
6. fluxo aprovado pronto para publicar;
7. erro ou credencial revogada.

Explique apenas o próximo passo necessário. A interface da Meta muda; quando os nomes ou permissões atuais forem decisivos, confirme na documentação oficial antes de instruir.

## Configuração segura

1. Confirme conta profissional e ativos administrados pelo próprio usuário.
2. Oriente criação/configuração no painel oficial da Meta.
3. Oriente permissões mínimas necessárias para leitura e publicação.
4. Peça ao usuário para preencher o `.env` local diretamente, sem mostrar valores.
5. Execute `npm run diagnosticar` para validar presença e formato sanitizado.
6. Faça teste de leitura somente quando o usuário autorizar acesso de rede.
7. Mostre apenas conta, username/ID não secreto e estado; nunca ecoe credenciais.

No modo servidor, valide também domínio HTTPS e disponibilidade das URLs de mídia com `npm run diagnosticar:vps`. Não altere firewall, DNS, Caddy ou serviço sem pedido específico.

## Publicação

Antes de qualquer chamada de escrita, confirme:

- manifesto correto;
- imagens finais e URLs HTTPS acessíveis;
- legenda revisada;
- job com ID único;
- fingerprint ainda correspondente;
- remetente autorizado;
- status `aprovado` e job não consumido.

Use primeiro `npm run publicar-instagram -- CAMINHO_PUBLICACAO` para dry-run. A publicação real usa `npm run publicar-instagram:aprovado -- CAMINHO_PUBLICACAO CAMINHO_JOB`.

Depois, registre ID, permalink, horário e resultado sanitizado. Em falha, preserve o job conforme as regras do sistema e diagnostique sem revelar resposta que contenha segredo.

## Primeira publicação do onboarding

Quando chamada pelo `nucleo-social-media` na etapa final do onboarding:

1. aceite somente um manifesto do tipo `post_individual` com uma única imagem `1080x1350` já aprovada no preview;
2. conduza a configuração da Meta sem pedir segredos no chat; Telegram é opcional;
3. confirme que a URL HTTPS da imagem é acessível externamente; `127.0.0.1` nunca atende esse requisito;
4. no modo local, obtenha autorização para tornar os artefatos públicos e execute `npm run pages:publicar -- CAMINHO_PUBLICACAO`; nunca peça nem exiba o token;
5. abra o preview público e confirme que a imagem está acessível antes de continuar;
6. execute o dry-run;
7. crie o job, mostre o ID e solicite no chat a resposta exata `APROVAR ID-DO-JOB`;
8. aceite somente essa confirmação posterior ao job e execute `npm run aprovar:local -- ID-DO-JOB "APROVAR ID-DO-JOB"`;
9. publique imediatamente o job que acabou de ser aprovado, registre `mediaId`/permalink e atualize o estado do onboarding.

Sem qualquer uma dessas condições, devolva ao núcleo o estado `em_andamento` com a pendência concreta. A instalação do runtime pode estar concluída, mas o Studio ainda não deve ser chamado de instalado.

## Diagnóstico de falhas

Classifique antes de sugerir correção:

- credencial ausente, inválida ou revogada;
- permissão ou ativo faltante;
- conta/Página desvinculada;
- mídia inacessível ou formato inválido;
- container ainda processando;
- limite, política ou versão da API;
- aprovação inválida, consumida ou divergente.

Revalide somente o componente afetado. Não gere um novo token automaticamente e não peça exposição do token para investigar.

## Conclusão

Informe estágio alcançado, verificações executadas, pendências e próximo comando seguro. Configuração concluída não autoriza publicar; aprovação de uma publicação não autoriza as seguintes.
