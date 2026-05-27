import "./script.js";

const usersKey = 'gestorUsers';
const currentUserKey = 'gestorCurrentUser';
const currentShopKey = 'gestorCurrentShop';

const profileForm = document.getElementById('profile-form');
const usernameInput = document.getElementById('profile-username');
const shopNameInput = document.getElementById('profile-shop-name');
const emailInput = document.getElementById('profile-email');
const phoneInput = document.getElementById('profile-phone');
const profileMessage = document.getElementById('profile-message');

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

function getCurrentUser() {
    return localStorage.getItem(currentUserKey);
}

function loadProfile() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === currentUser.toLowerCase());
    if (!user) {
        return;
    }

    usernameInput.value = user.username || '';
    shopNameInput.value = user.shopName || '';
    emailInput.value = user.email || '';
    phoneInput.value = user.phone || '';
}

function showMessage(message, isError = false) {
    if (!profileMessage) return;
    profileMessage.textContent = message;
    profileMessage.className = `message ${isError ? 'error' : 'success'}`;
}

profileForm?.addEventListener('submit', event => {
    event.preventDefault();
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showMessage('Erro ao carregar o perfil.', true);
        return;
    }

    const newUsername = usernameInput.value.trim();
    const shopName = shopNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!newUsername || !shopName) {
        showMessage('Preencha o nome do usuário e o nome da loja.', true);
        return;
    }

    const users = getUsers();
    const currentUserIndex = users.findIndex(u => u.username.toLowerCase() === currentUser.toLowerCase());
    if (currentUserIndex === -1) {
        showMessage('Usuário não encontrado.', true);
        return;
    }

    const usernameConflict = users.some((u, index) => index !== currentUserIndex && u.username.toLowerCase() === newUsername.toLowerCase());
    if (usernameConflict) {
        showMessage('Este nome de usuário já está em uso.', true);
        return;
    }

    const user = users[currentUserIndex];
    user.username = newUsername;
    user.shopName = shopName;
    user.email = email;
    user.phone = phone;

    saveUsers(users);
    localStorage.setItem(currentUserKey, newUsername);
    localStorage.setItem(currentShopKey, shopName);
    showMessage('Perfil salvo com sucesso.');
    passwordInput.value = '';
    confirmPasswordInput.value = '';
});

window.addEventListener('DOMContentLoaded', loadProfile);