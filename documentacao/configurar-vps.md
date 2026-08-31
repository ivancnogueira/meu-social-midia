# Configurar o modo Servidor/VPS

O modo servidor mantém Telegram e preview disponíveis continuamente e fornece URLs HTTPS assinadas para as imagens. Ele é destinado a uma instalação isolada por cliente ou negócio.

## 1. Pré-requisitos

- VPS Linux com Node.js 20+, Git e acesso SSH por chave.
- Domínio ou subdomínio com registro DNS apontando para a VPS.
- Portas 80 e 443 disponíveis para o proxy HTTPS.
- Usuário Linux sem privilégios administrativos para executar o Studio.

## 2. Configurar o perfil

```bash
npm run configurar:servidor -- studio.exemplo.com
```

O instalador grava configurações não secretas, gera segredos aleatórios localmente e cria em `runtime/vps/`:

- trecho de `Caddyfile`;
- serviço de preview;
- serviço do Telegram;
- instruções para revisão e instalação.

Ele não instala pacotes, não altera firewall e não sobrescreve a configuração do Caddy.

## 3. Revisar antes de instalar

```bash
npm run vps:gerar-config
```

Revise os arquivos gerados. Mescle o trecho do Caddy com qualquer configuração existente e só então copie os serviços para `systemd`. Ative o serviço do Telegram apenas depois de configurar o bot; caso contrário ele reiniciará aguardando as credenciais. Use chaves SSH, menor privilégio possível e permissões restritas no `.env`.

## 4. Rotas públicas

- `/health`: verificação sem dados sensíveis.
- `/revisao/SLUG?token=...`: preview com token temporário.
- `/midia/CAMINHO?token=...`: imagem com assinatura estável para a Meta.

Qualquer outra rota responde 404. `.env`, logs, fila, conteúdos e arquivos do repositório não são servidos.

## 5. Diagnóstico

Depois de DNS, Caddy e serviços ativos:

```bash
npm run diagnosticar:vps
```

O diagnóstico resolve o domínio e consulta `/health`, sem revelar credenciais. Uma publicação real continua exigindo job aprovado e comando explícito de publicação.

## 6. Backup

Inclua `conteudos/`, `recursos/`, `saidas/`, `runtime/` e `logs/` no backup privado. Nunca envie `.env`, tokens ou backups de clientes ao Git.
