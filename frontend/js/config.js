// Configuração global da aplicação
window.CONFIG = {
    // Será substituído por processo de build
    API_URL: process.env.API_URL || 'http://localhost:5000/api',
    APP_NAME: 'Gestor de Loja',
    VERSION: '1.0.0'
};

// Verificar autenticação
function checkAuth() {
    const token = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const loginPage = 'login.html';
    const registerPage = 'register.html';

    if ((currentPage !== loginPage && currentPage !== registerPage && currentPage !== '') && !token) {
        window.location.replace('login.html');
    }

    if ((currentPage === loginPage || currentPage === registerPage) && token) {
        window.location.replace('gestor.html');
    }
}

// Executar ao carregar página
document.addEventListener('DOMContentLoaded', checkAuth);
