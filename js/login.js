const authKey = 'gestorLoggedIn';
const usersKey = 'gestorUsers';
const currentUserKey = 'gestorCurrentUser';
const currentShopKey = 'gestorCurrentShop';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');

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

loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value;

    const users = getUsers();
    const validUser = users.find(user => user.username.toLowerCase() === username?.toLowerCase() && user.password === password);

    if (validUser) {
        localStorage.setItem(authKey, 'true');
        localStorage.setItem(currentUserKey, validUser.username);
        localStorage.setItem(currentShopKey, validUser.shopName || 'Minha Loja');
        window.location.replace('gestor.html');
        return;
    }

    if (loginMessage) {
        loginMessage.textContent = 'Usuário ou senha incorretos.';
        loginMessage.style.display = 'block';
    }
});
