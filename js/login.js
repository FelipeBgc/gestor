import { supabase, getShopProfile } from './supabase-config.js';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');
const authKey = 'gestorLoggedIn';
const currentUserKey = 'gestorCurrentUser';
const currentShopKey = 'gestorCurrentShop';

// Verificar se usuário já está autenticado
async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.replace('gestor.html');
    }
}

checkAuthStatus();

// Listener para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
    if (session && event === 'SIGNED_IN') {
        window.location.replace('gestor.html');
    }
});

loginForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = usernameInput?.value.trim();
    const password = passwordInput?.value;

    if (!email || !password) {
        if (loginMessage) {
            loginMessage.textContent = 'Por favor, preencha email e senha.';
            loginMessage.style.display = 'block';
        }
        return;
    }

    // Mostrar carregamento
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Entrando...';
    submitBtn.disabled = true;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (loginMessage) {
                loginMessage.textContent = error.message || 'Falha ao fazer login. Verifique suas credenciais.';
                loginMessage.style.display = 'block';
            }
        } else if (data.session) {
            const user = data.user ?? data.session.user;
            if (user) {
                localStorage.setItem(currentUserKey, user.email || email);
                localStorage.setItem(authKey, 'true');
                try {
                    const { data: shop, error: shopError } = await getShopProfile(user.id);
                    if (shop && shop.shop_name) {
                        localStorage.setItem(currentShopKey, shop.shop_name);
                    }
                } catch (shopError) {
                    console.error('Erro ao carregar dados da loja:', shopError);
                }
            }
            window.location.replace('gestor.html');
        }
    } catch (err) {
        if (loginMessage) {
            loginMessage.textContent = 'Erro ao conectar. Tente novamente.';
            loginMessage.style.display = 'block';
        }
        console.error('Login error:', err);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});
