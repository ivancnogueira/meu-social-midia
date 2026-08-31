# Instruções para o Codex

Este repositório é uma ferramenta local e genérica de produção de conteúdo para Instagram. Personalize o sistema somente com os dados e ativos fornecidos pelo usuário desta instalação.

## Antes de trabalhar

1. Leia `README.md` e, em instalações novas, `INSTALAR-COM-CODEX.md`.
2. Consulte os arquivos existentes em `conteudos/` antes de criar ou alterar conteúdo.
3. Preserve configurações e respostas já preenchidas; não substitua conteúdo do usuário sem autorização.
4. Use somente fotos, logos e referências que o usuário tenha fornecido ou autorizado.

## Instalação assistida

Quando o usuário pedir para instalar ou configurar o projeto pelo chat:

1. verifique Node.js 20+ e Git;
2. detecte o ambiente apenas para recomendar e pergunte se o modo desejado é `local` ou `servidor`;
3. no modo servidor, pergunte o domínio e confirme separadamente antes de instalar Caddy, serviços ou alterar firewall;
4. colete no chat somente dados não secretos do negócio;
5. nunca solicite tokens no chat, em argumentos de terminal ou em logs;
6. execute `npm run configurar` de forma repetível e preserve `.env` e conteúdos existentes;
7. instale as habilidades de `habilidades/` fora do repositório somente com autorização explícita;
8. conclua com `npm test` e `npm run diagnosticar`; use `npm run diagnosticar:vps` somente quando o domínio já deva estar acessível;
9. não publique nem inicie integrações externas durante a instalação.

## Arquivos de trabalho

- `conteudos/`: perfil, identidade visual, pilares, ideias e campanhas.
- `recursos/`: fotos, logos e referências do próprio usuário.
- `saidas/`: imagens e manifestos gerados.
- `previas/`: páginas HTML locais para revisão.
- `runtime/` e `logs/`: estado e auditoria locais, nunca versionados.

## Segurança e publicação

- Credenciais ficam exclusivamente no `.env` local e nunca devem aparecer em respostas, logs ou commits.
- A publicação exige identificador único, remetente autorizado, aprovação explícita e registro de auditoria.
- Não considere respostas vagas como aprovação.
- Use apenas a API oficial da Meta para Instagram e o bot do Telegram configurado pelo usuário.
- Antes de uma ação externa, confirme que o usuário pediu a ação e que o job correto está aprovado.

## Habilidades internas

As habilidades em `habilidades/` são pequenas, genéricas e independentes de marca. Use a habilidade adequada à tarefa e siga o respectivo `SKILL.md`.
