import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('--- WARNING: Supabase credentials missing ---');
    console.warn('Check your environment variables. Using placeholder values to prevent startup crash.');
}

const getSupabase = (url: string, key: string) => {
    const global = globalThis as any;
    const cacheKey = `_supabase_${url}_${key.slice(0, 10)}`;
    if (!global[cacheKey]) {
        global[cacheKey] = createClient(url, key);
    }
    return global[cacheKey];
};

export const supabase = getSupabase(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = getSupabase(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

