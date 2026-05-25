# Arquitetura do Sistema

## 🏗️ Visão Geral

```
┌─────────────────┐         INTERNET          ┌──────────────────┐
│                 │                           │                  │
│   Navegador     │◄──────HTTP/HTTPS────────►│  Servidor Web    │
│   (Frontend)    │                           │  (Nginx/Apache)  │
│                 │                           │                  │
└─────────────────┘                           └──────────────────┘
         │                                            │
         │  requests                                  │  proxy
         │  (api-service.js)                          │
         │                                            │
         └────────────────────┬─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │  Node.js/Express  │
                    │  API (Backend)    │
                    │                   │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │                   │
                    │   MySQL Database  │
                    │  (Dados Reais)    │
                    │                   │
                    └───────────────────┘
```

## 📱 Frontend (Cliente)

**Tecnologia:** HTML5, CSS3, JavaScript Vanilla

**Responsabilidades:**
- Interface do usuário
- Coleta de dados
- Validação básica
- Comunicação com API via `api-service.js`

**Estrutura:**
```
frontend/
├── index.html
├── login.html          # Login
├── register.html       # Registrar
├── gestor.html         # Dashboard
├── cadastrar.html      # Produtos
├── clientes.html       # Clientes
├── pedidos.html        # Pedidos
├── agenda.html         # Agenda
├── financas.html       # Finanças
├── perfil.html         # Perfil do usuário
│
├── css/                # Estilos
│   ├── login.css
│   ├── cadastrar.css
│   └── ...
│
└── js/
    ├── api-service.js  # ⭐ Cliente HTTP (crucial)
    ├── config.js       # Configurações globais
    └── (arquivos.js)   # Scripts das páginas (será migrado para usar API)
```

## 🔧 Backend (Servidor)

**Tecnologia:** Node.js 18+, Express.js

**Responsabilidades:**
- Lógica de negócio
- Validação de dados
- Autenticação/Autorização (JWT)
- Acesso ao banco de dados
- Segurança

**Estrutura:**
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # Conexão MySQL
│   │   └── migrate.js       # Criar tabelas
│   │
│   ├── middleware/
│   │   └── auth.js          # Autenticação JWT
│   │
│   ├── routes/
│   │   ├── auth.js          # POST /login, /register
│   │   ├── products.js      # GET, POST, PUT, DELETE /products
│   │   ├── clients.js       # GET, POST, PUT, DELETE /clients
│   │   ├── orders.js        # GET, POST, PUT, DELETE /orders
│   │   ├── agenda.js        # GET, POST, PUT, DELETE /agenda
│   │   └── finances.js      # GET, POST /finances
│   │
│   └── server.js            # ⭐ App principal
│
├── package.json
├── .env.example
└── README.md
```

## 💾 Banco de Dados

**Tipo:** MySQL 8

**Tabelas:**
```
users
├── id (int, PK)
├── username (varchar unique)
├── password (varchar hashed)
├── shop_name (varchar)
└── created_at, updated_at

products
├── id (int, PK)
├── user_id (FK → users)
├── name, details, size
├── cost_price, profit_margin, selling_price
├── quantity
└── created_at, updated_at

clients
├── id (int, PK)
├── user_id (FK → users)
├── name, source, type (person/company)
├── cpf, cnpj, razao_social
├── phone, address, birthday
└── created_at, updated_at

orders
├── id (int, PK)
├── user_id (FK → users)
├── client_id (FK → clients)
├── product_id (FK → products)
├── code, order_date
├── quantity, discount, freight, fees, total
├── payment_method, payment_status
└── created_at, updated_at

agenda_events
├── id (int, PK)
├── user_id (FK → users)
├── event_date
├── notes
└── created_at, updated_at

financial_movements
├── id (int, PK)
├── user_id (FK → users)
├── order_id (FK → orders)
├── type (received/receivable/investment)
├── amount, due_date, payment_date
└── created_at, updated_at
```

## 🔄 Fluxo de Dados

### 1. Login

```
[Frontend Form]
    ↓
[api-service.login()]
    ↓
[POST /api/auth/login]
    ↓
[Backend: verificar credenciais]
    ↓
[Gerar JWT Token]
    ↓
[Salvar no localStorage]
    ↓
[Redirecionar para gestor.html]
```

### 2. Criar Produto

```
[Form com dados do produto]
    ↓
[API.createProduct(data)]
    ↓
[POST /api/products]
    ↓
[Middleware: verificar JWT]
    ↓
[Backend: validar dados]
    ↓
[INSERT no MySQL]
    ↓
[Retornar ID criado]
    ↓
[Frontend: recarregar lista]
```

### 3. Listar Produtos

```
[Página carrega]
    ↓
[API.getProducts()]
    ↓
[GET /api/products]
    ↓
[Middleware: verificar JWT]
    ↓
[SELECT * FROM products]
    ↓
[Retornar array JSON]
    ↓
[Frontend: renderizar HTML]
```

## 🔐 Segurança

### Autenticação
- JWT (JSON Web Token)
- Token salvo em localStorage
- Enviado no header: `Authorization: Bearer {token}`
- Expira em 7 dias

### Criptografia
- Senhas com bcryptjs (10 rounds)
- HTTPS em produção
- CORS configurado

### Validação
- Backend valida TODOS os dados
- Frontend é apenas para UX

## 📡 API REST

### Estrutura de Requests

```javascript
GET /api/products
Headers: {
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
}

POST /api/products
Headers: {
    Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
    Content-Type: application/json
}
Body: {
    name: "Produto",
    sellingPrice: 100,
    quantity: 5
}
```

### Status Codes

```
200 OK - Sucesso
201 Created - Recurso criado
400 Bad Request - Dados inválidos
401 Unauthorized - Sem autenticação
403 Forbidden - Sem permissão
404 Not Found - Recurso não existe
500 Server Error - Erro no servidor
```

## 🚀 Fluxo de Deploy

### Desenvolvimento Local
```
npm run migrate  → Criar DB
npm run dev      → Iniciar servidor (hot reload)
```

### Staging
```
→ Branch separate
→ Deploy automático
→ Testar alterações
```

### Produção
```
→ Testes completos
→ Build otimizado
→ Deploy com zero-downtime
→ Monitoramento
→ Backups automáticos
```

## 🔄 Integração Frontend ↔ Backend

### api-service.js (Cliente HTTP)

É a **camada de comunicação** entre frontend e backend.

```javascript
// Centralizador de requisições HTTP
class ApiService {
    async request(method, endpoint, body) {
        // 1. Monta headers com JWT
        // 2. Faz requisição fetch
        // 3. Trata erros
        // 4. Retorna dados formatados
    }
    
    async login(username, password) { }
    async getProducts() { }
    async createProduct(data) { }
    // ... etc
}
```

**Por que usar?**
- Centraliza a lógica HTTP
- Fácil de mudar base URL
- Tratamento de erros consistent
- Injeção automática de JWT

## 📊 Performance

### Frontend
- Cache de dados no localStorage
- Requisições otimizadas
- JS minificado
- CSS comprimido

### Backend
- Índices no banco de dados
- Connection pooling
- Caching de queries
- Compressão GZIP

### Banco de Dados
- Queries otimizadas
- Índices nas foreign keys
- Backups automáticos

---

**Arquitetura: ✅ Moderna, Escalável, Profissional**
