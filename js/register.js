const usersKey = 'gestorUsers';
const authKey = 'gestorLoggedIn';
const currentUserKey = 'gestorCurrentUser';
const currentShopKey = 'gestorCurrentShop';

const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('new-username');
const shopNameInput = document.getElementById('shop-name');
const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerMessage = document.getElementById('register-message');

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(usersKey) || '[]');
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

if (localStorage.getItem(authKey) === 'true') {
    window.location.replace('gestor.html');
}

registerForm?.addEventListener('submit', event => {
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

    const users = getUsers();
    const exists = users.some(user => user.username.toLowerCase() === username.toLowerCase());

    if (exists) {
        showError('Usuário já existe. Escolha outro nome.');
        return;
    }

    users.push({ username, password, shopName });
    saveUsers(users);
    localStorage.setItem(authKey, 'true');
    localStorage.setItem(currentUserKey, username);
    localStorage.setItem(currentShopKey, shopName);
    window.location.replace('gestor.html');
});

function showError(message) {
    if (!registerMessage) return;
    registerMessage.textContent = message;
    registerMessage.style.display = 'block';
}