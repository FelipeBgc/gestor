import { createUser, getUserByUsername, hashPassword } from './supabase.js';

const authKey = 'gestorLoggedIn';
const currentUserKey = 'gestorCurrentUser';
const currentUserIdKey = 'gestorCurrentUserId';
const currentShopKey = 'gestorCurrentShop';

const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('new-username');
const shopNameInput = document.getElementById('shop-name');
const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerMessage = document.getElementById('register-message');

if (localStorage.getItem(authKey) === 'true') {
    window.location.replace('gestor.html');
}

registerForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const username = usernameInput?.value.trim();
    const shopName = shopNameInput?.value.trim();
    const password = passwordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    if (!username || !shopName || !password || !confirmPassword) {
        showError('Preencha todos os campos.');
        return;
    }

    if (password !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }

    try {
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            showError('Usuário já existe. Escolha outro nome.');
            return;
        }

        const passwordHash = await hashPassword(password);
        const user = await createUser({
            username,
            shop_name: shopName,
            password_hash: passwordHash
        });

        localStorage.setItem(authKey, 'true');
        localStorage.setItem(currentUserKey, username);
        localStorage.setItem(currentUserIdKey, user?.id || '');
        localStorage.setItem(currentShopKey, shopName);
        window.location.replace('gestor.html');
    } catch (error) {
        showError('Erro ao registrar. Tente novamente.');
        console.error('Registration error:', error);
    }
});

function showError(message) {
    if (!registerMessage) return;
    registerMessage.textContent = message;
    registerMessage.style.display = 'block';
}
