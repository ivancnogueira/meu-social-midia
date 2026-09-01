# Pipeline visual premium

Use este pipeline em carrosséis, posts individuais e criativos de anúncio. A imagem final é um PNG; HTML serve somente para preview e vitrine.

## Preflight obrigatório

1. Leia `recursos/brand/brandbook.md`, `recursos/brand/design-system.md`, `recursos/brand/tokens.css`, `recursos/brand/briefing-visual.md`, `conteudos/identidade-visual.yml` e o perfil da marca.
2. Liste `recursos/fotos/`, `recursos/logos/` e `recursos/referencias/` sem alterar nada e confirme cada decisão registrada no briefing visual.
3. Inspecione visualmente apenas os ativos candidatos.
4. Confirme objetivo, formato, copy aprovada, CTA, quantidade de peças e destino.
5. Se o design system, o briefing visual ou a direção da peça ainda contiverem decisões essenciais como `A definir` ou `pendente`, interrompa a produção e encaminhe ao `nucleo-social-media`.
6. Defina uma direção visual consistente (conceito, ponto focal, estrutura, componentes, texto, CTA e selo) antes de gerar a primeira imagem.

## Decisão de fonte visual

- **Pessoa real necessária:** use uma ou mais fotos autorizadas como referência. Pode criar nova composição, cenário ou tratamento, mas deve preservar a identidade.
- **Fotografia existente já resolve:** edite ou componha a foto original; não gere outra pessoa.
- **Pessoa não é necessária:** gere produto, objetos, ambiente, ilustração ou composição abstrata original.
- **Sem ferramenta de imagem disponível:** informe a limitação e use o gerador local somente como fallback explícito, depois de confirmar identidade validada, direção aprovada e papel de cada ativo. O fallback deve aplicar os tokens e a composição definida; quando uma foto autorizada for o foco, passe seu caminho relativo como `fotoDestaque` para compô-la diretamente. Nunca entregue uma fórmula visual genérica como arte pronta.

Não invente um rosto para representar o usuário. Se a semelhança falhar após tentativas direcionadas, use a foto original ou uma direção sem rosto.

## Geração pelo Codex

Quando ImageGen estiver disponível, gere a arte como bitmap, uma peça por vez ou em pequenos lotes. Todo prompt deve fixar:

- finalidade e público;
- formato vertical 4:5;
- identidade da marca e direção visual;
- papel de cada foto e referência;
- texto exato e curto entre aspas;
- hierarquia, enquadramento e margens seguras;
- elementos proibidos, inclusive texto extra e marcas d'água.

Para editar uma foto, declare o que pode mudar e o que deve permanecer. Para uma sequência, repita os elementos invariantes em todos os prompts.

## Elementos de precisão

Não peça ao gerador para recriar logo, QR code, preço, data, endereço ou texto legal. Gere a composição com área reservada e aplique o arquivo ou texto exato de forma determinística quando necessário.

## Revisão visual bloqueante

Inspecione cada arte e confirme:

- identidade e anatomia coerentes;
- texto completo, correto e sem caracteres extras;
- contraste e legibilidade em tela pequena;
- margens seguras e ausência de cortes;
- logo correto e não deformado;
- consistência de paleta, tipografia, luz e tratamento;
- ausência de marcas, pessoas ou objetos não solicitados;
- dimensão final exata de `1080x1350`.

Se uma peça falhar, regenere ou corrija somente aquela peça. Preserve versões não aprovadas com sufixo `-v2`, `-v3` até a substituição ser autorizada.

## Saída

- Carrossel: `saidas/carrosseis/{slug}/slide-01.png` até `slide-NN.png`.
- Post individual: `saidas/posts-individuais/{slug}/slide-01.png`.
- Anúncio: `saidas/posts-de-anuncio/{slug}/slide-01.png` e variantes quando solicitadas.
- Manifesto: `publicacao.json` no mesmo diretório.
- Preview: `previas/{slug}.html` usando caminhos relativos para os PNGs.

Depois, execute `npm run atualizar-vitrine`, faça revisão e somente então crie o job com `npm run aprovar:criar -- CAMINHO_PUBLICACAO`.

No modo local, depois da autorização explícita para tornar a entrega pública, execute `npm run pages:publicar -- CAMINHO_PUBLICACAO`. Isso envia somente PNGs finais, preview e vitrine ao repositório público configurado e grava as URLs HTTPS no manifesto. Valide o preview público antes de criar o job, pois a inclusão das URLs altera o fingerprint da versão.
