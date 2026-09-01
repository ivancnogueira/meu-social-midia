# Instalação assistida pelo Codex

Em uma tarefa local vazia, envie este prompt:

```text
Instale o Social Media Studio a partir de https://github.com/ivancnogueira/meu-social-midia.git em uma nova pasta meu-social-midia no diretório de trabalho atual. Depois do clone, leia integralmente AGENTS.md, README.md, INSTALAR-COM-CODEX.md, documentacao/onboarding-guiado.md e documentacao/configurar-github-pages.md. Você está autorizado a instalar dependências npm e as habilidades internas deste repositório no diretório local de skills do Codex. Conduza a instalação e o onboarding como um único processo, sem encerrar entre etapas. Antes da primeira pergunta, mostre estes seis marcos: 1) Instalação, 2) Perfil, 3) Identidade visual, 4) Configurações, 5) Primeiro post e preview, 6) Postagem. Em cada interação, mostre marco, progresso, decisão atual e resultado seguinte; nunca termine apenas perguntando se quero continuar.

Verifique Node.js e Git, recomende local ou servidor/VPS e peça minha escolha. No servidor, pergunte domínio e gere os arquivos, mas peça autorização separada antes de instalar software do sistema, serviços ou alterar firewall. Preserve configurações existentes e nunca peça tokens no chat.

No marco Perfil, use nucleo-social-media para registrar negócio, público, oferta, posicionamento, voz, objetivos e restrições. No marco Identidade visual, pergunte se já tenho identidade ou quero criar uma. Faça inventário de fotos, logo, referências e direitos de uso, exigindo ativo ou decisão explícita de não uso. Se eu quiser criar, acione criar-identidade-visual para produzir uma proposta de wordmark SVG editável opcional, brandbook, design system, tokens e YAML; não avance sem minha aprovação explícita da direção. “Pode sugerir” permite propor estratégia, nunca presumir ativos.

No marco Configurações, antes de criar conteúdo, oriente a criação do app Meta, do repositório público separado de GitHub Pages no modo local ou do domínio HTTPS no servidor, e o preenchimento exclusivo no .env local de cada credencial. Explique que PNG, preview e vitrine do Pages serão públicos, peça autorização antes do primeiro upload e valide npm run diagnosticar. Telegram é opcional.

No marco Primeiro post, use planejar-conteudo, copywriter-instagram e criar-post-individual para produzir um post único 1080x1350, manifesto e preview. Use ImageGen e ativos autorizados. Sem ImageGen, explique a limitação e peça autorização para fallback local que aplique a identidade aprovada; recuse peça genérica. Mostre o preview e aplique os ajustes. Depois da aprovação visual e da autorização específica para upload, publique a entrega no Pages ou domínio e valide as URLs HTTPS.

No marco Postagem, faça dry-run, crie um job único e peça no chat a confirmação exata APROVAR ID-DO-JOB. Só após essa resposta registre a aprovação local e publique esse primeiro post pela API oficial. Atualize conteudos/estado-do-studio.yml após cada marco, execute npm test e npm run diagnosticar e só declare o Studio instalado com mediaId/permalink registrados. Depois disso, encerre o onboarding e informe que novas demandas devem chamar diretamente as habilidades de planejamento, criação, revisão ou postagem.
```

Se o repositório já estiver clonado, abra a pasta no Codex e envie o mesmo prompt sem a frase “a partir de … em uma nova pasta”.

## Comportamento obrigatório

1. Instalar somente dependências e habilidades autorizadas no prompt.
2. Preservar `.env`, conteúdos e ativos existentes.
3. Nunca receber, exibir ou registrar tokens no chat, em comandos ou em commits.
4. Tratar a publicação como operação separada: preview aprovado não publica; somente o job identificado e aprovado por `APROVAR ID-DO-JOB` publica.
5. Encerrar o onboarding apenas após a primeira publicação real. Depois disso, rotear novos pedidos para a habilidade especialista, sem repetir a instalação.

## Instalação manual continua disponível

Quem preferir o terminal pode copiar um único comando:

```text
npx --yes github:ivancnogueira/meu-social-midia instalar meu-social-media
```

O instalador cria uma distribuição limpa e chama os mesmos scripts usados pelo Codex.
