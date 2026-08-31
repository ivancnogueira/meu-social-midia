# Documento de Continuidade do Produto

Este documento e a fonte de verdade para continuar o projeto em outra conta, outro chat ou outra maquina. Ele resume todas as decisoes tomadas antes do inicio da implementacao.

## Produto

Nome de trabalho: **Social Media Studio**.

E um repositorio novo e generico, independente de qualquer projeto anterior. Sera entregue para qualquer profissional ou negocio instalar no proprio computador e usar com Codex. Tambem sera usado em workshops e podera ser implementado pelo vendedor como um servico premium.

O produto nao pode conter:

- imagens, fotos, logos, nomes ou links de clientes ou projetos usados como referencia;
- conteudos ou tom de voz de uma marca especifica;
- tokens, `.env` ou credenciais de qualquer pessoa;
- referencias a marcas, ferramentas, pessoas ou produtos de projetos anteriores.

## Publicos e ofertas

1. **Instale voce mesmo**: pessoa compra o repositorio, roda um comando, acompanha videos e configura Meta por conta propria.
2. **Implementacao feita por voce**: mesmo produto, com acompanhamento para configurar Meta, perfil e primeira publicacao.
3. **Workshop**: cada participante instala o projeto e sai com a primeira publicacao criada e testada.

O fluxo tem de ser claro para uma pessoa nao tecnica. A promessa precisa ser realista: a instalacao e o primeiro resultado devem funcionar sem plano pago de IA; escala e imagem por IA recorrente podem exigir plano, creditos ou servicos adicionais.

## Resultado desejado para o usuario final

Depois de instalar, o usuario consegue:

1. preencher dados do proprio negocio;
2. registrar ideias, ofertas, campanhas e referencias;
3. pedir um carrossel, post individual ou criativo de anuncio;
4. receber copy, arte visual e preview;
5. aprovar, pedir ajuste ou cancelar;
6. publicar no proprio Instagram profissional;
7. receber a confirmacao com permalink.

## Trial sem plano pago

O trial nao pode depender de gerar imagens por IA dentro do Codex. O usuario pode usar fotos proprias, imagens ja existentes e layouts HTML/CSS exportados. Quando houver acesso a criacao de imagens no ChatGPT, isso sera um extra manual e nunca uma garantia de quantidade.

O pacote inicial de demonstracao deve gerar:

- um post individual;
- um mini-carrossel de cinco slides;
- legenda, CTA e hashtags opcionais;
- preview local;
- uma publicacao em modo de teste antes de qualquer postagem real.

Nao exigir `OPENAI_API_KEY` na configuracao basica. Uma chave de API, creditos ou plano pago poderao ser oferecidos depois para producao em volume, imagens por IA e automacoes avancadas.

## Configuracao Meta e Instagram

A criacao do aplicativo Meta e a obtencao de credenciais sao etapas humanas e guiadas. O instalador nao deve prometer criar o app automaticamente a partir de um token.

Entregar dois apoios para essa etapa:

- tutorial escrito com imagens e checklist;
- espaco configuravel para o link de um video do instrutor mostrando a criacao do app, vinculacao da Pagina/Instagram e geracao do token.

A configuracao deve validar, sem imprimir segredos:

- `INSTAGRAM_BUSINESS_ID`;
- `FACEBOOK_PAGE_ID`;
- `INSTAGRAM_ACCESS_TOKEN`;
- versao da API Meta;
- possibilidade de listar a conta e fazer publicacao de teste.

O `.env` sempre fica local e nunca entra no Git.

## Fluxo de aprovacao por mensageria

O Codex gera a publicacao. Um componente local chamado **ponte de aprovacao** registra uma tarefa e envia a arte e a legenda para o usuario. A aprovacao faz o processo de publicacao, sem precisar deixar uma conversa do Codex aberta.

```text
Codex cria rascunho -> fila local -> robo envia previa -> usuario aprova
-> processo local publica no Instagram -> robo devolve permalink
```

### Telegram: primeira versao

Telegram sera o primeiro canal porque requer apenas um robo e um token, sem endpoint publico. O processo local pode usar consulta continua enquanto o computador estiver ligado.

Comandos iniciais:

- botao `Aprovar`;
- botao `Pedir ajuste`;
- botao `Cancelar`;
- texto `APROVAR CODIGO` como alternativa.

O robo deve aceitar somente o `chat_id` autorizado. Apos uma aprovacao, a tarefa e encerrada e nao pode publicar de novo.

### Audios

Aprovacao por audio e uma fase posterior. Ela exige transcricao e interpretacao restrita. A primeira versao deve preferir botoes e comandos de texto, que sao claros e seguros. Quando houver audio, aceitar apenas frases explicitas associadas a um codigo da publicacao, por exemplo: `aprovar publicacao A7K3`.

## Arquitetura de diretorios pretendida

```text
social-media-studio/
  recursos/
    logos/
    fotos/
    referencias/
  conteudos/
    perfil-da-marca.md
    pilares-de-conteudo.md
    banco-de-ideias.md
    campanhas.md
  documentacao/
    configurar-meta.md
    configurar-telegram.md
    guia-do-workshop.md
  saidas/
    carrosseis/
    posts-individuais/
    posts-de-anuncio/
  previas/
  automacoes/
    configurar.mjs
    diagnosticar.mjs
    publicar-instagram.mjs
    ponte-de-aprovacao.mjs
    robo-telegram.mjs
  habilidades/
    nucleo-social-media/
    configurar-instagram/
    copywriter-instagram/
    criar-carrossel/
    criar-post-individual/
    criar-post-anuncio/
    planejar-conteudo/
  .env.example
  AGENTS.md
  PLANO-DO-PROJETO.md
  README.md
  package.json
```

