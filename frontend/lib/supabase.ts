import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClients() {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing required Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
    return {
        supabase: createClient(supabaseUrl, supabaseAnonKey),
        supabaseAdmin: supabaseServiceKey
            ? createClient(supabaseUrl, supabaseServiceKey)
            : createClient(supabaseUrl, supabaseAnonKey),
    };
}

let cachedClients: any = null;

function getClients() {
    if (!cachedClients) {
        cachedClients = getSupabaseClients();
    }
    return cachedClients;
}

export const supabase = new Proxy({}, {
    get: (target, prop) => {
        return getClients().supabase[prop as any];
    }
}) as any;

export const supabaseAdmin = new Proxy({}, {
    get: (target, prop) => {
        return getClients().supabaseAdmin[prop as any];
    }
}) as any;

