# Guia de Migração: localStorage → API

Este guia explica como modificar o código do frontend para usar a API em vez de localStorage.

## 🔄 Padrão de Mudança

### Antigo (localStorage)
```javascript
// Salvar dados
const inventory = { name: 'Produto', price: 100 };
localStorage.setItem('inventory', JSON.stringify(inventory));

// Recuperar dados
const data = JSON.parse(localStorage.getItem('inventory'));
```

### Novo (API)
```javascript
// Salvar dados
const response = await API.createProduct({ name: 'Produto', price: 100 });

// Recuperar dados
const products = await API.getProducts();
```

## 📝 Arquivo: login.js

### Antes
```javascript
function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

loginForm?.addEventListener('submit', event => {
    const users = getUsers();
    const validUser = users.find(user => user.username === username);
    if (validUser) {
        localStorage.setItem(authKey, 'true');
        localStorage.setItem(currentUserKey, validUser.username);
        window.location.replace('gestor.html');
    }
});
```

### Depois
```javascript
loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    try {
        const result = await API.login(
            usernameInput?.value.trim(),
            passwordInput?.value
        );
        window.location.replace('gestor.html');
    } catch (error) {
        loginMessage.textContent = 'Erro: ' + error.message;
        loginMessage.style.display = 'block';
    }
});
```

## 🛍️ Arquivo: cadastrar.js / script.js (Produtos)

### Antes
```javascript
function getInventory() {
    return JSON.parse(localStorage.getItem(inventoryKey) || '[]');
}

function saveInventory(inventory) {
    localStorage.setItem(inventoryKey, JSON.stringify(inventory));
}

addStockBtn?.addEventListener('click', () => {
    const inventory = getInventory();
    inventory.push(newProduct);
    saveInventory(inventory);
});
```

### Depois
```javascript
async function loadProducts() {
    try {
        const products = await API.getProducts();
        displayProducts(products);
    } catch (error) {
        alert('Erro ao carregar produtos: ' + error.message);
    }
}

addStockBtn?.addEventListener('click', async () => {
    try {
        await API.createProduct({
            name: orderNameInput?.value,
            details: detailsInput?.value,
            costPrice: costPriceInput?.value,
            profitMargin: profitMarginInput?.value,
            sellingPrice: sellingPriceInput?.value,
            quantity: quantityInput?.value
        });
        loadProducts(); // Recarregar lista
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});
```

## 👥 Arquivo: clientes.js / script.js (Clientes)

### Antes
```javascript
function getClients() {
    return JSON.parse(localStorage.getItem(clientsKey) || '[]');
}

function addClient(client) {
    const clients = getClients();
    clients.push(client);
    localStorage.setItem(clientsKey, JSON.stringify(clients));
}
```

### Depois
```javascript
async function loadClients() {
    try {
        const clients = await API.getClients();
        clientList.innerHTML = ''; // Limpar
        clients.forEach(client => {
            const div = document.createElement('div');
            div.textContent = client.name;
            clientList.appendChild(div);
        });
    } catch (error) {
        alert('Erro ao carregar clientes: ' + error.message);
    }
}

async function addClient(client) {
    try {
        await API.createClient(client);
        loadClients(); // Recarregar lista
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}
```

## 📦 Arquivo: pedidos.js / script.js (Pedidos)

### Antes
```javascript
const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
orders.push(newOrder);
localStorage.setItem(ordersKey, JSON.stringify(orders));
```

### Depois
```javascript
async function createOrder(orderData) {
    try {
        await API.createOrder({
            code: orderCodeInput?.value,
            clientId: parseInt(orderClientSelect?.value),
            productId: parseInt(orderProductSelect?.value),
            quantity: parseInt(orderQuantityInput?.value),
            total: parseFloat(orderTotalInput?.value),
            paymentMethod: document.querySelector('input[name="order-payment"]:checked')?.value,
            paymentStatus: orderPaidInput?.checked ? 'paid' : 'pending'
        });
        loadOrders();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

async function loadOrders() {
    try {
        const orders = await API.getOrders();
        // Atualizar DOM
        displayOrders(orders);
    } catch (error) {
        alert('Erro ao carregar pedidos');
    }
}
```

## 📅 Arquivo: agenda.js / script.js (Agenda)

