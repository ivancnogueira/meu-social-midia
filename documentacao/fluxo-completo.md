# Fluxo completo

## 1. Configurar

Execute `npm run configurar`, revise `conteudos/perfil-da-marca.md` e ajuste `conteudos/identidade-visual.yml`. O arquivo `.env` permanece somente no computador do usuário.

## 2. Criar artes e preview

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

O modo seco valida imagens e legenda, registra auditoria e não acessa serviços externos. Para uma publicação real, preencha `urlsPublicas` no manifesto com uma URL HTTPS por imagem. O projeto não incorpora um serviço secreto de hospedagem.

## 4. Solicitar aprovação

```powershell
npm run aprovar:criar -- caminho/publicacao.json
```

Isso cria `runtime/fila/CODIGO.json`. A aprovação deve vir do `chat_id` configurado no `.env`, pelo Telegram. Um job publicado ou cancelado não pode ser aprovado novamente.

## 5. Publicar um job aprovado

```powershell
npm run publicar-instagram:aprovado -- caminho/publicacao.json runtime/fila/CODIGO.json
```

O publicador marca o job como consumido, grava o identificador e o permalink. Em falha, registra somente uma mensagem sanitizada, sem credenciais.
