# Backend - Sistema de Gestão de Loja

API Node.js/Express com banco de dados MySQL para o sistema de gestão de loja.

## Instalação

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Preencha com suas credenciais do MySQL

3. **Execute as migrações para criar o banco de dados:**
   ```bash
   npm run migrate
   ```

## Scripts

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento (com nodemon)
- `npm run migrate` - Cria/atualiza o banco de dados

## Variáveis de Ambiente

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=gestor_loja
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=http://localhost:3000
```

## Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registrar novo usuário

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Clientes
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Pedidos
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id` - Atualizar pedido
- `DELETE /api/orders/:id` - Deletar pedido

### Agenda
- `GET /api/agenda` - Listar eventos
- `POST /api/agenda` - Criar evento
- `PUT /api/agenda/:id` - Atualizar evento
- `DELETE /api/agenda/:id` - Deletar evento

### Finanças
- `GET /api/finances` - Listar movimentações
- `GET /api/finances/summary/:month` - Resumo do mês (YYYY-MM)
- `POST /api/finances` - Criar movimentação

## Usuário Padrão

Após as migrações, um usuário padrão é criado:
- **Usuário:** admin
- **Senha:** admin123

## Deploy

Ver [DEPLOY.md](./DEPLOY.md) para instruções de hospedagem.
