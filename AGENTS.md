# Instruções para o Codex

Este repositório é uma ferramenta local e genérica de produção de conteúdo para Instagram. Personalize o sistema somente com os dados e ativos fornecidos pelo usuário desta instalação.

## Antes de trabalhar

1. Leia `README.md` e, em instalações novas, `INSTALAR-COM-CODEX.md`.
2. Consulte os arquivos existentes em `conteudos/` antes de criar ou alterar conteúdo.
3. Preserve configurações e respostas já preenchidas; não substitua conteúdo do usuário sem autorização.
4. Use somente fotos, logos e referências que o usuário tenha fornecido ou autorizado.

## Instalação assistida

Quando o usuário pedir para instalar ou configurar o projeto pelo chat:

Leia e siga integralmente `documentacao/onboarding-guiado.md`. Trate a instalação como um único processo: mostre os seis marcos antes da primeira pergunta, exiba o progresso em cada interação e continue automaticamente para a etapa segura seguinte. Não encerre com “quer continuar?” nem com um próximo passo sem nome, resultado e responsável.

1. verifique Node.js 20+ e Git;
2. detecte o ambiente apenas para recomendar e pergunte se o modo desejado é `local` ou `servidor`;
3. no modo servidor, pergunte o domínio e confirme separadamente antes de instalar Caddy, serviços ou alterar firewall;
4. execute `npm run configurar` de forma repetível e preserve `.env` e conteúdos existentes;
5. instale as habilidades de `habilidades/` fora do repositório somente com autorização explícita;
6. use `nucleo-social-media` para coletar somente dados não secretos e coordenar perfil, inventário de fotos/logo/referências/direitos, identidade, direção de arte aprovada, `planejar-conteudo`, pilares, primeiro briefing e um post individual completo; “pode sugerir” não autoriza presumir ativos;
7. atualize `conteudos/estado-do-studio.yml` após cada marco e nunca marque `pronto` sem a validação do usuário;
8. nunca solicite tokens no chat, em argumentos de terminal ou em logs;
9. conclua com `npm test` e `npm run diagnosticar`; use `npm run diagnosticar:vps` somente quando o domínio já deva estar acessível;
10. configure a Meta sem receber segredos no chat; no modo local, leia `documentacao/configurar-github-pages.md`, explique que os artefatos enviados serão públicos e obtenha autorização antes do upload; Telegram é uma extensão opcional; se ImageGen não estiver disponível, só ofereça fallback local após autorização e com identidade e direção visuais já validadas;
11. depois do preview revisado, crie um job único e peça no chat a confirmação exata `APROVAR ID-DO-JOB`; só então registre a aprovação local e publique esse primeiro post individual; nenhuma outra publicação é autorizada pela instalação.

“Instalação técnica concluída” não significa “Studio instalado”. Se o onboarding estiver pendente, informe a etapa exata e prossiga no mesmo atendimento. Só encerre como instalado depois de a primeira publicação real estar registrada conforme `documentacao/onboarding-guiado.md`, ou como pausado se o usuário pedir para parar ou se faltar uma condição indispensável.

## Arquivos de trabalho

- `conteudos/`: perfil, identidade visual, pilares, ideias e campanhas.
- `recursos/brand/`: design system e tokens visuais aprovados da instalação.
- `recursos/`: fotos, logos e referências do próprio usuário.
- `saidas/`: imagens e manifestos gerados.
- `previas/`: páginas HTML locais para revisão.
- `runtime/` e `logs/`: estado e auditoria locais, nunca versionados.

## Segurança e publicação

- Credenciais ficam exclusivamente no `.env` local e nunca devem aparecer em respostas, logs ou commits.
- A publicação exige identificador único, remetente autorizado, aprovação explícita e registro de auditoria.
- Não considere respostas vagas como aprovação.
- Use apenas a API oficial da Meta para Instagram e, quando a extensão opcional estiver ativa, o bot do Telegram configurado pelo usuário.
- Antes de uma ação externa, confirme que o usuário pediu a ação e que o job correto está aprovado.

## Habilidades internas

As habilidades em `habilidades/` são pequenas, genéricas e independentes de marca. Use a habilidade adequada à tarefa e siga o respectivo `SKILL.md`.
