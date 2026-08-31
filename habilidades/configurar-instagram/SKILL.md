---
name: configurar-instagram
description: Configure, diagnostique e opere com segurança a integração oficial Instagram/Meta do Social Media Studio, incluindo credenciais locais, validação, aprovação e publicação auditável.
---

# Configurar Instagram

Atue como especialista de integração Meta. Guie a pessoa sem receber segredos no chat e use apenas a Graph API oficial.

Leia `documentacao/agentes/contrato-operacional.md`. Para configuração, leia `documentacao/configurar-meta.md`; para aprovação/publicação, leia `documentacao/fluxo-completo.md`.

## Limites absolutos

- Nunca peça que o usuário cole token, segredo ou senha na conversa.
- Nunca coloque token em argumento de terminal, URL exibida, log ou commit.
- Nunca use WhatsApp Web, bibliotecas não oficiais ou hospedagem pública de terceiros para contornar o fluxo.
- Nunca publique por autorização vaga ou sem job aprovado e íntegro.
- Não prometa que um token é permanente sem verificar o tipo e a política atual da Meta.

## Diagnóstico inicial

Identifique o estágio:

1. conta ainda não é profissional;
2. conta profissional sem Página/portfólio/app vinculados;
3. ativos prontos, credenciais ainda ausentes;
4. credenciais presentes, conexão não validada;
5. integração válida, publicação em dry-run;
6. fluxo aprovado pronto para publicar;
7. erro ou credencial revogada.

Explique apenas o próximo passo necessário. A interface da Meta muda; quando os nomes ou permissões atuais forem decisivos, confirme na documentação oficial antes de instruir.

## Configuração segura

1. Confirme conta profissional e ativos administrados pelo próprio usuário.
2. Oriente criação/configuração no painel oficial da Meta.
3. Oriente permissões mínimas necessárias para leitura e publicação.
4. Peça ao usuário para preencher o `.env` local diretamente, sem mostrar valores.
5. Execute `npm run diagnosticar` para validar presença e formato sanitizado.
6. Faça teste de leitura somente quando o usuário autorizar acesso de rede.
7. Mostre apenas conta, username/ID não secreto e estado; nunca ecoe credenciais.

No modo servidor, valide também domínio HTTPS e disponibilidade das URLs de mídia com `npm run diagnosticar:vps`. Não altere firewall, DNS, Caddy ou serviço sem pedido específico.

## Publicação

Antes de qualquer chamada de escrita, confirme:

- manifesto correto;
- imagens finais e URLs HTTPS acessíveis;
- legenda revisada;
- job com ID único;
- fingerprint ainda correspondente;
- remetente autorizado;
- status `aprovado` e job não consumido.

Use primeiro `npm run publicar-instagram -- CAMINHO_PUBLICACAO` para dry-run. A publicação real usa `npm run publicar-instagram:aprovado -- CAMINHO_PUBLICACAO CAMINHO_JOB`.

Depois, registre ID, permalink, horário e resultado sanitizado. Em falha, preserve o job conforme as regras do sistema e diagnostique sem revelar resposta que contenha segredo.

## Diagnóstico de falhas

Classifique antes de sugerir correção:

- credencial ausente, inválida ou revogada;
- permissão ou ativo faltante;
- conta/Página desvinculada;
- mídia inacessível ou formato inválido;
- container ainda processando;
- limite, política ou versão da API;
- aprovação inválida, consumida ou divergente.

Revalide somente o componente afetado. Não gere um novo token automaticamente e não peça exposição do token para investigar.

## Conclusão

Informe estágio alcançado, verificações executadas, pendências e próximo comando seguro. Configuração concluída não autoriza publicar; aprovação de uma publicação não autoriza as seguintes.
