---
name: criar-carrossel
description: Crie carrosséis premium de Instagram como imagens finais, usando estratégia, copy, ImageGen, fotos reais, logos, referências, design system, revisão visual, preview e aprovação.
---

# Criar Carrossel

Atue como diretora de arte e produtora de carrosséis. A entrega principal são PNGs finais `1080x1350`; HTML existe apenas para preview e vitrine.

Leia `documentacao/agentes/contrato-operacional.md`, `documentacao/agentes/qualidade-editorial.md` e `documentacao/agentes/pipeline-visual.md` antes de produzir.

Leia obrigatoriamente `recursos/brand/design-system.md` e `recursos/brand/tokens.css` antes de escrever prompts ou gerar o primeiro slide. Se estiverem genéricos, incompletos ou conflitarem com o YAML, interrompa a geração e encaminhe ao `nucleo-social-media`.

## Entrada obrigatória

- brief com objetivo, público, mensagem central e CTA;
- copy aprovada ou autorização explícita para desenvolvê-la;
- perfil e identidade visual utilizáveis;
- fontes ou provas para afirmações factuais;
- decisão sobre quantidade de slides.

Se a identidade ou copy ainda estiver estruturalmente indefinida, encaminhe primeiro ao especialista correto.

## Preflight visual

Inspecione `recursos/fotos/`, `recursos/logos/` e `recursos/referencias/`. Leia instruções existentes nessas pastas. Para cada ativo candidato, confirme função e autorização.

O design system prevalece sobre referências. Extraia delas ritmo, hierarquia, densidade, enquadramento e clima; não copie composição, texto ou identidade de terceiros.

## Arquitetura narrativa

Escolha a sequência que melhor entrega a ideia:

- diagnóstico: gancho -> sintoma -> causa -> solução -> aplicação -> CTA;
- tutorial: promessa -> contexto -> passos -> resultado -> CTA;
- lista: promessa -> itens progressivos -> síntese -> CTA;
- comparação: tensão -> alternativa A -> alternativa B -> critérios -> conclusão;
- história: cena -> conflito -> virada -> aprendizado -> aplicação -> CTA.

Não force sete slides. Use de 2 a 10 conforme a narrativa. A capa para o scroll; o miolo entrega; o final conclui e direciona.

## Direção visual

Antes de gerar, defina em poucas linhas:

- conceito visual e metáfora;
- paleta, contraste e textura;
- tratamento fotográfico;
- regra tipográfica e hierarquia;
- componentes recorrentes;
- alternância e continuidade entre slides;
- uso de pessoa, produto, prova e logo.

Quando a pessoa for importante, use fotos autorizadas como referência para criar novas composições. Preserve identidade. Se a semelhança não passar na revisão, regenere, use a foto original ou retire o rosto.

## Produção com ImageGen

1. Escreva todos os prompts antes de gerar para garantir consistência.
2. Gere um slide piloto, normalmente capa ou slide representativo.
3. Valide a direção; depois gere os demais um por vez ou em pequenos lotes.
4. Repita invariantes de marca e sequência em todos os prompts.
5. Exija texto curto e exato, sem palavras extras.
6. Reserve área para logo e dados de precisão; aplique-os posteriormente quando necessário.
7. Salve cada resultado aceito em `saidas/carrosseis/{slug}/slide-XX.png`.

Não troque silenciosamente para HTML, SVG ou canvas. Se ImageGen não estiver disponível, explique e ofereça o gerador local como fallback explícito.

## Quality gates por slide

- texto correto e legível no celular;
- uma função narrativa clara;
- rosto, mãos, objetos e produto coerentes;
- margens seguras e nenhum corte crítico;
- identidade visual consistente sem monotonia;
- ausência de texto, logo ou marca d'água inventados;
- promessa da capa entregue pelo conjunto;
- CTA final coerente com o brief;
- arquivo final exatamente `1080x1350`.

Corrija apenas slides reprovados. Preserve versões até o usuário aprovar a substituição.

## Preview, aprovação e saída

Monte `publicacao.json`, gere `previas/{slug}.html` com os PNGs e execute `npm run atualizar-vitrine`. Mostre o preview e pergunte quais slides precisam de ajuste. Não publique nem crie aprovação definitiva antes da revisão visual.

Com a versão pronta, execute `npm run aprovar:criar -- CAMINHO_PUBLICACAO`. A aprovação deve identificar exatamente a versão; qualquer alteração posterior exige novo job.
