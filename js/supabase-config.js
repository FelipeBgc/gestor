// Configuração do Supabase
const SUPABASE_URL = 'https://wkvsmrpkckuehwhucsav.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_B4xjD5s6MpLrvoxrJQbgsQ_faDkL7e6';

// Inicializar cliente Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Funções auxiliares para autenticação
export async function signUp(email, password, shopName) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                shop_name: shopName
            }
        }
    });
    return { data, error };
}

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
}

export async function getShopProfile(userId) {
    const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', userId)
        .single();
    return { data, error };
}

export async function createShopProfile(userId, shopName) {
    const { data, error } = await supabase
        .from('shops')
        .insert([
            {
                user_id: userId,
                shop_name: shopName
            }
        ])
        .select();
    return { data, error };
}

// Listener para mudanças de autenticação
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
}
