import { getUserByUsername, hashPassword } from './supabase.js';

const authKey = 'gestorLoggedIn';
const currentUserKey = 'gestorCurrentUser';
const currentUserIdKey = 'gestorCurrentUserId';
const currentShopKey = 'gestorCurrentShop';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');

if (localStorage.getItem(authKey) === 'true') {
    window.location.replace('gestor.html');
}

loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value;

    if (!username || !password) {
        if (loginMessage) {
            loginMessage.textContent = 'Preencha usuário e senha.';
            loginMessage.style.display = 'block';
        }
        return;
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const passwordHash = await hashPassword(password);
        if (user.password_hash !== passwordHash) {
            throw new Error('Senha incorreta');
        }

        localStorage.setItem(authKey, 'true');
        localStorage.setItem(currentUserKey, user.username);
        localStorage.setItem(currentUserIdKey, user.id);
        localStorage.setItem(currentShopKey, user.shop_name || 'Minha Loja');
        window.location.replace('gestor.html');
    } catch (error) {
        if (loginMessage) {
            loginMessage.textContent = 'Usuário ou senha incorretos.';
            loginMessage.style.display = 'block';
        }
        console.error('Login error:', error);
    }
});
