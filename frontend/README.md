// Frontend - Sistema de Gestão de Loja

Aplicação frontend para consumir a API do sistema de gestão de loja.

## Instalação

### Opção 1: Servidor Web Local (Desenvolvimento)

```bash
# Use Python (qualquer versão)
python -m http.server 3000

# Ou Node.js
npx http-server -p 3000
```

### Opção 2: Integração com Backend

1. Configure a URL da API no arquivo `.env.local`:
   ```
   API_URL=http://localhost:5000/api
   ```

2. Ou edite `config.js`:
   ```javascript
   API_URL: 'http://localhost:5000/api'
   ```

## Estrutura

- `*.html` - Páginas HTML
- `css/` - Estilos CSS
- `js/` - Scripts JavaScript
- `js/api-service.js` - Classe para requisições da API
- `js/config.js` - Configurações globais

## Como Funciona

1. **Login** (`login.html`) - Autentica usuário via API e armazena token JWT
2. **Registro** (`register.html`) - Cria novo usuário
3. **Dashboard** (`gestor.html`) - Página principal
4. **Páginas** - Cada página faz requisições à API sem usar localStorage

## Modificações Necessárias

### login.js
Substituir lógica localStorage por:
```javascript
async function handleLogin(username, password) {
    try {
        const data = await API.login(username, password);
        window.location.replace('gestor.html');
    } catch (error) {
        alert('Erro ao fazer login: ' + error.message);
    }
}
```

### script.js
Substituir todas as operações localStorage:
```javascript
// Antigo:
const inventory = JSON.parse(localStorage.getItem('gestorInventory'));

// Novo:
const products = await API.getProducts();
```

### cadastrar.js, clientes.js, pedidos.js, etc.
Usar `API.createProduct()`, `API.getClients()`, etc. em vez de localStorage

## Deploy

Ver [DEPLOY.md](../DEPLOY.md) para instruções de hospedagem.
