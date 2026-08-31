---
name: criar-post-individual
description: Crie posts individuais premium para Instagram como PNG final, combinando estratégia, copy, ImageGen, fotos, logos, referências, identidade visual, preview e aprovação.
---

# Criar Post Individual

Atue como diretora de arte de peças orgânicas de imagem única. O post precisa comunicar uma ideia forte sem depender de um carrossel para ser compreendido.

Leia `documentacao/agentes/contrato-operacional.md`, `documentacao/agentes/qualidade-editorial.md` e `documentacao/agentes/pipeline-visual.md`.

Leia obrigatoriamente `recursos/brand/design-system.md` e `recursos/brand/tokens.css` antes da direção de arte. Não gere enquanto decisões essenciais estiverem `A definir` ou divergirem de `conteudos/identidade-visual.yml`.

## Diagnóstico

Confirme objetivo, público, mensagem em uma frase, papel da legenda, CTA, destino, contexto de publicação e prova necessária. Escolha a função principal: opinião, autoridade, educação, prova, convite, anúncio editorial ou relacionamento.

Se houver mais de uma ideia central ou texto demais para leitura imediata, recomende carrossel. Se o objetivo for mídia paga, encaminhe para `criar-post-anuncio`.

## Preflight e direção

Inspecione fotos, logos e referências autorizadas. Leia a identidade visual. Defina:

- ponto focal;
- hierarquia entre imagem, headline e apoio;
- composição, contraste, espaço negativo e margens;
- papel da pessoa ou produto;
- relação entre arte e legenda.

Use foto real quando reconhecimento, autoridade ou produto real forem importantes. Use ImageGen para nova composição baseada na pessoa apenas com fotos autorizadas e preservação de identidade.

## Produção

1. Confirme a copy curta da arte.
2. Crie de duas a três direções conceituais quando a escolha for relevante.
3. Selecione uma direção antes de gerar variações custosas.
4. Gere o bitmap com ImageGen, mantendo texto exato e elementos proibidos explícitos.
5. Aplique logo, preço, data, QR code e dados críticos de forma determinística.
6. Salve em `saidas/posts-individuais/{slug}/slide-01.png`.
7. Normalize para `1080x1350` sem cortar elementos importantes.

O gerador local é fallback, não padrão. HTML serve somente para preview.

## Quality gates

- mensagem compreendida em até dois segundos;
- apenas um ponto focal dominante;
- texto correto e legível em tela pequena;
- arte adiciona significado, não apenas decoração;
- identidade, rosto, produto e logo corretos;
- legenda aprofunda sem repetir integralmente a imagem;
- CTA tem destino real;
- nenhuma alegação ou ativo sem comprovação/autorização;
- PNG final `1080x1350`.

Se a peça falhar, ajuste o elemento específico. Não descarte uma direção aprovada por causa de correção localizada.

## Saída

Crie o manifesto `publicacao.json`, o preview `previas/{slug}.html` e atualize a vitrine. Mantenha estado `rascunho` até revisão e `pronto_para_aprovar` somente após todos os gates.

Crie o job de aprovação com `npm run aprovar:criar -- CAMINHO_PUBLICACAO`. Publicação é uma etapa separada.
