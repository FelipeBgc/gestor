import { supabase } from './supabase-config.js';

const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('new-username');
const shopNameInput = document.getElementById('shop-name');
const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerMessage = document.getElementById('register-message');

// Verificar se usuário já está autenticado
async function checkAuthStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        window.location.replace('gestor.html');
    }
}

checkAuthStatus();

registerForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = usernameInput?.value.trim();
    const shopName = shopNameInput?.value.trim();
    const password = passwordInput?.value;
    const confirmPassword = confirmPasswordInput?.value;

    if (!email || !shopName || !password || !confirmPassword) {
        showError('Preencha todos os campos.');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor, insira um email válido.');
        return;
    }

    if (password.length < 6) {
        showError('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    if (password !== confirmPassword) {
        showError('As senhas não coincidem.');
        return;
    }

    // Mostrar carregamento
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Criando conta...';
    submitBtn.disabled = true;

    try {
        // 1. Criar usuário no Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    shop_name: shopName
                }
            }
        });

        if (authError) {
            showError(authError.message || 'Erro ao criar conta.');
            return;
        }

        if (!authData.user) {
            showError('Erro ao criar conta. Tente novamente.');
            return;
        }

        // 2. Criar perfil da loja
        const { error: shopError } = await supabase
            .from('shops')
            .insert([
                {
                    user_id: authData.user.id,
                    shop_name: shopName
                }
            ]);

        if (shopError) {
            showError('Erro ao criar perfil da loja.');
            return;
        }

        // 3. Fazer login automático
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            // Mesmo com erro de login, redirecionar para verificar email
            showSuccess('Conta criada! Verifique seu email para confirmar.');
            setTimeout(() => {
                window.location.replace('login.html');
            }, 2000);
            return;
        }

        // Login bem-sucedido
        window.location.replace('gestor.html');

    } catch (err) {
        showError('Erro ao criar conta. Tente novamente.');
        console.error('Register error:', err);
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

function showError(message) {
    if (!registerMessage) return;
    registerMessage.textContent = message;
    registerMessage.style.color = '#d32f2f';
    registerMessage.style.display = 'block';
}

function showSuccess(message) {
    if (!registerMessage) return;
    registerMessage.textContent = message;
    registerMessage.style.color = '#388e3c';
    registerMessage.style.display = 'block';
}
