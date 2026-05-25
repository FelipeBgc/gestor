# 🚀 Guia de Instalação Rápida

Comece em 15 minutos!

## 1️⃣ Pré-requisitos (5 min)

Instale em ordem:

### Windows
```bash
# 1. Node.js
# Baixe em: https://nodejs.org
# Escolha LTS (18.x)

# 2. MySQL
# Baixe em: https://www.mysql.com/downloads/mysql/
# Escolha 8.0 Community Server
# Instale com default settings

# Verificar instalação
node --version
npm --version
mysql --version
```

### macOS
```bash
# Via Homebrew (recomendado)
brew install node
brew install mysql

# Iniciar MySQL
brew services start mysql
```

### Linux (Ubuntu)
```bash
sudo apt update
sudo apt install nodejs npm mysql-server

# Iniciar MySQL
sudo service mysql start
```

---

## 2️⃣ Backend (5 min)

```bash
# 1. Ir para pasta backend
cd backend

# 2. Instalar dependências
npm install

# 3. Copiar arquivo de configuração
cp .env.example .env

# 4. Editar .env com suas credenciais MySQL
# Windows: notepad .env
# Mac/Linux: nano .env

# 5. Criar banco de dados
npm run migrate

# 6. Iniciar servidor
npm run dev

# Resultado esperado:
# 🚀 Servidor rodando em http://localhost:5000
```

---

## 3️⃣ Frontend (5 min)

**Em outro terminal:**

```bash
# 1. Ir para pasta frontend
cd frontend

# 2. Iniciar servidor web (escolha uma opção)

# Opção A: Python (Windows/Mac/Linux)
python -m http.server 3000

# Opção B: Node.js
npx http-server -p 3000

# Opção C: Live Server no VS Code
# Instale extensão "Live Server"
# Clique direito → Open with Live Server

# Resultado esperado:
# Servidor rodando em http://localhost:3000
```

---

## 4️⃣ Testar (Agora!)

Abra navegador:

```
http://localhost:3000
```

**Login:**
- Usuário: `admin`
- Senha: `admin123`

---

## ✅ Pronto!

Se chegou aqui: **Parabéns! 🎉**

Sistema rodando:
- ✅ Frontend: http://localhost:3000
- ✅ Backend: http://localhost:5000
- ✅ Banco: MySQL local

---

## 🔄 Próximas Etapas

1. **Explorar o painel** (clicar em buttons)
2. **Ler [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** para modificar código
3. **Ler [ARCHITECTURE.md](./ARCHITECTURE.md)** para entender como funciona
4. **Ler [DEPLOY.md](./DEPLOY.md)** para colocar online

---

## ⚠️ Problemas Comuns

### "Cannot find module"
```bash
npm install
```

### "ECONNREFUSED" (banco de dados)
```bash
# Windows: Abra MySQL Workbench
# Mac: brew services start mysql
# Linux: sudo service mysql start

# Depois: npm run migrate
```

### Porta já em uso
```bash
# Mudar porta
npm run dev -- --port 5001
python -m http.server 3001
```

### Arquivo não encontrado
Certifique-se de estar nos diretórios corretos:
```
gestor/backend/  ← para npm commands
gestor/frontend/ ← para http server
```

---

## 📱 Acessar de Outro Computador

Se quer acessar de outro PC na rede:

```
http://seu-ip:3000
http://seu-ip:5000
```

Encontrar seu IP:
```bash
# Windows: ipconfig
# Mac/Linux: ifconfig
# Procure por "IPv4 Address"
```

---

## 🛠️ Desenvolvimento Contínuo

**Para fazer mudanças no código:**

```bash
# Backend: já atualiza automaticamente (nodemon)
# Frontend: você precisa dar F5 no navegador
```

---

## 🎓 Próxima Lição

Depois de rodar localmente, leia:
1. **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Roteiro completo
2. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Migrar localStorage → API
3. **[DEPLOY.md](./DEPLOY.md)** - Colocar online

---

**Sucesso! 🚀**
