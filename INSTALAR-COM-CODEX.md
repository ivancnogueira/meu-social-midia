# Instalação assistida pelo Codex

É possível começar em uma tarefa local vazia do Codex. Envie este único prompt:

```text
Instale o Social Media Studio a partir de https://github.com/ivancnogueira/meu-social-midia.git em uma nova pasta meu-social-midia dentro do diretório de trabalho atual. Depois do clone, leia integralmente AGENTS.md, README.md, INSTALAR-COM-CODEX.md, documentacao/onboarding-guiado.md e documentacao/configurar-github-pages.md e faça a instalação assistida completa. Você está autorizado a instalar as dependências npm e a instalar ou atualizar as habilidades internas deste repositório no diretório local de skills do Codex. Trate toda a instalação e o onboarding como um único processo: antes da primeira pergunta, mostre as sete etapas; em cada resposta, informe etapa e progresso; avance automaticamente entre as etapas seguras já autorizadas; nunca termine perguntando apenas se quero ir ao próximo passo. Verifique Node.js e Git, detecte o ambiente apenas para recomendar e pergunte se desejo o modo local ou servidor/VPS. No modo servidor, pergunte o domínio e gere os arquivos de implantação, mas peça autorização separada antes de instalar software do sistema, serviços ou alterar firewall. Preserve qualquer configuração existente. Use nucleo-social-media para conduzir o perfil e a identidade, planejar-conteudo para pilares e briefing, copywriter-instagram e criar-post-individual para produzir o primeiro post 1080x1350, manifesto e preview. Mostre o preview e aplique os ajustes. No modo local, ajude-me a criar um repositório público separado no GitHub Pages e um token fine-grained limitado somente a ele com Contents: write; avise que PNG, preview e vitrine ficarão públicos, peça autorização antes do upload e oriente-me a preencher o token apenas no .env. Envie os artefatos com npm run pages:publicar, valide as URLs HTTPS e então configure a Meta, faça dry-run e crie um job único. Mostre o ID e peça que eu responda exatamente APROVAR ID-DO-JOB; somente depois dessa mensagem registre a aprovação local auditável e publique esse post pela API oficial. Telegram é opcional. Atualize conteudos/estado-do-studio.yml após cada marco. Nunca peça tokens no chat. Só declare o Studio instalado depois de registrar mediaId/permalink, diagnóstico e testes; se precisar de uma resposta ou configuração, diga exatamente o que acontecerá depois dela.
```

Se o repositório já estiver clonado, abra a pasta como projeto local no Codex e use a versão curta:

```text
Leia integralmente AGENTS.md, README.md, INSTALAR-COM-CODEX.md, documentacao/onboarding-guiado.md e documentacao/configurar-github-pages.md. Faça a instalação assistida completa deste Social Media Studio como um único processo. Você está autorizado a instalar ou atualizar as habilidades internas deste repositório no diretório local de skills do Codex. Mostre as sete etapas antes da primeira pergunta, informe o progresso em cada interação e avance automaticamente entre etapas seguras; nunca pergunte apenas se quero ir ao próximo passo. Verifique Node.js e Git, pergunte se desejo o modo local ou servidor/VPS e, no modo servidor, pergunte o domínio. Preserve configurações existentes. Use nucleo-social-media para o perfil e a identidade, planejar-conteudo para pilares e briefing, copywriter-instagram e criar-post-individual para criar o primeiro post 1080x1350, manifesto e preview. Mostre o preview e aplique ajustes. No modo local, conduza a criação de um repositório público separado no GitHub Pages e de um token fine-grained limitado a ele com Contents: write; avise que os artefatos ficarão públicos, peça autorização antes do upload e nunca receba o token no chat. Execute pages:publicar, valide as URLs HTTPS, configure a Meta, faça dry-run e crie o job. Mostre o ID e peça minha resposta exata APROVAR ID-DO-JOB; somente depois registre a aprovação local auditável e publique esse post. Telegram é opcional. Atualize o estado após cada marco e execute diagnóstico e testes. Só declare o Studio instalado quando mediaId/permalink estiverem registrados; se houver pendência, informe a etapa, a pergunta e o resultado seguinte.
```

## O que o Codex deve fazer

1. Ler as instruções, `documentacao/onboarding-guiado.md` e conferir se está na raiz correta do projeto.
2. Verificar Node.js 20+ e Git.
3. Mostrar as sete etapas e perguntar se a operação será local ou em servidor; a detecção é somente uma recomendação.
4. Conduzir perfil, voz e identidade em blocos curtos, sempre identificando etapa, progresso e próximo resultado.
5. Executar `npm run configurar` ou, no modo não interativo, chamar diretamente `node automacoes/configurar.mjs --sem-interacao --modo MODO` com o domínio quando necessário.
6. Instalar as sete habilidades internas somente porque o prompt acima concede autorização explícita.
7. Acionar `planejar-conteudo`, propor três a cinco pilares, gerar a primeira pauta e montar um briefing executável.
8. Acionar `copywriter-instagram` e `criar-post-individual`, gerar PNG final 1080×1350, manifesto e preview, mostrar o resultado e aplicar ajustes até a aprovação visual.
9. Atualizar os arquivos em `conteudos/` sem sobrescrever respostas existentes sem confirmação e registrar cada marco em `estado-do-studio.yml`.
10. No modo local, configurar o repositório público de Pages, obter autorização antes do upload, executar `pages:publicar` e validar as URLs HTTPS; no servidor, validar as URLs do domínio.
11. Conduzir Meta, fazer dry-run, criar o job e pedir no chat a confirmação exata `APROVAR ID-DO-JOB`.
12. Registrar a aprovação local auditável e publicar somente esse primeiro post pela API oficial. Telegram é opcional.
13. Executar `npm test` e `npm run diagnosticar`.
14. No modo servidor, gerar os artefatos de VPS e explicar a etapa de DNS/HTTPS sem aplicá-la silenciosamente.
15. Encerrar somente com o caminho do post e o resultado registrado da primeira publicação.

Node.js 20+ e Git precisam estar disponíveis no computador. Se algum deles estiver ausente, o Codex deve interromper a configuração e explicar o pré-requisito; instalação de software do sistema exige autorização separada.

## Credenciais

Credenciais de Meta, GitHub Pages e do Telegram opcional devem ser preenchidas somente no `.env` local. O Codex pode explicar os campos e validar se estão presentes, mas não deve solicitar que o usuário cole tokens no chat.

## Instalação manual continua disponível

Quem preferir o terminal pode copiar um único comando, sem clonar ou trocar de pasta manualmente:

```text
npx --yes github:ivancnogueira/meu-social-midia instalar meu-social-media
```

O instalador cria uma distribuição limpa e chama os mesmos scripts usados pelo Codex.
