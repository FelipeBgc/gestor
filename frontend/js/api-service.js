// API Service - Gerencia todas as requisições para a API
class ApiService {
    constructor(baseURL = 'http://localhost:5000/api') {
        this.baseURL = baseURL;
        this.token = this.getToken();
    }

    getToken() {
        return localStorage.getItem('authToken');
    }

    setToken(token) {
        localStorage.setItem('authToken', token);
        this.token = token;
    }

    removeToken() {
        localStorage.removeItem('authToken');
        this.token = null;
    }

    getAuthHeader() {
        return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }

    async request(method, endpoint, body = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...this.getAuthHeader()
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (response.status === 401) {
                this.removeToken();
                window.location.href = '/login.html';
                throw new Error('Sessão expirada');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Erro: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Erro na requisição ${method} ${endpoint}:`, error);
            throw error;
        }
    }

    // AUTH
    async login(username, password) {
        const data = await this.request('POST', '/auth/login', { username, password });
        this.setToken(data.token);
        localStorage.setItem('currentUser', data.user.username);
        localStorage.setItem('shopName', data.user.shopName);
        return data;
    }

    async register(username, password, shopName) {
        const data = await this.request('POST', '/auth/register', { username, password, shopName });
        this.setToken(data.token);
        localStorage.setItem('currentUser', data.user.username);
        localStorage.setItem('shopName', data.user.shopName);
        return data;
    }

    // PRODUCTS
    async getProducts() {
        return this.request('GET', '/products');
    }

    async createProduct(product) {
        return this.request('POST', '/products', product);
    }

    async updateProduct(id, product) {
        return this.request('PUT', `/products/${id}`, product);
    }

    async deleteProduct(id) {
        return this.request('DELETE', `/products/${id}`);
    }

    // CLIENTS
    async getClients() {
        return this.request('GET', '/clients');
    }

    async createClient(client) {
        return this.request('POST', '/clients', client);
    }

    async updateClient(id, client) {
        return this.request('PUT', `/clients/${id}`, client);
    }

    async deleteClient(id) {
        return this.request('DELETE', `/clients/${id}`);
    }

    // ORDERS
    async getOrders() {
        return this.request('GET', '/orders');
    }

    async createOrder(order) {
        return this.request('POST', '/orders', order);
    }

    async updateOrder(id, order) {
        return this.request('PUT', `/orders/${id}`, order);
    }

    async deleteOrder(id) {
        return this.request('DELETE', `/orders/${id}`);
    }

    // AGENDA
    async getAgendaEvents() {
        return this.request('GET', '/agenda');
    }

    async createAgendaEvent(event) {
        return this.request('POST', '/agenda', event);
    }

    async updateAgendaEvent(id, event) {
        return this.request('PUT', `/agenda/${id}`, event);
    }

    async deleteAgendaEvent(id) {
        return this.request('DELETE', `/agenda/${id}`);
    }

    // FINANCES
    async getFinances() {
        return this.request('GET', '/finances');
    }

    async getFinancesSummary(month) {
        return this.request('GET', `/finances/summary/${month}`);
    }

    async createFinanceMovement(movement) {
        return this.request('POST', '/finances', movement);
    }

    isLoggedIn() {
        return !!this.token;
    }

    logout() {
        this.removeToken();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('shopName');
        window.location.href = '/login.html';
    }
}

// Exportar como singleton
window.API = new ApiService(process.env.API_URL || 'http://localhost:5000/api');
