import { supabase } from './supabase-config.js';

const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('new-username');
const shopNameInput = document.getElementById('shop-name');
const passwordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const registerMessage = document.getElementById('register-message');
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
        console.log('Iniciando registro com email:', email);
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
            console.error('Erro de autenticação:', authError);
            showError(authError.message || 'Erro ao criar conta.');
            return;
        }

        if (!authData.user) {
            showError('Erro ao criar conta. Tente novamente.');
            return;
        }

        console.log('Usuário criado com sucesso:', authData.user.id);

        // 2. Aguardar um pouco para garantir que o usuário esteja totalmente criado
        await new Promise(resolve => setTimeout(resolve, 500));

        // 3. Criar perfil da loja
        console.log('Criando perfil da loja...');
        const { data: shopData, error: shopError } = await supabase
            .from('shops')
            .insert([
                {
                    user_id: authData.user.id,
                    shop_name: shopName
                }
            ])
            .select();

        if (shopError) {
            console.error('Erro ao criar loja:', shopError);
            showError(`Erro ao criar perfil da loja: ${shopError.message}`);
            return;
        }

        console.log('Loja criada com sucesso:', shopData);
        localStorage.setItem(currentUserKey, authData.user.email || email);
        localStorage.setItem(currentShopKey, shopName);
        localStorage.setItem(authKey, 'true');
        // 4. Tentar fazer login automático
        console.log('Tentando login automático...');
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (signInError) {
            console.warn('Erro ao fazer login automático:', signInError);
            // Mesmo com erro, mostrar sucesso pois conta foi criada
            showSuccess('Conta criada! Você será redirecionado para login.');
            setTimeout(() => {
                window.location.replace('login.html');
            }, 2000);
            return;
        }

        console.log('Login automático bem-sucedido');
        showSuccess('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
            window.location.replace('gestor.html');
        }, 1000);

    } catch (err) {
        console.error('Erro geral no registro:', err);
        showError('Erro ao criar conta. Verifique o console para mais detalhes.');
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
    console.error('Erro exibido:', message);
}

function showSuccess(message) {
    if (!registerMessage) return;
    registerMessage.textContent = message;
    registerMessage.style.color = '#388e3c';
    registerMessage.style.display = 'block';
    console.log('Sucesso exibido:', message);
}
