# 📋 Implementação do Supabase - Checklist de Próximas Etapas

## ✅ O Que Foi Feito

1. **Configuração Supabase**:
   - ✅ `js/supabase-config.js` - Configuração e funções de autenticação
   - ✅ `js/supabase-sync.js` - Funções de sincronização com banco de dados
   - ✅ `SUPABASE_SCHEMA.sql` - Script SQL para criar todas as tabelas e RLS

2. **Autenticação**:
   - ✅ `js/login.js` - Reescrito para usar Supabase Auth
   - ✅ `js/register.js` - Reescrito para usar Supabase Auth
   - ✅ `login.html` - Atualizado para usar email
   - ✅ `register.html` - Atualizado para usar email
   - ✅ `js/gestor.js` - Integração com Supabase e logout

3. **Documentação**:
   - ✅ `SUPABASE_SETUP.md` - Guia completo de configuração
   - ✅ `SUPABASE_SCHEMA.sql` - Arquivo com todas as tabelas SQL

## 🚀 Próximas Etapas - Integração em Cada Página

### 1️⃣ Cadastro de Produtos (`js/cadastrar.js`)

**O que fazer**:
- Importar funções de `supabase-sync.js`
- Trocar `localStorage` por chamadas ao Supabase
- Migrar função `addNewProduct()` para usar `saveProductToDB()`

**Funções necessárias**:
```javascript
import { 
    saveProductToDB,
    saveProductImageToDB,
    getProductsFromDB
} from './supabase-sync.js';
```

**Mudanças principais**:
```javascript
// ANTES (localStorage):
function addNewProduct(name, details) {
    const product = { id, name, details };
    localStorage.setItem('gestorProducts', JSON.stringify([...products, product]));
}

// DEPOIS (Supabase):
async function addNewProduct(name, details) {
    const product = { product_name: name, details };
    const result = await saveProductToDB(product);
    return result;
}
```

### 2️⃣ Estoque/Inventário (`js/estoque.js`)

**Funções necessárias**:
```javascript
import {
    getInventoryFromDB,
    addInventoryLotToDB,
    updateInventoryLotInDB,
    deleteInventoryLotFromDB,
    getProductImageFromDB
} from './supabase-sync.js';
```

**Mudanças principais**:
- `getInventory()` → `getInventoryFromDB()`
- `addInventoryLot()` → `addInventoryLotToDB()`
- Atualizar renderização para usar dados do Supabase

### 3️⃣ Clientes (`js/clientes.js`)

**Funções necessárias**:
```javascript
import {
    getClientsFromDB,
    saveClientToDB,
    updateClientInDB,
    deleteClientFromDB
} from './supabase-sync.js';
```

### 4️⃣ Pedidos (`js/pedidos.js`)

**Funções necessárias**:
```javascript
import {
    getOrdersFromDB,
    saveOrderToDB,
    updateOrderInDB,
    deleteOrderFromDB,
    getClientsFromDB,
    getInventoryFromDB
} from './supabase-sync.js';
```

### 5️⃣ Agenda (`js/agenda.js`)

**Funções necessárias**:
```javascript
import {
    getScheduleEventsFromDB,
    saveScheduleEventToDB,
    updateScheduleEventInDB,
    deleteScheduleEventFromDB
} from './supabase-sync.js';
```

### 6️⃣ Finanças (`js/financas.js`)

**Funções necessárias**:
```javascript
import {
    getInvestmentsFromDB,
    saveInvestmentToDB,
    getOrdersFromDB
} from './supabase-sync.js';
```

### 7️⃣ Perfil (`js/perfil.js`)

**Funções necessárias**:
```javascript
import { supabase } from './supabase-config.js';
import { getShopProfile } from './supabase-config.js';
```

## 📝 Padrão de Integração

Cada página deve seguir este padrão:

