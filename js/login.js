import { supabase } from './supabase-config.js';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginMessage = document.getElementById('login-message');

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
            // Login bem-sucedido
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
