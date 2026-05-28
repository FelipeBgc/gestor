import { supabase } from './supabase.js';

const currentUserIdKey = 'gestorCurrentUserId';

export function getCurrentUserId() {
    return localStorage.getItem(currentUserIdKey);
}

async function ensureUserId() {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuário não está autenticado ou user_id não está definido.');
    }
    return userId;
}

function normalizeDate(value) {
    if (!value) return null;
    if (value instanceof Date) {
        return value.toISOString().slice(0, 10);
    }
    if (typeof value === 'string') {
        const parts = value.split('/');
        if (parts.length === 3) {
            const [day, month, year] = parts;
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return value;
    }
    return null;
}

export async function createInventoryItem(item) {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        product: item.product || '',
        details: item.details || '',
        purchase_location: item.purchaseLocation || '',
        size: item.size || '',
        quantity: Number(item.quantity) || 0,
        total: Number(item.total) || 0,
        cost_price: Number(item.costPrice) || 0,
        profit_margin: Number(item.profitMargin) || 0,
        selling_price: Number(item.sellingPrice) || 0,
        image: item.image || null,
        created_at: item.created || new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('gestor_inventory').insert([payload]);
    if (error) {
        console.error('Erro ao salvar item de estoque no Supabase:', error);
    }
    return error;
}

export async function getInventoryItems() {
    const user_id = await ensureUserId();
    const { data, error } = await supabase
        .from('gestor_inventory')
        .select('product,details,purchase_location,size,quantity,total,cost_price,profit_margin,selling_price,image,created_at')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar estoque no Supabase:', error);
        return [];
    }

    return (data || []).map(item => ({
        product: item.product,
        details: item.details,
        purchaseLocation: item.purchase_location,
        size: item.size,
        quantity: Number(item.quantity) || 0,
        total: Number(item.total) || 0,
        costPrice: Number(item.cost_price) || 0,
        profitMargin: Number(item.profit_margin) || 0,
        sellingPrice: Number(item.selling_price) || 0,
        image: item.image || null,
        created: item.created_at
    }));
}

export async function createClientRecord(client) {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        name: client.name || '',
        source: client.source || '',
        type: client.type || 'pf',
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        razao: client.razao || '',
        phone: client.phone || '',
        address: client.address || '',
        birthday: normalizeDate(client.birthday),
        notes: client.notes || '',
        created_at: client.created || new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('gestor_clients').insert([payload]);
    if (error) {
        console.error('Erro ao salvar cliente no Supabase:', error);
    }
    return error;
}

export async function upsertOrder(order) {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        code: order.code || '',
        date: normalizeDate(order.date),
        client_name: order.clientName || '',
        product_name: order.productName || '',
        product_size: order.productSize || '',
        batch: order.batch || '',
        batch_inventory_index: order.batchInventoryIndex ?? null,
        quantity: Number(order.quantity) || 0,
        discount: Number(order.discount) || 0,
        freight: Number(order.freight) || 0,
        fees: Number(order.fees) || 0,
        total: Number(order.total) || 0,
        payment_condition: order.paymentCondition || '',
        signal_amount: Number(order.signalAmount) || 0,
        signal_date: normalizeDate(order.signalDate),
        installments_qty: Number(order.installmentsQty) || null,
        installment_value: Number(order.installmentValue) || null,
        paid: Boolean(order.paid),
        notes: order.notes || '',
        created_at: order.created || new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
        .from('gestor_orders')
        .upsert([payload], { onConflict: 'code' });

    if (error) {
        console.error('Erro ao salvar pedido no Supabase:', error);
    }
    return error;
}

export async function recordInvestment(amount, description = '') {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        amount: Number(amount) || 0,
        description: description || 'Investimento registrado automaticamente',
        date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('gestor_investments').insert([payload]);
    if (error) {
        console.error('Erro ao salvar investimento no Supabase:', error);
    }
    return error;
}

export async function createAgendaEventRow(date, note, created = null) {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        event_date: normalizeDate(date),
        note: note || '',
        created_at: created || new Date().toISOString(),
    };

    const { error } = await supabase.from('gestor_agenda').insert([payload]);
    if (error) {
        console.error('Erro ao salvar evento na agenda no Supabase:', error);
    }
    return error;
}

export async function deleteAgendaEventRow(date, createdAt) {
    const user_id = await ensureUserId();
    const payload = {
        user_id,
        event_date: normalizeDate(date),
        created_at: createdAt,
    };

    const { error } = await supabase.from('gestor_agenda').delete().match(payload);
    if (error) {
        console.error('Erro ao excluir evento de agenda no Supabase:', error);
    }
    return error;
}

export async function updateInventoryItem(createdAt, updates = {}) {
    const user_id = await ensureUserId();
    const payload = {};
    if (updates.hasOwnProperty('quantity')) payload.quantity = Number(updates.quantity) || 0;
    if (updates.hasOwnProperty('total')) payload.total = Number(updates.total) || 0;
    if (updates.hasOwnProperty('costPrice')) payload.cost_price = Number(updates.costPrice) || 0;
    if (updates.hasOwnProperty('profitMargin')) payload.profit_margin = Number(updates.profitMargin) || 0;
    if (updates.hasOwnProperty('sellingPrice')) payload.selling_price = Number(updates.sellingPrice) || 0;
    if (updates.hasOwnProperty('image')) payload.image = updates.image || null;
    if (Object.keys(payload).length === 0) return null;
    payload.updated_at = new Date().toISOString();

    try {
        const { error } = await supabase
            .from('gestor_inventory')
            .update(payload)
            .match({ user_id, created_at: createdAt });

        if (error) {
            console.error('Erro ao atualizar item de estoque no Supabase:', error);
        }
        return error;
    } catch (e) {
        console.error('Exceção ao atualizar item de estoque no Supabase:', e);
        return e;
    }
}

export async function deleteInventoryItemRow(createdAt) {
    const user_id = await ensureUserId();
    try {
        const { error } = await supabase
            .from('gestor_inventory')
            .delete()
            .match({ user_id, created_at: createdAt });

        if (error) {
            console.error('Erro ao excluir item de estoque no Supabase:', error);
        }
        return error;
    } catch (e) {
        console.error('Exceção ao excluir item de estoque no Supabase:', e);
        return e;
    }
}

export async function updateInventoryItemImage(createdAt, image) {
    const user_id = await ensureUserId();
    try {
        const { error } = await supabase
            .from('gestor_inventory')
            .update({ image: image || null, updated_at: new Date().toISOString() })
            .match({ user_id, created_at: createdAt });

        if (error) {
            console.error('Erro ao atualizar imagem do item no Supabase:', error);
        }
        return error;
    } catch (e) {
        console.error('Exceção ao atualizar imagem do item no Supabase:', e);
        return e;
    }
}
