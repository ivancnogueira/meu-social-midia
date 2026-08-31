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
2. colete no chat somente dados não secretos do negócio;
3. nunca solicite tokens no chat, em argumentos de terminal ou em logs;
4. execute `npm run configurar` de forma repetível e preserve `.env` e conteúdos existentes;
5. instale as habilidades de `habilidades/` fora do repositório somente com autorização explícita;
6. conclua com `npm test` e `npm run diagnosticar`;
7. não publique nem inicie integrações externas durante a instalação.

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
