# ❓ Perguntas Frequentes

## 🚀 Como Começar?

### P: Por onde começo?
**R:** Leia nesta ordem:
1. [README.md](./README.md) - Visão geral
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - Como funciona
3. [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Migrar código
4. [DEPLOY.md](./DEPLOY.md) - Colocar online

### P: Qual é a estrutura básica?
**R:** Backend (Node.js/Express) + Frontend (HTML/CSS/JS) + Banco (MySQL)

### P: Preciso instalar algo?
**R:** Sim:
- Node.js 18+ ([download](https://nodejs.org))
- MySQL 8 ([download](https://www.mysql.com/downloads/mysql/))
- Git ([download](https://git-scm.com))

---

## 💻 Desenvolvimento Local

### P: Como rodar o projeto localmente?
**R:**
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run migrate
npm run dev

# Terminal 2 - Frontend
cd frontend
python -m http.server 3000
```

### P: Qual porta usa?
**R:**
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

### P: Credenciais padrão?
**R:**
- **Usuário:** admin
- **Senha:** admin123

### P: Erro ao rodar `npm install`?
**R:** Tente:
```bash
npm cache clean --force
npm install
```

### P: Erro de conexão com MySQL?
**R:** Verifique:
1. MySQL está rodando
2. Credenciais em `backend/.env` estão corretas
3. Banco de dados foi criado: `npm run migrate`

---

## 🗄️ Banco de Dados

### P: Como resetar o banco de dados?
**R:**
```bash
# Deletar banco
mysql -u root -p -e "DROP DATABASE gestor_loja;"

# Recriar
npm run migrate
```

### P: Como acessar o MySQL direto?
**R:**
```bash
mysql -u root -p
USE gestor_loja;
SELECT * FROM users;
```

### P: Onde está o arquivo do MySQL?
**R:** Dependente do SO:
- **Windows:** `C:\ProgramData\MySQL`
- **Mac:** `/usr/local/var/mysql`
- **Linux:** `/var/lib/mysql`

### P: Como fazer backup do banco?
**R:**
```bash
mysqldump -u root -p gestor_loja > backup.sql
```

### P: Como restaurar backup?
**R:**
```bash
mysql -u root -p gestor_loja < backup.sql
```

---

## 🔧 Frontend

### P: Como modificar o frontend para usar a API?
**R:** Consulte [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

### P: Posso usar localStorage ainda?
**R:** ❌ Não recomendado. Use a API que:
- Funciona para múltiplos usuários
- Dados persistem
- Seguro (JWT)
- Escalável

### P: Como incluir o api-service.js?
**R:** No HTML:
```html
<script src="js/config.js"></script>
<script src="js/api-service.js"></script>
<script src="js/sua-pagina.js"></script>
```

### P: Erro "API is not defined"?
**R:** Verifique:
1. `api-service.js` está incluído antes do seu script
2. Não há erros de console (F12)

---

## 🔐 Autenticação

### P: Como funciona a autenticação?
**R:**
1. Usuário faz login
2. Backend retorna JWT token
3. Token é salvo em localStorage
4. Cada request inclui o token no header
5. Backend valida token

### P: Token expirou, o que fazer?
**R:** Ele expira em 7 dias. Usuário precisa fazer login novamente.

### P: Como mudo a senha do admin?
**R:**
```bash
# MySQL
UPDATE users SET password = SHA2('nova_senha', 256) WHERE username = 'admin';
```

### P: Como adiciono outro usuário?
**R:** Pela interface de registro ou direto no MySQL.

---

## 📱 Deploy

### P: Qual opção de deploy é melhor?
**R:**
- **Iniciante:** Heroku
- **Bom custo:** DigitalOcean
- **Produção:** AWS
- **Controle total:** VPS

Ver [DEPLOY.md](./DEPLOY.md)

### P: Quanto custa hospedagem?
**R:**
- Heroku: Gratuito (com limitações)
- DigitalOcean: ~$5/mês
- AWS: ~$20-100/mês (depende uso)
- VPS: ~$5-20/mês

### P: Como colocar um domínio?
**R:** Ver [DEPLOY.md - Configuração de Domínio](./DEPLOY.md#configuração-de-domínio)

### P: Precisa de SSL/HTTPS?
**R:** ✅ Sim, obrigatório para produção. Veja Let's Encrypt (gratuito).

---

## 🐛 Troubleshooting

### P: Página em branco ao abrir?
**R:**
1. Abra DevTools (F12)
2. Vá em Console
3. Verifique erros
4. Erro mais comum: `API is not defined`

### P: Não consegue fazer login?
**R:**
1. Verifique backend está rodando
2. Credenciais estão corretas?
3. Banco de dados foi migrado?
4. DevTools mostra erro de CORS?

### P: Erro de CORS?
**R:** Configure em `backend/.env`:
```
CORS_ORIGIN=http://localhost:3000
```

### P: Dados não salvam?
**R:**
1. Verifique se API está recebendo request (DevTools → Network)
2. Response é 201 ou 200?
3. Banco de dados funciona? (`npm run migrate`)

### P: "Cannot POST /api/products"?
**R:** Rotas não estão registradas. Verifique `backend/src/server.js`

---

## 🔄 Mudanças e Atualizações

### P: Como atualizar a API?
**R:**
```bash
# Parar servidor (Ctrl+C)
git pull origin main
npm install
npm start
```

### P: Como adicionar nova rota?
**R:**
1. Criar arquivo em `backend/src/routes/nova-rota.js`
2. Registrar em `backend/src/server.js`
3. Criar endpoints GET, POST, PUT, DELETE
4. No frontend, adicionar método em `api-service.js`

### P: Como adicionar novo campo na tabela?
**R:** Consulte [ARCHITECTURE.md - Banco de Dados](./ARCHITECTURE.md#-banco-de-dados)

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [Express.js](https://expressjs.com)
- [MySQL 8](https://dev.mysql.com/doc/mysql-tutorial/8.0/en/)
- [JWT.io](https://jwt.io)

### Ferramentas Úteis
- [Insomnia](https://insomnia.rest) - Testar API
- [MySQL Workbench](https://www.mysql.com/products/workbench/) - Gerenciar DB
- [Visual Studio Code](https://code.visualstudio.com) - Editor

### Tutoriais
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [RESTful API Design](https://restfulapi.net)
- [JWT Authentication](https://tools.ietf.org/html/rfc7519)

---

## 🎯 Próximos Passos

1. ✅ Entender arquitetura
2. ✅ Rodar localmente
3. ⚠️ Migrar código do frontend (MIGRATION_GUIDE.md)
4. ✅ Testar todas as funcionalidades
5. ✅ Fazer deploy (DEPLOY.md)

---

## 📞 Precisa de Ajuda?

1. **Verifique console** (F12) para erros
2. **Verifique Network** para requisições
3. **Leia os READMEs** nas pastas
4. **Consulte este FAQ**
5. **Google para erros específicos**

---

**Dúvidas não listadas aqui? Crie uma Issue no repositório!**
