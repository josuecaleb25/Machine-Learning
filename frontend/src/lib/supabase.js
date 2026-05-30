import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[EcoVision] Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en frontend/.env'
  );
}

/**
 * Cliente Supabase del navegador (anon key + RLS).
 * Mismo patrón que en proyectos anteriores.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}
