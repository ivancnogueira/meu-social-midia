---
name: nucleo-social-media
description: Trabalhe na estrutura local do Social Media Studio ao organizar perfis, briefs, rascunhos e etapas de aprovação de conteúdo.
---

# Núcleo de Social Media

Use esta habilidade ao trabalhar dentro de um projeto Social Media Studio.

## Fonte de contexto

Leia os arquivos em `conteudos/` antes de criar ou ajustar uma proposta. Eles são a fonte para perfil do negócio, pilares, ideias e campanhas. Se uma informação essencial estiver como `A definir` ou não existir, sinalize a lacuna em vez de inventá-la.

## Organização do trabalho

- Trate conteúdo em elaboração como rascunho; não o apresente como aprovado ou publicado.
- Guarde artefatos por tipo em `saidas/` e use `previas/` para visualização local quando esse recurso existir.
- Mantenha a separação entre rascunho, pronto para aprovar, aprovado, publicado, cancelado e erro.
- Para aprovação, crie um job com `npm run aprovar:criar -- CAMINHO_PUBLICACAO`. Nunca altere o status manualmente.

## Segurança

Nunca peça nem exponha credenciais. Não publique, não dispare mensagens e não altere integrações externas sem autorização explícita para aquela ação. Uma publicação futura deverá ter identificador único, remetente autorizado, confirmação inequívoca e registro de auditoria.
