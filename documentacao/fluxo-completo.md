# Fluxo completo

Durante a primeira instalação, este fluxo é obrigatório até o fim para um post individual: criação, preview, confirmação exata do job no chat e publicação na Meta. O Studio só recebe estado `pronto` depois de registrar o resultado dessa publicação. Nas publicações seguintes, cada job continua exigindo nova aprovação. Telegram é um canal alternativo opcional.

## 1. Configurar

Execute `npm run configurar`, escolha `local` ou `servidor` e conclua o onboarding estratégico. Ele pode ser retomado com `npm run onboarding` ou conduzido no Codex pelo `nucleo-social-media`. Revise o perfil, a identidade e os pilares. O `.env` permanece somente na instalação.

Na identidade, `recursos/brand/design-system.md` registra as regras aprovadas, `recursos/brand/tokens.css` guarda valores exatos e `conteudos/identidade-visual.yml` conecta esses valores às automações. As habilidades visuais bloqueiam a geração quando essas fontes estão incompletas ou conflitantes.

## 2. Criar artes e preview

No fluxo premium, as habilidades visuais geram PNGs com ImageGen, fotos e referências autorizadas e registram os caminhos relativos no campo `imagens` do JSON. O comando normaliza, organiza e cria o preview. Sem `imagens`, o gerador local funciona como fallback explícito.

Copie `exemplos/publicacao-exemplo.json`, altere o conteúdo e execute:

```powershell
npm run criar-conteudo -- meu-conteudo.json
npm run atualizar-vitrine
```

O gerador cria PNGs 1080x1350, `publicacao.json`, um preview individual e a vitrine `previas/index.html`.

## 3. Validar a publicação

```powershell
npm run publicar-instagram -- caminho/publicacao.json
```

O modo seco valida imagens e legenda, registra auditoria e não acessa serviços externos. No modo servidor, `urlsPublicas` é preenchido durante a geração usando o domínio e tokens de mídia. No modo local, informe uma URL HTTPS por imagem antes da publicação real.

No modo local, o fluxo padrão é executar `npm run pages:publicar -- caminho/publicacao.json` depois da aprovação visual e antes de criar o job. O comando publica os artefatos autorizados no repositório de Pages do usuário e grava as URLs públicas no manifesto. Confirme que a prévia e o PNG respondem em HTTPS e entregue esse link ao usuário antes de criar o job; essa é a URL que a Meta utilizará para buscar a mídia.

## 4. Solicitar aprovação

```powershell
npm run aprovar:criar -- caminho/publicacao.json
```

Isso cria `runtime/fila/CODIGO.json` com o fingerprint exato da versão.

No fluxo principal pelo Codex, mostre o resumo e solicite no chat `APROVAR CODIGO`; depois execute `npm run aprovar:local -- CODIGO "APROVAR CODIGO"`. Telegram é uma alternativa opcional. Em ambos os canais, se texto, URL ou arquivo mudar, crie uma nova solicitação.

## 5. Publicar um job aprovado

```powershell
npm run publicar-instagram:aprovado -- caminho/publicacao.json runtime/fila/CODIGO.json
```

O publicador marca o job como consumido, grava o identificador e o permalink. Em falha, registra somente uma mensagem sanitizada, sem credenciais.