Criar apenas os arquivos que forem usados de verdade; esta arvore e o destino, nao uma ordem obrigatoria de criacao.

## Instalador desejado

O primeiro alvo e um comando local simples, por exemplo:

```powershell
npm run configurar
```

Ele deve:

1. verificar Node.js e Git;
2. instalar dependencias do projeto;
3. copiar `.env.example` para `.env` somente se ainda nao houver `.env`;
4. instalar ou atualizar as habilidades internas em `~/.codex/skills` mediante confirmacao;
5. fazer perguntas sobre nicho, publico, oferta, tom e CTA;
6. gerar arquivos de perfil e conteudo iniciais;
7. abrir o guia da Meta e validar credenciais quando o usuario estiver pronto;
8. oferecer a configuracao do Telegram;
9. executar um diagnostico final compreensivel.

O instalador nunca deve solicitar um token em um argumento de terminal, imprimir token, nem sobrescrever uma configuracao existente sem confirmacao.

Depois da versao local estar estavel, o mesmo instalador pode ser distribuido por `npx` ou por um script PowerShell de bootstrap que clona o repositorio.

## Habilidades a construir

As habilidades sao parte do produto e serao copiadas pelo instalador para o diretorio tecnico de skills do Codex. Usar o padrao de Codex com uma pasta por habilidade e `SKILL.md` valido.

### nucleo-social-media

Conhece a estrutura do projeto, a separacao entre rascunho/aprovacao/publicacao, o perfil do negocio e as regras de seguranca.

### configurar-instagram

Guia os cliques manuais da Meta, explica os campos do `.env`, valida a integracao por script e nunca pede para colar segredo no chat.

### copywriter-instagram

Especialista em copy de Instagram: hooks, estruturas de carrossel, legendas, CTA, clareza, adequacao ao publico e texto para arte. Nao deve agir como copywriter de VSL ou pagina de vendas salvo pedido explicito.

### criar-carrossel

Transforma briefing e copy em sequencia de slides com hierarquia, formato Instagram e preview.

### criar-post-individual

Produz posts de uma unica imagem e suas legendas.

### criar-post-anuncio

Produz criativos estaticos para anuncios, respeitando objetivo de campanha e politica de anuncios.

### planejar-conteudo

Converte banco de ideias e objetivos em briefs e calendario editorial. Deve solicitar lacunas relevantes, sem inventar informacoes da marca.

## Sequencia recomendada de implementacao

### Fase 1: fundacao instalavel

- inicializar `package.json`;
- criar `.env.example` e arquivos de conteudo vazios, mas orientados;
- criar `automacoes/configurar.mjs` e `automacoes/diagnosticar.mjs`;
- criar README publico, tutorial de configuracao e guia de workshop;
- criar habilidades internas e o instalador delas;
- testar tudo em uma pasta nova, sem credenciais.

### Fase 2: criacao de conteudo e preview

- criar templates para post individual, carrossel e anuncio;
- criar exportacao das artes e galeria de previas;
- implementar as habilidades de copy e construcao;
- criar um exemplo ficticio removivel para demonstracao.

### Fase 3: publicacao Instagram

- adaptar um publicador Node sem dependencias desnecessarias;
- implementar `--dry-run` e validacao rigorosa de imagens e legenda;
- usar hospedagem de imagens configuravel, sem servico publico secreto embutido;
- registrar status e permalink;
- testar apenas com credenciais fornecidas conscientemente por quem executa.

### Fase 4: Telegram e aprovacao

- criar fila de jobs local;
- configurar robo, lista de autorizacao de `chat_id` e consulta continua;
- enviar previa e botoes;
- implementar aprovacao idempotente, cancelamento e auditoria;
- fazer o processo local publicar somente apos confirmacao.

### Fase 5: extensoes

- aprovacao por audio com transcricao;
- distribuicao por `npx`;
- hospedagem opcional de previas com links privados;
- calendario e agendamento.

## Requisitos de qualidade e seguranca

- Configuracoes e mensagens de erro em portugues simples.
- Todos os comandos devem ser repetiveis sem estragar configuracoes ja existentes.
- A primeira publicacao real nunca acontece automaticamente; exigir acao explicita de aprovacao.
- Cada publicacao deve ter identificador, status e arquivo de auditoria local.
- Nunca incluir token em URL, log, captura de tela, README, teste ou commit.
- Separar claramente: rascunho, pronto para aprovar, aprovado, publicado, cancelado e erro.
- Antes de concluir cada fase, testar o fluxo correspondente em modo seco ou com dados ficticios.

## Prompt para retomar em outra conta

Abra `E:\PROJETOS\social-media-studio` no Codex e envie:

```text
Leia integralmente AGENTS.md e PLANO-DO-PROJETO.md. Este e um repositorio generico de Social Media Studio, independente de projetos anteriores. Continue a partir do estado atual, preserve a instalacao autonoma e nao use ativos, dados ou referencias de clientes. Antes de editar, mostre um plano curto; depois implemente e valide localmente.
```

## Decisao pendente antes da distribuicao publica

Escolher o nome comercial final e o repositorio remoto. O nome de trabalho `Social Media Studio` foi adotado apenas para iniciar os arquivos e pode ser alterado sem mudar a arquitetura.
