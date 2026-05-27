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
                // Não gravar em localStorage por decisão de centralizar no Supabase
            return shop;
        }
    } catch (error) {
        console.error('Erro ao inicializar dados da loja:', error);
    }
    return null;
}

export function getCurrentShopId() {
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

// Fetch all product images for the current shop
export async function getAllProductImagesFromDB() {
    const shopId = getCurrentShopId();
    if (!shopId) return [];

    const { data, error } = await supabase
        .from('product_images')
        .select('product_name, size, image_data')
        .eq('shop_id', shopId);

    if (error) {
        console.error('Erro ao buscar todas as imagens:', error);
        return [];
    }
    return data || [];
}

// Replace all inventory_lots for the current shop with the provided array
export async function replaceInventoryForShop(inventoryArray) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    // Delete existing lots for the shop
    const { error: delError } = await supabase
        .from('inventory_lots')
        .delete()
        .eq('shop_id', shopId);

    if (delError) {
        console.error('Erro ao deletar lotes antigos:', delError);
        return false;
    }

    if (!inventoryArray || inventoryArray.length === 0) return true;

    const rows = inventoryArray.map(item => ({
        product_name: item.product,
        details: item.details,
        purchase_location: item.purchaseLocation || item.purchase_location || '',
        size: item.size,
        unit_price: item.unitPrice || item.unit_price || null,
        quantity: item.quantity,
        total_value: item.total,
        cost_price: item.costPrice || item.cost_price || null,
        profit_margin: item.profitMargin || item.profit_margin || null,
        selling_price: item.sellingPrice || item.selling_price || null
    }));

    const { data, error } = await supabase
        .from('inventory_lots')
        .insert(rows)
        .select();

    if (error) {
        console.error('Erro ao inserir novos lotes:', error);
        return false;
    }
    return true;
}

// Replace all product images for the current shop
export async function replaceProductImagesForShop(imagesObj) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    const { error: delError } = await supabase
        .from('product_images')
        .delete()
        .eq('shop_id', shopId);

    if (delError) {
        console.error('Erro ao deletar imagens antigas:', delError);
        return false;
    }

    const rows = Object.keys(imagesObj || {}).map(key => {
        const [product_name, size] = key.split('||');
        return {
            product_name: product_name || '',
            size: size || '',
            image_data: imagesObj[key]
        };
    });

    if (rows.length === 0) return true;

    const { data, error } = await supabase
        .from('product_images')
        .insert(rows)
        .select();

    if (error) {
        console.error('Erro ao inserir imagens:', error);
        return false;
    }
    return true;
}

// Replace all clients for the current shop
export async function replaceClientsForShop(clientsArray) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    const { error: delError } = await supabase
        .from('clients')
        .delete()
        .eq('shop_id', shopId);

    if (delError) {
        console.error('Erro ao deletar clientes antigos:', delError);
        return false;
    }

    if (!clientsArray || clientsArray.length === 0) return true;

    const rows = clientsArray.map(c => ({
        name: c.name,
        source: c.source || null,
        client_type: c.type || null,
        cpf: c.cpf || null,
        cnpj: c.cnpj || null,
        razao_social: c.razao || null,
        phone: c.phone || null,
        address: c.address || null,
        birthday: c.birthday || null,
        notes: c.notes || null
    }));

    const { data, error } = await supabase
        .from('clients')
        .insert(rows)
        .select();

    if (error) {
        console.error('Erro ao inserir clientes:', error);
        return false;
    }
    return true;
}

// Replace all orders for the current shop
export async function replaceOrdersForShop(ordersArray) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    const { error: delError } = await supabase
        .from('orders')
        .delete()
        .eq('shop_id', shopId);

    if (delError) {
        console.error('Erro ao deletar pedidos antigos:', delError);
        return false;
    }

    if (!ordersArray || ordersArray.length === 0) return true;

    const rows = ordersArray.map(o => ({
        order_code: o.order_code || o.orderCode || null,
        client_id: o.client_id || o.clientId || null,
        order_date: o.order_date || o.orderDate || null,
        product_name: o.product_name || o.productName || null,
        batch_id: o.batch_id || o.batchId || null,
        quantity: o.quantity || null,
        discount: o.discount || 0,
        freight: o.freight || 0,
        fees: o.fees || 0,
        total_value: o.total_value || o.totalValue || null,
        payment_method: o.payment_method || o.paymentMethod || null,
        payment_status: o.payment_status || o.paymentStatus || 'pending',
        signal_amount: o.signal_amount || o.signalAmount || null,
        signal_date: o.signal_date || o.signalDate || null,
        installments_qty: o.installments_qty || o.installmentsQty || null,
        installment_value: o.installment_value || o.installmentValue || null,
        notes: o.notes || null,
        is_paid: o.is_paid || o.isPaid || false
    }));

    const { data, error } = await supabase
        .from('orders')
        .insert(rows)
        .select();

    if (error) {
        console.error('Erro ao inserir pedidos:', error);
        return false;
    }
    return true;
}

// Replace all schedule_events for the current shop
export async function replaceScheduleEventsForShop(eventsArray) {
    const shopId = getCurrentShopId();
    if (!shopId) return false;

    const { error: delError } = await supabase
        .from('schedule_events')
        .delete()
        .eq('shop_id', shopId);

    if (delError) {
        console.error('Erro ao deletar eventos antigos:', delError);
        return false;
    }

    if (!eventsArray || eventsArray.length === 0) return true;

    const rows = eventsArray.map(ev => ({
        event_date: ev.date,
        notes: ev.notes || null
    }));

    const { data, error } = await supabase
        .from('schedule_events')
        .insert(rows)
        .select();

    if (error) {
        console.error('Erro ao inserir eventos:', error);
        return false;
    }
    return true;
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
