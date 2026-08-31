# Social Media Studio

Uma fundação local e instalável para organizar o perfil de um negócio, planejar conteúdo para Instagram e preparar o caminho para revisão, aprovação e publicação segura.

## Comece aqui

Pré-requisitos: Node.js 20 ou superior e Git.

```powershell
npm run configurar
```

O comando verifica o ambiente, instala as dependências declaradas, cria `.env` apenas se ele ainda não existir, pergunta os dados iniciais do negócio e oferece a instalação das habilidades internas do Codex. Nenhum token é pedido no terminal ou exibido em tela.

Em seguida, use:

```powershell
npm run diagnosticar
npm test
```

`diagnosticar` apenas informa se os campos necessários estão preenchidos — ele não mostra valores de credenciais nem envia conteúdo para serviços externos.

## O que o projeto entrega

- Estrutura local para conteúdo, recursos, saídas e prévias.
- Modelos legíveis em Markdown para perfil, pilares, ideias e campanhas.
- Guias de configuração manual da Meta e do Telegram.
- Sete habilidades internas genéricas para usar com Codex.
- Gerador de PNG 1080x1350 para carrossel, post individual e anúncio.
- Preview mobile, vitrine, fila auditável e publicação pela API oficial.
- Aprovação por Telegram usando long polling, sem servidor público.
- Instalador repetível que preserva `.env` e perfis já preenchidos.

## Preview genérico

Defina o perfil visual em `conteudos/identidade-visual.yml`. Para gerar uma prévia, crie um JSON com `slug`, `slides` (caminhos relativos) e a legenda; use [testes/fixtures/preview-ficticio.json](</E:/PROJETOS/social-media-studio/testes/fixtures/preview-ficticio.json>) como contrato de referência e execute:

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

O fluxo de aprovação e publicação está explicado em `documentacao/fluxo-completo.md`. O teste local não exige credenciais e não publica nada.

## Estrutura principal

```text
automacoes/      Criação, diagnóstico, aprovação, mensageria e publicação
conteudos/       Perfil do negócio, pilares, ideias e campanhas
documentacao/    Guias para instalação, Meta, Telegram e workshop
habilidades/     Habilidades internas que o instalador pode copiar ao Codex
previas/         Galeria local de prévias geradas
recursos/        Fotos, logos e referências fornecidas pelo próprio usuário
saidas/          Artefatos gerados por tipo de publicação
```

## Segurança e privacidade

- O `.env` é local e ignorado pelo Git.
- Nunca cole tokens em chats, argumentos de terminal ou documentos compartilhados.
- Use apenas recursos que você tem autorização para utilizar.
- A publicação futura exigirá identificação única, aprovação explícita e auditoria local.

Leia [PLANO-DO-PROJETO.md](PLANO-DO-PROJETO.md) para a evolução prevista e [AGENTS.md](AGENTS.md) antes de fazer alterações estruturais com Codex.
