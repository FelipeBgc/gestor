import { supabase } from './supabase-config.js';
import { initializeShopData } from './supabase-sync.js';
import { updateShopNameInPage } from './display-shop-name.js';

const profileForm = document.getElementById('profile-form');
const usernameInput = document.getElementById('profile-username');
const shopNameInput = document.getElementById('profile-shop-name');
const emailInput = document.getElementById('profile-email');
const phoneInput = document.getElementById('profile-phone');
const profileMessage = document.getElementById('profile-message');

function showMessage(message, isError = false) {
    if (!profileMessage) return;
    profileMessage.textContent = message;
    profileMessage.className = `message ${isError ? 'error' : 'success'}`;
}

async function loadProfile() {
    try {
        const userResp = await supabase.auth.getUser();
        const user = userResp?.data?.user;
        const shop = await initializeShopData();

        if (usernameInput) usernameInput.value = user?.user_metadata?.username || (user?.email || '').split('@')[0];
        if (shopNameInput) shopNameInput.value = shop?.shop_name || '';
        if (emailInput) emailInput.value = user?.email || '';
        if (phoneInput) phoneInput.value = user?.user_metadata?.phone || '';
    } catch (err) {
        console.error('Erro ao carregar perfil:', err);
    }
}

profileForm?.addEventListener('submit', async event => {
    event.preventDefault();
    try {
        const newUsername = usernameInput.value.trim();
        const shopName = shopNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!newUsername || !shopName) {
            showMessage('Preencha o nome do usuário e o nome da loja.', true);
            return;
        }

        // Atualizar nome da loja
        const shop = await initializeShopData();
        if (shop) {
            const { error: shopError } = await supabase
                .from('shops')
                .update({ shop_name: shopName })
                .eq('id', shop.id);
            if (shopError) throw shopError;
        }

        // Atualizar metadata do usuário (username e phone)
        const { data: userData, error: userError } = await supabase.auth.updateUser({ data: { username: newUsername, phone } });
        if (userError) throw userError;

        showMessage('Perfil salvo com sucesso.');
        // atualizar badge/nome na UI imediatamente
        updateShopNameInPage(shopName);
    } catch (err) {
        console.error('Erro ao salvar perfil:', err);
        showMessage('Erro ao salvar perfil.', true);
    }
});

window.addEventListener('DOMContentLoaded', loadProfile);
