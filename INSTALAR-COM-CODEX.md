# Instalação assistida pelo Codex

É possível começar em uma tarefa local vazia do Codex. Envie este único prompt:

```text
Instale o Social Media Studio a partir de https://github.com/ivancnogueira/meu-social-midia.git em uma nova pasta meu-social-midia dentro do diretório de trabalho atual. Depois do clone, leia integralmente AGENTS.md, README.md e INSTALAR-COM-CODEX.md e faça a instalação assistida completa. Você está autorizado a instalar as dependências npm e a instalar ou atualizar as habilidades internas deste repositório no diretório local de skills do Codex. Verifique Node.js e Git, preserve qualquer configuração existente, faça as perguntas necessárias sobre meu negócio, preencha os arquivos de conteúdo com as minhas respostas e execute o diagnóstico e os testes finais. Não peça tokens ou credenciais no chat e não publique nada. Ao terminar, informe o que foi configurado e o que ainda depende de configuração manual da Meta ou do Telegram.
```

Se o repositório já estiver clonado, abra a pasta como projeto local no Codex e use a versão curta:

```text
Leia integralmente AGENTS.md, README.md e INSTALAR-COM-CODEX.md. Faça a instalação assistida completa deste Social Media Studio. Você está autorizado a instalar ou atualizar as habilidades internas deste repositório no diretório local de skills do Codex. Verifique Node.js e Git, instale as dependências, preserve qualquer configuração existente, faça as perguntas necessárias sobre meu negócio, preencha os arquivos de conteúdo com as minhas respostas e execute o diagnóstico e os testes finais. Não peça tokens ou credenciais no chat e não publique nada. Ao terminar, informe o que foi configurado e o que ainda depende de configuração manual da Meta ou do Telegram.
```

## O que o Codex deve fazer

1. Ler as instruções e conferir se está na raiz correta do projeto.
2. Verificar Node.js 20+ e Git.
3. Perguntar nicho, público, oferta, tom, CTA e identidade visual quando essas informações ainda estiverem vazias.
4. Executar `npm run configurar` ou o modo não interativo equivalente.
5. Instalar as sete habilidades internas somente porque o prompt acima concede autorização explícita.
6. Atualizar os arquivos em `conteudos/` sem sobrescrever respostas existentes sem confirmação.
7. Executar `npm test` e `npm run diagnosticar`.
8. Opcionalmente gerar a demonstração removível e abrir a vitrine local.

Node.js 20+ e Git precisam estar disponíveis no computador. Se algum deles estiver ausente, o Codex deve interromper a configuração e explicar o pré-requisito; instalação de software do sistema exige autorização separada.

## Credenciais

Credenciais de Meta e Telegram devem ser preenchidas somente no `.env` local. O Codex pode explicar os campos e validar se estão presentes, mas não deve solicitar que o usuário cole tokens no chat.

## Instalação manual continua disponível

Quem preferir o terminal pode executar `npm run configurar`. Os dois caminhos usam os mesmos scripts e produzem a mesma estrutura.
