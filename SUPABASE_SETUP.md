# 🔧 Guia de Configuração do Supabase para o Gestor

## Pré-requisitos
- Conta no Supabase (https://supabase.com)
- Seus dados: URL e API Key (que você já forneceu)

## Passo 1: Criar as Tabelas no Supabase

1. **Acesse seu projeto** no Supabase Dashboard
2. Vá para **SQL Editor**
3. Clique em **New Query**
4. Copie todo o conteúdo do arquivo `SUPABASE_SCHEMA.sql` deste projeto
5. Cole no editor SQL do Supabase
6. Clique em **Run** para executar todos os comandos

## Passo 2: Verificar a Configuração

Após executar o SQL:
- Vá para **Table Editor**
- Você deve ver estas tabelas:
  - `shops`
  - `products`
  - `product_images`
  - `inventory_lots`
  - `clients`
  - `orders`
  - `schedule_events`
  - `investments`

## Passo 3: Configurar Row Level Security (RLS)

O SQL já configura o RLS automaticamente. Para verificar:
1. Vá para **Authentication > Policies**
2. Você deve ver as políticas para cada tabela
3. Isso garante que cada usuário só veja seus próprios dados

## Passo 4: Testar Credenciais

As credenciais já estão configuradas em `js/supabase-config.js`:
- **URL**: `https://wkvsmrpkckuehwhucsav.supabase.co`
- **API Key**: `sb_publishable_B4xjD5s6MpLrvoxrJQbgsQ_faDkL7e6`

⚠️ **Importante**: A API Key pública (anon) é segura usar no frontend. Para operações sensíveis do servidor, use a API Key secreta (que você nunca deve compartilhar).

## Passo 5: Arquitetura de Dados

### Fluxo de Funcionamento

```
Usuário → Login/Register → Supabase Auth
                              ↓
                        Cria/Recupera usuário
                              ↓
                        Cria perfil da loja (shops)
                              ↓
                        Acessa dados da loja
```

### Estrutura de Dados

- **shops**: Perfil da loja (user_id, shop_name)
- **products**: Produtos cadastrados
- **product_images**: Imagens dos produtos (armazenadas como Base64)
- **inventory_lots**: Lotes de estoque
- **clients**: Clientes cadastrados
- **orders**: Pedidos realizados
- **schedule_events**: Eventos na agenda
- **investments**: Registros de investimentos/finanças

### Relações Importantes

- Cada loja (shop) tem um proprietário (user)
- Cada produto pertence a uma loja
- Cada lote de estoque pertence a uma loja
- Cada cliente pertence a uma loja
- Etc...

## Passo 6: Sincronização de Dados

### Como Funciona a Sincronização

1. **Na primeira vez que o usuário faz login**:
   - `login.js` autentica com Supabase
   - `gestor.js` chama `initializeShopData()` do `supabase-sync.js`
   - Os dados são carregados do Supabase e também salvos no localStorage (cache)

2. **Durante o uso**:
   - Quando o usuário cadastra um produto, o `cadastrar.js` chama funções do `supabase-sync.js`
   - Os dados são salvos no Supabase E no localStorage
   - O localStorage funciona como cache local para melhor performance

3. **Dados em Tempo Real**:
   - Para implementar atualizações em tempo real, você pode adicionar listeners do Supabase
   - Veja a seção "Próximos Passos" abaixo

## Passo 7: Migrar Dados Antigos (Opcional)

Se você tinha dados armazenados localmente (localStorage), você pode migrá-los:

1. Cada página (cadastrar.js, estoque.js, etc.) pode ter uma função de migração
2. Na primeira inicialização, se houver dados no localStorage, migre para Supabase
3. Depois, limpe o localStorage

Exemplo:
```javascript
// No cadastrar.js
async function migrateOldProducts() {
    const oldProducts = getProductsFromLocalStorage(); // localStorage
    for (const product of oldProducts) {
        await saveProductToDB(product); // Supabase
    }
    clearProductsFromLocalStorage();
}
```

## Próximos Passos

### 1. Integrar Supabase em Todas as Páginas

Cada arquivo JavaScript (cadastrar.js, estoque.js, etc.) precisa:
- Importar `supabase-sync.js`
- Usar as funções de sincronização em vez de localStorage
- Exemplo:
  ```javascript
  import { 
    getInventoryFromDB, 
    addInventoryLotToDB,
    updateInventoryLotInDB,
    deleteInventoryLotFromDB
  } from './supabase-sync.js';
  ```

### 2. Implementar Realtime (Opcional)

Para atualizações em tempo real entre abas/dispositivos:
```javascript
supabase
  .from('inventory_lots')
  .on('*', payload => {
    console.log('Estoque atualizado:', payload);
    renderInventory(); // Atualizar UI
  })
  .subscribe();
```

### 3. Backup de Dados

- Você pode fazer backup dos dados diretamente do Supabase Dashboard
- Vá para **Backups** na sidebar

### 4. Melhorias de Segurança

- Confirme que o RLS está funcionando (cada usuário só vê seus dados)
- Para testar: acesse com usuários diferentes e verifique o isolamento
- Configure 2FA (autenticação de dois fatores) se necessário

## Troubleshooting

### Erro: "Connection refused"
- Verifique se a URL do Supabase está correta
- Verifique se sua conexão de internet está funcionando

### Erro: "Permission denied"
- Verifique se as políticas RLS estão configuradas
- Execute novamente o `SUPABASE_SCHEMA.sql`
- Verifique se o usuário está autenticado

### Erro: "User already exists"
- Se receber este erro ao registrar, o email já existe
- Tente usar outro email ou faça login se já tem conta

### Dados não sincronizam
- Verifique se `getCurrentShopId()` retorna um valor válido
- Abra o console (F12) para ver erros específicos
- Verifique se as tabelas foram criadas

## Variáveis de Ambiente (Recomendado)

Para manter seus dados sensíveis mais seguros, você pode usar variáveis de ambiente:

1. Crie um arquivo `.env.local` na raiz do projeto (não commite no Git):
```
VITE_SUPABASE_URL=https://wkvsmrpkckuehwhucsav.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_B4xjD5s6MpLrvoxrJQbgsQ_faDkL7e6
```

2. No `supabase-config.js`:
```javascript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wkvsmrpkckuehwhucsav.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_B4xjD5s6MpLrvoxrJQbgsQ_faDkL7e6';
```

## Suporte

- Documentação Supabase: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- Comunidade: https://github.com/supabase/supabase/discussions

---

**Próximo passo**: Após configurar o Supabase, você precisa integrar as funções do `supabase-sync.js` em cada página do projeto. Comece por `cadastrar.js`, depois `estoque.js`, `clientes.js`, etc.
