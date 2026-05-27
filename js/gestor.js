import "./script.js";
import { supabase } from './supabase-config.js';
import { initializeShopData } from './supabase-sync.js';

// Verificar autenticação e inicializar dados
async function initializeApp() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            // Não está autenticado, redirecionar para login
            window.location.replace('login.html');
            return;
        }

        // Inicializar dados da loja
        const shop = await initializeShopData();
        if (shop) {
            // Dados carregados com sucesso
            console.log('Loja inicializada:', shop.shop_name);
            
            // Atualizar nome da loja na UI
            const shopNameEl = document.getElementById('shop-name');
            if (shopNameEl) {
                shopNameEl.textContent = shop.shop_name;
            }
        }
    } catch (error) {
        console.error('Erro ao inicializar app:', error);
    }
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', initializeApp);

// Listener para logout
const logoutBtn = document.getElementById('logout-button');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await supabase.auth.signOut();
            // Limpar localStorage
            localStorage.removeItem('gestorCurrentUser');
            localStorage.removeItem('gestorCurrentShop');
            localStorage.removeItem('gestorCurrentShopId');
            window.location.replace('login.html');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    });
}
