# Guia de Deploy - Sistema de Gestão de Loja

## Opção 1: Heroku (Recomendado para Iniciantes)

### Pré-requisitos
- Conta no [Heroku](https://www.heroku.com)
- [Git](https://git-scm.com) instalado
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado

### Passos Backend

```bash
# 1. Navegar para pasta backend
cd backend

# 2. Fazer login no Heroku
heroku login

# 3. Criar app
heroku create seu-app-name

# 4. Adicionar MySQL
heroku addons:create cleardb:ignite

# 5. Configurar variáveis de ambiente
heroku config:set JWT_SECRET=sua_chave_super_secreta
heroku config:set NODE_ENV=production

# 6. Deploy
git push heroku main

# 7. Executar migrações
heroku run npm run migrate
```

### Passos Frontend

1. Editar `js/config.js`:
```javascript
API_URL: 'https://seu-app-name.herokuapp.com/api'
```

2. Deploy no GitHub Pages ou Netlify

## Opção 2: DigitalOcean App Platform

### Backend
```bash
# 1. Conectar repositório GitHub ao DigitalOcean
# 2. Configurar app.yaml na raiz do backend
# 3. Deploy automático

# 4. Configurar banco de dados
# - Criar cluster MySQL no DigitalOcean
# - Adicionar variáveis de ambiente no painel

# 5. Executar migrações
# - Via SSH no app ou script de inicialização
```

### app.yaml (Backend)
```yaml
name: gestor-api
services:
  - name: api
    github:
      repo: seu-usuario/seu-repo
      branch: main
    build_command: npm install
    run_command: npm start
    envs:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: "8080"
      - key: DB_HOST
        scope: RUN_TIME
        value: ${db.host}
      - key: DB_USER
        scope: RUN_TIME
        value: ${db.username}
      - key: DB_PASSWORD
        scope: RUN_TIME
        value: ${db.password}
      - key: DB_NAME
        value: gestor_loja

databases:
  - name: db
    engine: MYSQL
    version: "8"
```

## Opção 3: AWS (Produção)

### Backend - ECS/Fargate + RDS

```bash
# 1. Criar Dockerfile
# 2. Push para ECR (Elastic Container Registry)
# 3. Criar serviço ECS Fargate
# 4. Configurar RDS MySQL
# 5. Usar Secrets Manager para variáveis sensíveis
```

### Frontend - S3 + CloudFront

```bash
# 1. Build da aplicação
# 2. Upload para S3 bucket
# 3. Configurar CloudFront distribution
# 4. Route 53 para domínio customizado
```

## Opção 4: VPS (DigitalOcean/Linode)

### Setup Inicial

```bash
# Conectar via SSH
ssh root@seu_ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar MySQL
sudo apt-get install -y mysql-server

# Instalar PM2 (process manager)
sudo npm install -g pm2
```

### Deploy Backend

```bash
# Clonar repositório
git clone seu-repositorio
cd seu-repositorio/backend

# Instalar dependências
npm install

# Criar .env com dados reais
nano .env

# Rodar migrações
npm run migrate

# Iniciar com PM2
pm2 start src/server.js --name "gestor-api"
pm2 save
pm2 startup
```

### Deploy Frontend (Nginx)

```bash
# Instalar Nginx
sudo apt-get install -y nginx

# Criar pasta do site
sudo mkdir -p /var/www/seu-dominio

# Copiar arquivos frontend
sudo cp -r frontend/* /var/www/seu-dominio/

# Configurar Nginx
sudo nano /etc/nginx/sites-available/seu-dominio
```

### Configuração Nginx

```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;

    root /var/www/seu-dominio;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # SSL (após obter certificado Let's Encrypt)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/seu-dominio /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Certificado SSL (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com.br
```

## Configuração de Domínio

1. Apontar DNS para seu servidor:
   - `A record` → seu IP do servidor
   - Pode levar até 48 horas

2. Testar:
   ```bash
   nslookup seu-dominio.com.br
   ```

## Variáveis de Ambiente em Produção

**JAMAIS coloque dados sensíveis no código!**

Para cada plataforma:
- **Heroku**: `heroku config:set KEY=value`
- **DigitalOcean**: Painel → App → Settings → Environment
- **AWS**: Secrets Manager ou Parameter Store
- **VPS**: Arquivo `.env` (não commitar no Git)

## Monitoramento

```bash
# PM2 Monitoramento
pm2 monit

# Logs
pm2 logs gestor-api

# Reiniciar automático
pm2 startup
```

## Backup do Banco de Dados

```bash
# MySQL Backup
mysqldump -u root -p gestor_loja > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u root -p gestor_loja < backup_20240101.sql
```

## Checklist Final

- [ ] Backend rodando em HTTPS
- [ ] Frontend acessível via domínio
- [ ] Certificado SSL válido
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente protegidas
- [ ] CORS configurado corretamente
- [ ] Backup automático ativado
- [ ] Logs e monitoramento funcionando

## Suporte e Dúvidas

- Backend: `seu-dominio.com/api/health`
- Status: Você verá `{"status": "OK"}`
