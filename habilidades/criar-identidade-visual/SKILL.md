---
name: criar-identidade-visual
description: Crie ou traduza uma identidade visual de marca em wordmark, brandbook, design system e tokens aprovados antes de produzir conteúdo.
---

# Criar Identidade Visual

Atue como diretora de marca. Esta habilidade serve para pessoas que ainda não têm identidade visual pronta ou que precisam transformar materiais dispersos em um sistema utilizável pelo Social Media Studio. Não substitui registro de marca, pesquisa jurídica ou um projeto de branding completo de longo prazo.

Leia `documentacao/agentes/contrato-operacional.md`, `conteudos/perfil-da-marca.md`, `recursos/brand/briefing-visual.md`, `recursos/brand/design-system.md`, `recursos/brand/tokens.css` e `conteudos/identidade-visual.yml`. Se houver identidade existente, inspecione somente os arquivos e referências que o usuário autorizou.

## Escolha de rota

Comece perguntando e registrando uma escolha inequívoca:

- **Já tenho identidade:** traduzir logo, paleta, fontes, referências e regras existentes sem reinventar a marca.
- **Quero criar:** partir do posicionamento, público, oferta e referências autorizadas para propor uma identidade original de conteúdo.
- **Ainda não quero logo:** criar o sistema visual e um wordmark tipográfico provisório, explicitamente marcado como provisório.

Não trate a ausência de um logo como permissão para criar um símbolo aleatório. Nunca copie, imite ou alegue disponibilidade de marcas de terceiros.

## Diagnóstico e proposta

Colete em blocos curtos:

- nome a exibir, pronúncia e assinatura;
- público, posicionamento, promessa e sensação desejada;
- referências e o que exatamente deve ser aproveitado nelas;
- cores, fontes ou elementos já obrigatórios;
- aversões visuais, concorrentes a evitar e necessidades de acessibilidade;
- fotos, produtos e demais ativos autorizados; e
- intenção para o logo: somente wordmark, monograma, símbolo ou combinação.

Apresente duas ou três direções realmente distintas. Para cada uma, explique metáfora, paleta, tipografia, composição, comportamento no feed e risco de banalidade. Espere a escolha explícita de uma direção antes de criar arquivos finais.

## Logo e wordmark

Priorize um wordmark SVG editável quando não existir logo. Ele deve ter leitura em avatar, cabeçalho e rodapé de post, respeitar contraste e usar somente nome, iniciais e elementos aprovados. Salve em `recursos/logos/` com nome descritivo, por exemplo `wordmark-principal.svg`.

Não use ImageGen para texto final, logotipo, símbolo de precisão ou marca d'água: esses elementos devem ser construídos de modo determinístico e revisável. ImageGen pode ser usado apenas para explorar atmosferas abstratas, nunca como logo final. Antes de aplicar o arquivo na arte, mostre-o sobre fundo claro e escuro e obtenha aprovação explícita.

## Entregas obrigatórias

Depois da aprovação da direção, mantenha estas fontes sincronizadas:

1. `recursos/brand/brandbook.md`: fundamento, regras, ativos, usos e anti-padrões em linguagem humana.
2. `recursos/brand/design-system.md`: decisões executáveis de direção de arte.
3. `recursos/brand/tokens.css`: cores, fontes, espaçamentos e componentes exatos.
4. `conteudos/identidade-visual.yml`: tema estruturado e a seção `recursos` com fotos, logo, referências e direitos de uso.
5. `recursos/brand/briefing-visual.md`: direção já aprovada da primeira peça.

Não marque a identidade como validada enquanto algum desses arquivos tiver `A definir` ou `pendente`. Atualize `conteudos/estado-do-studio.yml` somente após confirmação do usuário.

## Handoff

Entregue um resumo da direção aprovada, os caminhos de todos os ativos e qualquer limitação. Em seguida, devolva ao `nucleo-social-media`, que pode chamar `planejar-conteudo` e, depois, a habilidade visual adequada. A identidade aprovada não é aprovação automática da primeira arte.
