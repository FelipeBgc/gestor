# Sistema de Gestão de Loja

Sistema completo de gestão para lojas com frontend web, backend Node.js e banco de dados MySQL.

## 📁 Estrutura do Projeto

```
gestor/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # Rotas da API
│   │   ├── controllers/    # Controladores
│   │   ├── middleware/     # Middleware (autenticação, etc)
│   │   ├── config/         # Configurações (DB, migrate)
│   │   └── server.js       # Servidor principal
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                # HTML/CSS/JS
│   ├── js/
│   │   ├── api-service.js  # Cliente API
│   │   ├── config.js       # Configurações
│   │   └── *.js            # Scripts das páginas
│   ├── css/
│   ├── *.html              # Páginas
│   └── README.md
│
├── DEPLOY.md               # Instruções de hospedagem
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Desenvolvimento Local

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 3000
# ou: npx http-server -p 3000
```

Abrir: `http://localhost:3000`

### 2. Credenciais Padrão

- **Usuário:** admin
- **Senha:** admin123

## 📦 Funcionalidades

- ✅ Autenticação com JWT
- ✅ Gestão de Produtos/Estoque
- ✅ Cadastro de Clientes
- ✅ Gestão de Pedidos
- ✅ Agenda/Eventos
- ✅ Controle Financeiro
- ✅ Banco de dados centralizado

## 🔧 Tecnologias

**Backend:**
- Node.js 18+
- Express.js
- MySQL 8
- JWT Authentication
- bcryptjs

**Frontend:**
- HTML5
- CSS3
- JavaScript Vanilla
- Fetch API

## 📝 Requisitos

### Backend
- Node.js 18+ ([Download](https://nodejs.org))
- MySQL 8 ([Download](https://www.mysql.com/downloads/mysql/))

### Frontend
- Qualquer navegador moderno

## 🌐 Deploy

### Opções Recomendadas:

1. **Heroku** (Fácil, gratuito para testes)
   - Ver [DEPLOY.md](./DEPLOY.md#opção-1-heroku)

2. **DigitalOcean** (Bom custo-benefício, $5/mês)
   - Ver [DEPLOY.md](./DEPLOY.md#opção-2-digitalocean-app-platform)

3. **AWS** (Produção em larga escala)
   - Ver [DEPLOY.md](./DEPLOY.md#opção-3-aws)

4. **VPS** (DigitalOcean/Linode, controle total)
   - Ver [DEPLOY.md](./DEPLOY.md#opção-4-vps-digitalocean-linode)

## 🔐 Segurança

⚠️ **Antes de colocar em produção:**

1. Mude a chave JWT em `.env`
2. Mude a senha do admin
3. Configure CORS corretamente
4. Use HTTPS (certificado SSL)
5. Proteja dados sensíveis
6. Configure backups automáticos

## 📚 Documentação

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Deploy Guide](./DEPLOY.md)

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Erro: "ECONNREFUSED" ao conectar no banco
- Verifique se MySQL está rodando
- Verifique credenciais em `.env`

### Erro CORS no frontend
- Edite `backend/.env` com a URL correta
- Configure `CORS_ORIGIN`

### Página em branco ao abrir frontend
- Abra console (F12) para ver erros
- Verifique se backend está rodando
- Verifique URL da API em `frontend/js/config.js`

## 📞 Suporte

Para problemas, verifique:
1. Logs do backend: `npm run dev`
2. Console do navegador: F12
3. Banco de dados: `mysql -u root -p`

## 📄 Licença

MIT

---

**Pronto para hospedar públicamente!** 🎉
Ver [DEPLOY.md](./DEPLOY.md) para instruções completas.
