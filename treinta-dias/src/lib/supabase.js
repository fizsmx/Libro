import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isConfigured() {
  return (
    supabaseUrl !== '' &&
    supabaseUrl !== 'https://YOUR_PROJECT.supabase.co' &&
    supabaseAnonKey !== '' &&
    supabaseAnonKey !== 'YOUR_ANON_KEY'
  );
}
