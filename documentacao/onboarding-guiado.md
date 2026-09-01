# Onboarding guiado

Este roteiro é obrigatório durante a primeira configuração pelo Codex. A instalação técnica e o onboarding estratégico são partes do mesmo percurso, mas têm conclusões diferentes.

## Experiência que o usuário deve receber

Antes da primeira pergunta, mostre o percurso completo:

1. ambiente e modo de execução;
2. negócio, público, oferta e posicionamento;
3. voz, objetivos, capacidade e restrições;
4. identidade visual e ativos da marca;
5. pilares editoriais e primeira pauta;
6. primeiro briefing, copy, arte, preview e aprovação do primeiro post;
7. Meta, aprovação auditável no chat e primeira publicação.

Use o cabeçalho `Onboarding — etapa N de 7: NOME` em cada interação. Diga em uma frase o que será decidido naquela etapa e o que acontecerá depois da resposta.

Faça perguntas em blocos curtos. Não repita o que já estiver nos arquivos ou tiver sido respondido. Quando houver informação suficiente para propor uma direção profissional, apresente a proposta e peça correção ou confirmação, em vez de transferir toda a elaboração ao usuário.

Não termine uma interação com “quer ir para o próximo passo?”, “podemos continuar?” ou outra pergunta sem destino explícito. A autorização para a instalação assistida já permite avançar entre as etapas seguras. Quando uma resposta for indispensável, encerre assim:

> Depois da sua resposta, vou salvar esta etapa e avançar para **NOME DA PRÓXIMA ETAPA**, onde faremos **RESULTADO CONCRETO**.

## Execução pelo Codex

O `nucleo-social-media` mantém o contexto e coordena as especialistas. O fluxo não é encerrado entre uma especialista e outra:

- perfil e diagnóstico: `nucleo-social-media`;
- pilares, pauta e primeiro brief: `planejar-conteudo`;
- primeira proposta textual: `copywriter-instagram`, depois de os pilares e o briefing estarem coerentes;
- primeira arte e preview: habilidade visual correspondente ao formato recomendado;
- integração e primeira publicação: `configurar-instagram`, depois de o job exato ser aprovado no chat com a confirmação única solicitada.

O Codex deve atualizar `conteudos/estado-do-studio.yml` depois de cada marco. Todo turno de onboarding precisa informar:

- etapa atual e progresso;
- o que já foi registrado;
- o que está sendo perguntado agora;
- a próxima etapa concreta.

Ativos ausentes não devem interromper a definição estratégica. Registre a ausência, mostre exatamente onde fotos, logos e referências devem ser colocados e use uma direção sem esses ativos até que sejam fornecidos. Não invente nem procure imagens pessoais ou logos.

## Critério de conclusão

Não diga apenas “configuração concluída”. Use uma destas situações:

### Instalação técnica concluída

Node, Git, dependências, modo, `.env`, diretórios e habilidades foram verificados, mas ainda existe etapa estratégica pendente. Informe a pendência e continue o onboarding no mesmo processo.

### Onboarding pausado

O usuário pediu para parar ou falta uma resposta/ativo realmente indispensável. Informe a etapa, a pergunta pendente e como retomar. Não trate uma pausa como conclusão.

### Studio instalado e completamente configurado

Somente quando:

- perfil e identidade visual foram preenchidos;
- três a cinco pilares foram apresentados e confirmados;
- existe uma primeira pauta e um briefing com objetivo, público, mensagem, formato, CTA e fontes;
- a copy e a arte do primeiro post passaram pelos quality gates das habilidades responsáveis;
- o PNG final e o manifesto foram salvos em `saidas/` e o preview foi gerado em `previas/`;
- o usuário confirmou que a estratégia representa o negócio e aprovou visualmente a primeira peça;
- Meta foi configurada localmente sem expor credenciais;
- a imagem possui URL HTTPS acessível pela Meta;
- um job único foi aprovado no chat pela confirmação exata `APROVAR ID-DO-JOB`;
- a publicação real retornou `mediaId` e, quando fornecido pela Meta, permalink, ambos registrados na auditoria;
- testes e diagnóstico foram executados.

Na etapa 6, recomende o formato mais adequado ao primeiro briefing e explique a escolha. Se o usuário não pedir outro formato, prossiga com a recomendação já autorizada pelo pedido de instalação completa. Use ImageGen e ativos autorizados conforme a habilidade visual; se ImageGen não estiver disponível, informe a limitação e peça autorização antes do fallback local. Mostre o preview, aplique ajustes e obtenha aprovação explícita da versão. A aprovação visual não autoriza publicação.

O primeiro conteúdo do onboarding é sempre um **post individual 1080×1350**. Esse formato reduz dependências e permite validar todo o sistema antes de produzir carrosséis ou anúncios.

Depois da aprovação visual, conduza a configuração local das credenciais e gere o job. Mostre o ID, resuma a versão imutável e peça ao usuário que responda exatamente `APROVAR ID-DO-JOB`. Ao receber essa confirmação no chat, registre a aprovação local auditável e publique pela API oficial. Aprovação de preview, “pode seguir” genérico ou autorização dada antes de o job existir não autoriza publicação.

No modo servidor, as URLs assinadas de mídia usam o domínio HTTPS configurado. No modo local, `127.0.0.1` não é acessível pela Meta: use por padrão o repositório público de previews do próprio usuário conforme `documentacao/configurar-github-pages.md`. Antes do upload, explique que PNG, preview e vitrine serão públicos e obtenha autorização explícita. Se o usuário não autorizar GitHub Pages, configure outra hospedagem HTTPS autorizada ou pause a etapa 7.

Ao chegar ao estado pronto, mostre um resumo do que foi configurado, o caminho do primeiro post, o preview e o permalink retornado. A próxima ação passa a ser criar o próximo conteúdo.

Meta e uma URL pública HTTPS são obrigatórios para concluir a primeira publicação. Telegram, domínio e VPS são opcionais. Enquanto faltar uma condição obrigatória, o Studio pode criar e revisar localmente, mas o onboarding permanece `em_andamento`.

## Estado persistente

Use este formato em `conteudos/estado-do-studio.yml` e preserve campos já preenchidos:

```yaml
versao: 2
onboarding:
  status: nao_iniciado
  etapa_atual: ambiente
  perfil: pendente
  identidade_visual: pendente
  pilares: pendente
  primeiro_briefing: pendente
  primeiro_post: pendente
  validacao_usuario: pendente
  integracao_instagram: pendente
  integracao_telegram: opcional
  primeira_publicacao: pendente
producao:
  ultimo_briefing:
  proximo_passo: escolher_modo
```

Valores de etapa: `pendente`, `preenchido`, `validado`, `aprovado`, `configurado` ou `publicado`. Estado geral: `nao_iniciado`, `em_andamento`, `pronto` ou `revisao`.
