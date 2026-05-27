// Script para mostrar o nome da loja em todas as páginas
import { supabase } from './supabase-config.js';

export async function displayShopNameInHeader() {
    try {
        // Obter sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            console.log('Sem sessão ativa');
            return;
        }

        // Buscar dados do usuário do Supabase
        const { data, error } = await supabase
            .from('shops')
            .select('shop_name')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            console.error('Erro ao buscar nome da loja:', error);
            return;
        }

        // Atualizar TODOS os elementos com id="shop-name" e o badge flutuante
        updateShopNameInPage(data?.shop_name || '');
    } catch (err) {
        console.error('Erro ao exibir nome da loja:', err);
    }
}

// Chamar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', displayShopNameInHeader);

export function updateShopNameInPage(shopName) {
    try {
        if (!shopName) return;
        // remover badge fixo se existir (compatibilidade caso tenha sido criado antes)
        const existingBadge = document.getElementById('shop-name-badge');
        if (existingBadge && existingBadge.parentNode) existingBadge.parentNode.removeChild(existingBadge);

        // atualizar elementos inline com id=shop-name
        const shopNameElements = document.querySelectorAll('#shop-name');
        shopNameElements.forEach(el => {
            el.textContent = shopName;
            el.classList.remove('shop-name-highlight');
            // forçar reflow e aplicar destaque
            void el.offsetWidth;
            el.classList.add('shop-name-highlight');
        });
    } catch (err) {
        console.error('Erro ao atualizar nome da loja na página:', err);
    }
}
