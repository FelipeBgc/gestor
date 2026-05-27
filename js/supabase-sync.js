// Funções para sincronizar dados entre localStorage e Supabase
import { supabase } from './supabase-config.js';

let currentShopId = null;

export async function initializeShopData() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: shop } = await supabase
            .from('shops')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (shop) {
            currentShopId = shop.id;
            localStorage.setItem('gestorCurrentUser', user.email);
            localStorage.setItem('gestorCurrentShop', shop.shop_name);
            localStorage.setItem('gestorCurrentShopId', shop.id);
            return shop;
        }
    } catch (error) {
        console.error('Erro ao inicializar dados da loja:', error);
    }
    return null;
}

export function getCurrentShopId() {
    if (!currentShopId) {
        currentShopId = localStorage.getItem('gestorCurrentShopId');
    }
    return currentShopId;
}

// PRODUTOS
export async function getProductsFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar produtos:', error);
        return [];
    }
    return data || [];
}

export async function saveProductToDB(product) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('products')
        .insert([{ ...product, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar produto:', error);
        return null;
    }
    return data?.[0];
}

// ESTOQUE/LOTES
export async function getInventoryFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('inventory_lots')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar estoque:', error);
        return [];
    }
    return data || [];
}

export async function addInventoryLotToDB(lot) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('inventory_lots')
        .insert([{ ...lot, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao adicionar lote:', error);
        return null;
    }
    return data?.[0];
}

export async function updateInventoryLotInDB(lotId, updates) {
    const { data, error } = await supabase
        .from('inventory_lots')
        .update(updates)
        .eq('id', lotId)
        .select();

    if (error) {
        console.error('Erro ao atualizar lote:', error);
        return null;
    }
    return data?.[0];
}

export async function deleteInventoryLotFromDB(lotId) {
    const { error } = await supabase
        .from('inventory_lots')
        .delete()
        .eq('id', lotId);

    if (error) {
        console.error('Erro ao deletar lote:', error);
        return false;
    }
    return true;
}

// CLIENTES
export async function getClientsFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar clientes:', error);
        return [];
    }
    return data || [];
}

export async function saveClientToDB(client) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('clients')
        .insert([{ ...client, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar cliente:', error);
        return null;
    }
    return data?.[0];
}

export async function updateClientInDB(clientId, updates) {
    const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', clientId)
        .select();

    if (error) {
        console.error('Erro ao atualizar cliente:', error);
        return null;
    }
    return data?.[0];
}

export async function deleteClientFromDB(clientId) {
    const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

    if (error) {
        console.error('Erro ao deletar cliente:', error);
        return false;
    }
    return true;
}

// PEDIDOS
export async function getOrdersFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('shop_id', shopId)
        .order('order_date', { ascending: false });

    if (error) {
        console.error('Erro ao buscar pedidos:', error);
        return [];
    }
    return data || [];
}

export async function saveOrderToDB(order) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar pedido:', error);
        return null;
    }
    return data?.[0];
}

export async function updateOrderInDB(orderId, updates) {
    const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select();

    if (error) {
        console.error('Erro ao atualizar pedido:', error);
        return null;
    }
    return data?.[0];
}

export async function deleteOrderFromDB(orderId) {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

    if (error) {
        console.error('Erro ao deletar pedido:', error);
        return false;
    }
    return true;
}

// IMAGENS DE PRODUTOS
export async function saveProductImageToDB(image) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('product_images')
        .insert([{ ...image, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar imagem:', error);
        return null;
    }
    return data?.[0];
}

export async function getProductImageFromDB(productName, size) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('product_images')
        .select('image_data')
        .eq('shop_id', shopId)
        .eq('product_name', productName)
        .eq('size', size)
        .single();

    if (error) {
        console.error('Erro ao buscar imagem:', error);
        return null;
    }
    return data?.image_data;
}

export async function deleteProductImageFromDB(productName, size) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('shop_id', shopId)
        .eq('product_name', productName)
        .eq('size', size);

    if (error) {
        console.error('Erro ao deletar imagem:', error);
        return false;
    }
    return true;
}

// AGENDA
export async function getScheduleEventsFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('schedule_events')
        .select('*')
        .eq('shop_id', shopId)
        .order('event_date', { ascending: true });

    if (error) {
        console.error('Erro ao buscar eventos:', error);
        return [];
    }
    return data || [];
}

export async function saveScheduleEventToDB(event) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('schedule_events')
        .insert([{ ...event, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar evento:', error);
        return null;
    }
    return data?.[0];
}

export async function updateScheduleEventInDB(eventId, updates) {
    const { data, error } = await supabase
        .from('schedule_events')
        .update(updates)
        .eq('id', eventId)
        .select();

    if (error) {
        console.error('Erro ao atualizar evento:', error);
        return null;
    }
    return data?.[0];
}

export async function deleteScheduleEventFromDB(eventId) {
    const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', eventId);

    if (error) {
        console.error('Erro ao deletar evento:', error);
        return false;
    }
    return true;
}

// INVESTIMENTOS/FINANÇAS
export async function getInvestmentsFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('shop_id', shopId)
        .order('date', { ascending: false });

    if (error) {
        console.error('Erro ao buscar investimentos:', error);
        return [];
    }
    return data || [];
}

export async function saveInvestmentToDB(investment) {
    const shopId = getCurrentShopId();
    if (!shopId) return null;

    const { data, error } = await supabase
        .from('investments')
        .insert([{ ...investment, shop_id: shopId }])
        .select();

    if (error) {
        console.error('Erro ao salvar investimento:', error);
        return null;
    }
    return data?.[0];
}
