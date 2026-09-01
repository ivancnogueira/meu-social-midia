# Social Media Studio

Uma fundação local e instalável para organizar o perfil de um negócio, planejar conteúdo para Instagram e preparar o caminho para revisão, aprovação e publicação segura.

## Comece aqui

Pré-requisitos: Node.js 20 ou superior e Git.

### Pelo Codex

Em uma tarefa local do Codex, envie o prompt pronto de [INSTALAR-COM-CODEX.md](INSTALAR-COM-CODEX.md). Ele pode clonar o repositório, conduzir a instalação, fazer as perguntas do perfil e executar todas as validações. Tokens continuam sendo preenchidos somente no `.env` local, nunca no chat.

### Pelo terminal

Copie e cole um único comando. Ele cria a pasta `meu-social-media`, baixa uma cópia limpa, instala as dependências e abre o assistente em português:

```text
npx --yes github:ivancnogueira/meu-social-midia instalar meu-social-media
```

Não é necessário clonar, entrar na pasta ou executar `npm install` manualmente. O instalador interrompe sem sobrescrever se a pasta escolhida já contiver arquivos.

Durante a integração com Instagram/Meta, o assistente mostra o tutorial oficial configurado em `documentacao/links-oficiais.json` e pergunta antes de abri-lo no YouTube. Enquanto o vídeo não estiver cadastrado, abre o guia local passo a passo.

O comando verifica o ambiente, recomenda um perfil e pede que o usuário escolha:

- `local`: preview local, GitHub Pages para URLs públicas e Telegram opcional;
- `servidor`: VPS com domínio HTTPS, preview protegido e processos persistentes.

Ele cria `.env` apenas se ainda não existir, oferece o onboarding estratégico completo e a instalação das habilidades. Nenhum token é pedido ou exibido.

No Codex, o onboarding segue seis marcos e vai até a primeira publicação real: instalação, perfil, identidade visual, configurações, primeiro post com preview e postagem. Ele cria briefing, copy, PNG 1080×1350, manifesto e preview de um post individual; conduz ajustes; configura Meta e hospedagem; pede no chat a confirmação exata do job e publica pela API oficial. O agente informa o progresso em cada interação e só chama o Studio de instalado quando o resultado da publicação estiver registrado. A partir daí, o usuário pode chamar diretamente as habilidades de planejamento, criação, revisão e postagem. Telegram é opcional.

Antes de criar a primeira arte, o onboarding exige fotos, logo, referências e confirmação de direitos de uso — ou uma decisão explícita e registrada de não utilizar cada elemento. Em seguida, apresenta conceito, ponto focal, composição, componentes, texto, CTA e selo para aprovação. “Pode sugerir” autoriza propostas estratégicas, mas não autoriza presumir ativos nem gerar uma arte genérica.

No modo local, a Meta ainda precisa conseguir baixar a imagem por uma URL HTTPS pública. O assistente deve configurar uma hospedagem autorizada ou pausar claramente nessa condição. No modo servidor, o domínio do Studio fornece as URLs assinadas.

O caminho padrão no modo local é um repositório público separado no GitHub Pages, pertencente ao usuário. O produto permanece privado; apenas PNGs finais, previews e a vitrine são enviados. O token fine-grained fica no `.env`, limitado àquele repositório e à permissão `Contents: write`. Como o Pages é público, o assistente pede autorização antes do primeiro upload. Veja [documentacao/configurar-github-pages.md](documentacao/configurar-github-pages.md).

Depois de instalado, também é possível reabrir a configuração dentro da pasta:

```powershell
npm run configurar:local
npm run configurar:servidor -- studio.exemplo.com
```

<details>
<summary>Instalação manual com Git</summary>

```text
git clone https://github.com/ivancnogueira/meu-social-midia.git
cd meu-social-midia
npm run configurar
```

</details>

Em seguida, use:

```powershell
npm run diagnosticar
npm test
```

O onboarding também pode ser retomado separadamente com `npm run onboarding`. Dentro do Codex, peça ao `nucleo-social-media` para conduzi-lo e coordenar os demais especialistas.

Para consultar a qualquer momento a etapa pendente e a próxima ação concreta:

```powershell
npm run status
```

O onboarding visual mantém três camadas sincronizadas:

- `recursos/brand/design-system.md`: decisões de direção de arte em linguagem humana;
- `recursos/brand/tokens.css`: cores, fontes, espaçamentos e demais valores exatos;
- `conteudos/identidade-visual.yml`: configuração estruturada consumida pelas automações e pelo preview.

As três habilidades visuais sempre leem a pasta `brand`. Planejamento e copy a consultam quando a entrega envolve formato ou texto dentro da arte. A integração Meta não carrega contexto visual em operações puramente técnicas.

O arquivo `recursos/brand/briefing-visual.md` registra os ativos autorizados e a direção aprovada da primeira peça; `recursos/brand/brandbook.md` torna a estratégia visual legível e reutilizável. O onboarding pergunta se a pessoa já tem identidade ou quer criar uma. Na segunda rota, `criar-identidade-visual` prepara um wordmark SVG editável opcional, brandbook, design system e tokens para aprovação. Sem as cinco camadas — brandbook, briefing visual, design system, tokens e YAML — a geração do onboarding é bloqueada. Se ImageGen não estiver disponível, o fallback local só é oferecido com autorização e aplica essa direção; ele não é um atalho para pular a identidade.

`diagnosticar` apenas informa se os campos necessários estão preenchidos — ele não mostra valores de credenciais nem envia conteúdo para serviços externos.

## O que o projeto entrega

- Estrutura local para conteúdo, recursos, saídas e prévias.
- Modelos legíveis em Markdown para perfil, pilares, ideias e campanhas.
- Guias de configuração da Meta, GitHub Pages e Telegram opcional.
- Oito habilidades especialistas com onboarding, estratégia, identidade visual, copy, direção de arte, integração, quality gates e handoffs.
- Pipeline ImageGen no Codex para carrossel, post individual e anúncio, com fotos, logos, referências, normalização e fallback local.
- Preview mobile, vitrine, fila auditável e publicação pela API oficial.
- Aprovação auditável diretamente no chat; Telegram por long polling como extensão opcional.
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
recursos/brand/  Design system e tokens visuais configurados no onboarding
recursos/        Fotos, logos e referências fornecidas pelo próprio usuário
saidas/          Artefatos gerados por tipo de publicação
```

## Segurança e privacidade

- O `.env` é local e ignorado pelo Git.
- Nunca cole tokens em chats, argumentos de terminal ou documentos compartilhados.
- Use apenas recursos que você tem autorização para utilizar.
- A publicação exige identificação única, versão imutável, aprovação explícita e auditoria local.

Leia [AGENTS.md](AGENTS.md) antes de instalar, configurar ou alterar o projeto com o Codex.