### Antes
```javascript
const agendaEvents = JSON.parse(localStorage.getItem('agendaEvents') || '[]');
agendaEvents.push({ date, notes });
localStorage.setItem('agendaEvents', JSON.stringify(agendaEvents));
```

### Depois
```javascript
saveAgendaEventBtn?.addEventListener('click', async () => {
    try {
        const date = agendaSelectedDateInput?.value;
        const notes = agendaNotesTextarea?.value;
        
        await API.createAgendaEvent({ eventDate: date, notes });
        loadAgendaEvents();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
});

async function loadAgendaEvents() {
    try {
        const events = await API.getAgendaEvents();
        // Atualizar calendário
        displayAgendaEvents(events);
    } catch (error) {
        alert('Erro ao carregar agenda');
    }
}
```

## 💰 Arquivo: financas.js / script.js (Finanças)

### Antes
```javascript
const finances = JSON.parse(localStorage.getItem(financesKey) || '{}');
finances.received = 1000;
localStorage.setItem(financesKey, JSON.stringify(finances));
```

### Depois
```javascript
async function loadFinanceSummary() {
    try {
        const month = financeMonthField?.value; // YYYY-MM
        const summary = await API.getFinancesSummary(month);
        
        financeReceivedValue.textContent = summary.received.toFixed(2);
        financeReceivableValue.textContent = summary.receivable.toFixed(2);
        financeOverdueValue.textContent = summary.overdue.toFixed(2);
    } catch (error) {
        alert('Erro ao carregar finanças: ' + error.message);
    }
}
```

## 🔐 Autenticação

### Verificar se está autenticado
```javascript
// Antigo
if (localStorage.getItem('authKey') !== 'true') {
    window.location.href = 'login.html';
}

// Novo
if (!API.isLoggedIn()) {
    window.location.href = 'login.html';
}
```

### Logout
```javascript
// Antigo
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('authKey');
    window.location.href = 'login.html';
});

// Novo
logoutBtn.addEventListener('click', () => {
    API.logout();
});
```

## ✅ Checklist de Migração

Para cada arquivo JavaScript:

- [ ] Substituir `localStorage.getItem()` por `API.get*()`
- [ ] Substituir `localStorage.setItem()` por `API.create*()` ou `API.update*()`
- [ ] Adicionar `async/await` nas funções
- [ ] Adicionar `try/catch` para tratamento de erros
- [ ] Testar criação de dados
- [ ] Testar leitura de dados
- [ ] Testar atualização de dados
- [ ] Testar exclusão de dados
- [ ] Testar logout

## 🧪 Testando

1. Abrir DevTools (F12)
2. Ir para aba "Network"
3. Executar ações (criar, editar, deletar)
4. Verificar se requests aparecem em "Network"
5. Verificar se response é "200 OK"

## 📍 Exemplo Completo

Arquivo: `frontend/js/exemplo-migracao.js`

```javascript
// Importar API (no HTML incluir <script src="js/api-service.js"></script>)

// 1. Função para carregar produtos
async function loadProducts() {
    try {
        const products = await API.getProducts();
        console.log('Produtos:', products);
        
        const list = document.getElementById('products-list');
        list.innerHTML = '';
        
        products.forEach(product => {
            const item = document.createElement('div');
            item.innerHTML = `
                <h3>${product.name}</h3>
                <p>Preço: R$ ${product.selling_price}</p>
                <p>Quantidade: ${product.quantity}</p>
                <button onclick="deleteProduct(${product.id})">Deletar</button>
            `;
            list.appendChild(item);
        });
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// 2. Função para criar produto
async function createProduct(name, price, quantity) {
    try {
        const result = await API.createProduct({
            name: name,
            sellingPrice: price,
            quantity: quantity
        });
        console.log('Criado:', result);
        loadProducts(); // Recarregar lista
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// 3. Função para deletar produto
async function deleteProduct(id) {
    try {
        await API.deleteProduct(id);
        loadProducts();
    } catch (error) {
        alert('Erro: ' + error.message);
    }
}

// 4. Carregar ao iniciar
document.addEventListener('DOMContentLoaded', loadProducts);
```

---

Dúvidas? Consulte a [API Service Documentation](./api-service.js)
