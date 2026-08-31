# Social Media Studio

Uma fundação local e instalável para organizar o perfil de um negócio, planejar conteúdo para Instagram e preparar o caminho para revisão, aprovação e publicação segura.

## Comece aqui

Pré-requisitos: Node.js 20 ou superior e Git.

### Pelo Codex

Em uma tarefa local do Codex, envie o prompt pronto de [INSTALAR-COM-CODEX.md](INSTALAR-COM-CODEX.md). Ele pode clonar o repositório, conduzir a instalação, fazer as perguntas do perfil e executar todas as validações. Tokens continuam sendo preenchidos somente no `.env` local, nunca no chat.

### Pelo terminal

```powershell
npm run configurar
```

O comando verifica o ambiente, recomenda um perfil e pede que o usuário escolha:

- `local`: preview em `127.0.0.1` e Telegram enquanto o computador estiver ligado;
- `servidor`: VPS com domínio HTTPS, preview protegido e processos persistentes.

Ele cria `.env` apenas se ainda não existir, oferece o onboarding estratégico completo e a instalação das habilidades. Nenhum token é pedido ou exibido.

Também é possível escolher explicitamente:

```powershell
npm run configurar:local
npm run configurar:servidor -- studio.exemplo.com
```

Em seguida, use:

```powershell
npm run diagnosticar
npm test
```

O onboarding também pode ser retomado separadamente com `npm run onboarding`. Dentro do Codex, peça ao `nucleo-social-media` para conduzi-lo e coordenar os demais especialistas.

`diagnosticar` apenas informa se os campos necessários estão preenchidos — ele não mostra valores de credenciais nem envia conteúdo para serviços externos.

## O que o projeto entrega

- Estrutura local para conteúdo, recursos, saídas e prévias.
- Modelos legíveis em Markdown para perfil, pilares, ideias e campanhas.
- Guias de configuração manual da Meta e do Telegram.
- Sete habilidades especialistas com onboarding, estratégia, copy, direção de arte, integração, quality gates e handoffs.
- Pipeline ImageGen no Codex para carrossel, post individual e anúncio, com fotos, logos, referências, normalização e fallback local.
- Preview mobile, vitrine, fila auditável e publicação pela API oficial.
- Aprovação por Telegram usando long polling, sem servidor público.
- No modo servidor, preview com link temporário e URLs de mídia assinadas.
- Instalador repetível que preserva `.env` e perfis já preenchidos.

## Preview genérico

Defina o perfil visual em `conteudos/identidade-visual.yml`. Para gerar uma prévia, crie um JSON com `slug`, `slides` (caminhos relativos) e a legenda; use [exemplos/publicacao-exemplo.json](exemplos/publicacao-exemplo.json) como referência e execute:

```powershell
npm run criar-previa -- caminho/para/publicacao.json
```

O resultado fica em `previas/`. O template simula a leitura em Instagram, mas não insere uma identidade ou métricas fictícias por conta própria.

## Teste completo local

```powershell
npm run criar-conteudo -- exemplos/publicacao-exemplo.json
npm run atualizar-vitrine
npm run publicar-instagram -- saidas/carrosseis/demonstracao-removivel/publicacao.json
```

Abra a vitrine local com `npm run preview` e visite `http://127.0.0.1:4173`.

No modo servidor, siga [documentacao/configurar-vps.md](documentacao/configurar-vps.md). O Node continua restrito a `127.0.0.1`; Caddy publica somente as rotas controladas usando HTTPS.

O fluxo de aprovação e publicação está explicado em `documentacao/fluxo-completo.md`. O teste local não exige credenciais e não publica nada.

## Estrutura principal

```text
automacoes/      Criação, diagnóstico, aprovação, mensageria e publicação
conteudos/       Perfil do negócio, pilares, ideias e campanhas
documentacao/    Guias de configuração da Meta, Telegram, VPS e fluxo completo
habilidades/     Habilidades internas que o instalador pode copiar ao Codex
previas/         Galeria local de prévias geradas
recursos/        Fotos, logos e referências fornecidas pelo próprio usuário
saidas/          Artefatos gerados por tipo de publicação
```

## Segurança e privacidade

- O `.env` é local e ignorado pelo Git.
- Nunca cole tokens em chats, argumentos de terminal ou documentos compartilhados.
- Use apenas recursos que você tem autorização para utilizar.
- A publicação exige identificação única, versão imutável, aprovação explícita e auditoria local.

Leia [AGENTS.md](AGENTS.md) antes de instalar, configurar ou alterar o projeto com o Codex.
