# Preparar o Telegram para aprovação

O Telegram é o primeiro canal de aprovação. O robô usa long polling e funciona enquanto o computador estiver ligado.

## Preparação segura

1. Crie um bot no fluxo oficial do Telegram.
2. Envie uma mensagem de teste ao bot para descobrir o `chat_id` autorizado.
3. Guarde o token apenas em `TELEGRAM_BOT_TOKEN` no arquivo `.env`.
4. Registre em `TELEGRAM_AUTHORIZED_CHAT_ID` somente o chat que poderá aprovar, pedir ajuste ou cancelar uma publicação.
5. Execute `npm run diagnosticar` para conferir se os campos foram preenchidos, sem revelar valores.

## Executar

1. Crie um job com `npm run aprovar:criar -- caminho/publicacao.json`.
2. Inicie `npm run telegram`.
3. Aprove pelo botão ou envie `APROVAR CODIGO`.

## Regra da ponte de aprovação

Cada solicitação tem um código único. Apenas o chat autorizado pode aprovar esse código uma única vez. Mensagens vagas não publicam conteúdo, e a aprovação não executa automaticamente um segundo job.
