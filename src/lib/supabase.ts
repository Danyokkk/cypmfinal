import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

const isConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!isConfigured) {
    console.warn('Supabase URL or Anon Key is missing. Build will proceed with placeholders, but runtime calls will fail.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
