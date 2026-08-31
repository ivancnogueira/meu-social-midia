# Configurar Meta e Instagram

Esta etapa é manual. O instalador não cria aplicativo, conta ou token em seu nome.

## Antes de começar

- Use uma conta profissional do Instagram vinculada à Página correta.
- Tenha acesso administrativo à conta e à Página.
- Abra o painel oficial de desenvolvedores da Meta no navegador e crie ou escolha o aplicativo que será usado para esta integração.
- Guarde segredos exclusivamente no arquivo local `.env`; não os cole no chat, em comandos, capturas de tela ou repositórios.

## Checklist de configuração

1. Confirme que o Instagram profissional está conectado à Página desejada.
2. No aplicativo da Meta, habilite os produtos e permissões exigidos pela publicação de conteúdo do Instagram.
3. Gere o token conforme o fluxo oficial aplicável à sua conta e registre-o somente em `INSTAGRAM_ACCESS_TOKEN` no `.env`.
4. Preencha também `META_API_VERSION`, `INSTAGRAM_BUSINESS_ID` e `FACEBOOK_PAGE_ID`.
5. Execute `npm run diagnosticar`. O comando informa somente se os campos estão preenchidos; ele nunca mostra seus valores.
6. No modo local, configure uma hospedagem HTTPS própria para as imagens que a Graph API precisa buscar. No modo servidor, o domínio configurado gera automaticamente URLs assinadas para as imagens.

## Teste seguro

Use primeiro `npm run publicar-instagram -- caminho/publicacao.json`. A publicação real exige um job aprovado, URLs HTTPS válidas e as credenciais locais.
