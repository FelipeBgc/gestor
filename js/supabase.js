// Substitua pelos valores do seu projeto Supabase.
// Crie uma tabela chamada `gestor_users` com pelo menos estas colunas:
// - id (uuid, chave primária, default: gen_random_uuid())
// - username (text)
// - shop_name (text)
// - password_hash (text)
// Depois configure as políticas de RLS ou permita leitura/inserção para anon.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://wkvsmrpkckuehwhucsav.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_B4xjD5s6MpLrvoxrJQbgsQ_faDkL7e6';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

export async function getUserByUsername(username) {
    const { data, error } = await supabase
        .from('gestor_users')
        .select('id,username,shop_name,password_hash')
        .eq('username', username)
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    return data || null;
}

export async function getUserById(id) {
    const { data, error } = await supabase
        .from('gestor_users')
        .select('id,username,shop_name,password_hash')
        .eq('id', id)
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw error;
    }

    return data || null;
}

export async function createUser(user) {
    const { data, error } = await supabase
        .from('gestor_users')
        .insert([user])
        .select();

    if (error) {
        throw error;
    }

    return data?.[0] || null;
}
