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

        // Atualizar TODOS os elementos com id="shop-name"
        const shopNameElements = document.querySelectorAll('#shop-name');
        if (shopNameElements.length > 0 && data?.shop_name) {
            shopNameElements.forEach(el => {
                el.textContent = data.shop_name;
            });
            console.log('Nome da loja atualizado:', data.shop_name);
        }
    } catch (err) {
        console.error('Erro ao exibir nome da loja:', err);
    }
}

// Chamar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', displayShopNameInHeader);
