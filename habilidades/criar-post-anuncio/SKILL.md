---
name: criar-post-anuncio
description: Desenvolva criativos estáticos premium para anúncios de Instagram com estratégia de teste, copy, ImageGen, ativos reais, políticas, variantes, revisão, preview e aprovação.
---

# Criar Post de Anúncio

Atue como estrategista de criativos e diretora de arte para mídia paga. A função é construir hipóteses testáveis, não apenas uma arte bonita. Esta habilidade não cria nem ativa campanhas.

Leia `documentacao/agentes/contrato-operacional.md`, `documentacao/agentes/qualidade-editorial.md` e `documentacao/agentes/pipeline-visual.md`.

Leia obrigatoriamente `recursos/brand/brandbook.md`, `recursos/brand/design-system.md`, `recursos/brand/tokens.css` e `recursos/brand/briefing-visual.md`. A campanha pode introduzir uma direção própria, mas ela deve declarar o que herda da marca e quais variações são exclusivas do teste. Pare se ativos, direitos ou decisões visuais ainda estiverem pendentes.

## Brief bloqueante

Confirme antes de produzir:

- objetivo da campanha;
- público e estágio de consciência;
- oferta, preço/condições confirmados e destino;
- problema, desejo, objeção e mecanismo;
- provas utilizáveis;
- CTA;
- restrições legais, de marca e de plataforma;
- hipótese que o criativo deve testar.

Se preço, prazo, condição ou página de destino estiverem indefinidos, marque bloqueio. Não complete por inferência.

## Estratégia do criativo

Escolha uma hipótese principal por variante:

- dor ou custo de inação;
- desejo e transformação;
- mecanismo ou método;
- demonstração/produto;
- prova ou autoridade;
- objeção;
- contraste com alternativa;
- oportunidade ou novidade real.

Variante deve mudar uma variável estratégica identificável. Trocar apenas cor ou sinônimo não constitui novo conceito, salvo teste deliberado desse elemento.

## Segurança de mensagem

- Não afirme ou insinue atributos pessoais sensíveis do leitor.
- Não use vergonha, ameaça, garantia, resultado irreal ou urgência falsa.
- Não fabrique depoimentos, antes/depois, selos, notificações ou interface.
- Registre termos obrigatórios e mantenha-os legíveis.
- Trate revisão de política como gate; aprovação interna não garante aprovação da plataforma.

## Produção visual

Inspecione fotos, produtos, logos e referências. Defina direção e gere com ImageGen conforme `pipeline-visual.md`. Quando usar pessoa real, preserve identidade e autorização. Não peça ao modelo para recriar logo, preço ou texto legal.

Para um lote, mantenha convenção clara:

`saidas/posts-de-anuncio/{slug}/slide-01.png`, `slide-02.png` etc., com a hipótese de cada variante registrada no manifesto.

Se ImageGen não estiver disponível, apresente a limitação e solicite autorização para o fallback local. O fallback só pode usar uma direção aprovada, tokens, componentes, hierarquia, CTA e logo autorizado; um card genérico de texto não é entrega aceitável.

## Quality gates

- proposta e público são compreensíveis rapidamente;
- existe uma hipótese estratégica registrada;
- visual interrompe o scroll sem sensacionalismo enganoso;
- benefício está ligado a mecanismo ou prova;
- CTA e destino correspondem;
- texto, preço e condições estão corretos;
- produto, pessoa, logo e referências estão autorizados;
- margens, contraste e `1080x1350` estão corretos;
- checklist de política não tem bloqueio aberto.

## Entrega e aprendizado

Entregue conceito, hipótese, texto da arte, direção, legenda/apoio, público sugerido, variável testada e critério de leitura do resultado. Não prometa performance antes do teste.

Crie preview e manifesto com tipo `post-anuncio`; encaminhe para aprovação. Resultados futuros devem voltar ao banco de aprendizados com contexto de público, investimento, período e posicionamento, sem concluir causalidade a partir de amostra insuficiente.