```javascript
import { supabase } from './supabase-config.js';
import { 
    getDataFromDB,
    saveDataToDB,
    updateDataInDB,
    deleteDataFromDB
} from './supabase-sync.js';

// Carregar dados ao inicializar
document.addEventListener('DOMContentLoaded', async () => {
    const data = await getDataFromDB();
    renderData(data);
});

// Salvar novos dados
async function handleSaveData(dataToSave) {
    const result = await saveDataToDB(dataToSave);
    if (result) {
        // Atualizar UI
        const updatedData = await getDataFromDB();
        renderData(updatedData);
    }
}

// Atualizar dados existentes
async function handleUpdateData(id, updates) {
    const result = await updateDataInDB(id, updates);
    if (result) {
        const updatedData = await getDataFromDB();
        renderData(updatedData);
    }
}

// Deletar dados
async function handleDeleteData(id) {
    const result = await deleteDataFromDB(id);
    if (result) {
        const updatedData = await getDataFromDB();
        renderData(updatedData);
    }
}
```

## 🔐 Segurança

- ✅ RLS (Row Level Security) está configurado no banco de dados
- ✅ Cada usuário só vê dados da sua loja
- ✅ API Key pública (anon) é segura para usar no frontend
- ⚠️ **Nunca compartilhe a API Key secreta** (service role key)

## 🧪 Teste a Configuração

1. **Execute o SQL Schema**:
   - Vá para Supabase → SQL Editor
   - Cole o conteúdo de `SUPABASE_SCHEMA.sql`
   - Clique Run

2. **Registre um novo usuário**:
   - Acesse `register.html`
   - Use um email real (pode ser fake@example.com)
   - Escolha uma senha com 6+ caracteres
   - Clique Registrar

3. **Faça login**:
   - Você deve ser redirecionado para `gestor.html`
   - Verifique se o nome da loja aparece no menu

4. **Teste no console** (F12):
   - Execute: `await supabase.auth.getSession()`
   - Você deve ver a sessão do usuário

## 💾 Sincronização com localStorage

Atualmente, a solução usa:
- **localStorage** como cache local (mais rápido, offline-ready)
- **Supabase** como source of truth (dados persistentes)

Isso significa:
- Os dados funcionam offline usando cache
- Quando online, sincronizam com Supabase
- Próximo passo: implementar sincronização real quando voltar online

## 📊 Estrutura de Dados Esperada

Exemplo de como os dados devem ser salvos:

```javascript
// Produto
{
    product_name: "Camiseta",
    details: "Camiseta branca 100% algodão"
}

// Lote de Estoque
{
    product_name: "Camiseta",
    size: "M",
    purchase_location: "Fornecedor XYZ",
    unit_price: 15.00,
    quantity: 50,
    cost_price: 20.00,
    selling_price: 45.00
}

// Cliente
{
    name: "João Silva",
    client_type: "F",  // F = Física, J = Jurídica
    phone: "11999999999",
    address: "Rua X, 123"
}

// Pedido
{
    order_code: "PED001",
    order_date: "2024-05-26",
    product_name: "Camiseta",
    quantity: 2,
    total_value: 90.00,
    payment_method: "credit"  // credit, debit, cash, installment
}
```

## ✉️ Notificações Importantes

1. **Email de Confirmação**: Após registrar, o Supabase enviará um email de confirmação. Você pode desabilitar isso nas configurações do Supabase se quiser.

2. **Dados Persistem**: Todos os dados agora estão salvos no Supabase, não desaparecem ao limpar cache.

3. **Segurança**: Os dados são privados por padrão - cada usuário só vê seus dados.

## 🐛 Troubleshooting

Se encontrar erros durante a integração:

1. **Abra o console** (F12) e veja as mensagens de erro
2. **Verifique se o Supabase está acessível**: 
   ```javascript
   await supabase.from('shops').select('*')
   ```
3. **Verifique a sessão**:
   ```javascript
   const { data } = await supabase.auth.getSession();
   console.log(data);
   ```
4. **Verifique as políticas RLS**: Vá para Supabase → Authentication → Policies

## 📚 Referências

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Ordem recomendada de implementação**:
1. Cadastrar Produtos (cadastrar.js)
2. Estoque (estoque.js)
3. Clientes (clientes.js)
4. Pedidos (pedidos.js)
5. Agenda (agenda.js)
6. Finanças (financas.js)
7. Perfil (perfil.js)
