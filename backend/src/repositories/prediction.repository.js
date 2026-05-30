import { supabase } from '../config/supabase.js';
import { handleDbError } from '../utils/supabaseDb.js';

export const predictionRepository = {
  async create(payload) {
    const { data, error } = await supabase
      .from('historial_predicciones')
      .insert({
        usuarioId: payload.usuarioId,
        residuoDetectado: payload.residuoDetectado,
        categoria: payload.categoria,
        confianza: payload.confianza,
      })
      .select()
      .single();

    handleDbError(error, 'Error al guardar predicción');
    return data;
  },

  async findByUserId(usuarioId, { limit = 50, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('historial_predicciones')
      .select()
      .eq('usuarioId', usuarioId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    handleDbError(error, 'Error al leer historial');
    return data ?? [];
  },

  async countByUserId(usuarioId) {
    const { count, error } = await supabase
      .from('historial_predicciones')
      .select('*', { count: 'exact', head: true })
      .eq('usuarioId', usuarioId);

    handleDbError(error, 'Error al contar historial');
    return count ?? 0;
  },

  async findByIdAndUserId(id, usuarioId) {
    const { data, error } = await supabase
      .from('historial_predicciones')
      .select()
      .eq('id', id)
      .eq('usuarioId', usuarioId)
      .maybeSingle();

    handleDbError(error, 'Error al buscar predicción');
    return data;
  },

  async deleteByIdAndUserId(id, usuarioId) {
    const { error } = await supabase
      .from('historial_predicciones')
      .delete()
      .eq('id', id)
      .eq('usuarioId', usuarioId);

    handleDbError(error, 'Error al eliminar predicción');
  },
};
