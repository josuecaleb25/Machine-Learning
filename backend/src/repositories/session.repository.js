import { supabase } from '../config/supabase.js';
import { handleDbError } from '../utils/supabaseDb.js';

export const sessionRepository = {
  async create({ usuarioId, token, expiresAt }) {
    const { data, error } = await supabase
      .from('sesiones')
      .insert({
        usuarioId,
        token,
        expiresAt: expiresAt.toISOString(),
      })
      .select()
      .single();

    handleDbError(error, 'Error al crear sesión');
    return data;
  },

  async findByToken(token) {
    const { data, error } = await supabase
      .from('sesiones')
      .select('*, usuario:usuarios(*)')
      .eq('token', token)
      .maybeSingle();

    handleDbError(error, 'Error al buscar sesión');
    return data;
  },

  async deleteByToken(token) {
    const { error } = await supabase.from('sesiones').delete().eq('token', token);
    handleDbError(error, 'Error al eliminar sesión');
  },

  async deleteExpired() {
    const { error } = await supabase
      .from('sesiones')
      .delete()
      .lt('expiresAt', new Date().toISOString());

    handleDbError(error, 'Error al limpiar sesiones');
  },
};
