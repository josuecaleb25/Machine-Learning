import { supabase, isSupabaseConfigured } from './supabase.js';
import { apiFetch } from './api.js';

/**
 * Catálogo de residuos: primero Supabase directo (anon), si no hay env → API Express.
 */
export async function fetchResiduos() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('residuos')
      .select('id, nombre, categoria, descripcion, colorTacho')
      .order('nombre', { ascending: true });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  const res = await apiFetch('/residuos');
  return res.data?.residuos ?? [];
}
