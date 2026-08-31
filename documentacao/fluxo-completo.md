# Fluxo completo

## 1. Configurar

Execute `npm run configurar`, escolha `local` ou `servidor` e conclua o onboarding estratégico. Ele pode ser retomado com `npm run onboarding` ou conduzido no Codex pelo `nucleo-social-media`. Revise o perfil, a identidade e os pilares. O `.env` permanece somente na instalação.

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

## 4. Solicitar aprovação

```powershell
npm run aprovar:criar -- caminho/publicacao.json
```

Isso cria `runtime/fila/CODIGO.json` com o fingerprint exato da versão. O Telegram envia slides, legenda, link protegido quando disponível e os botões. Se texto, URL ou arquivo mudar, crie uma nova solicitação.

## 5. Publicar um job aprovado

```powershell
npm run publicar-instagram:aprovado -- caminho/publicacao.json runtime/fila/CODIGO.json
```

O publicador marca o job como consumido, grava o identificador e o permalink. Em falha, registra somente uma mensagem sanitizada, sem credenciais.
