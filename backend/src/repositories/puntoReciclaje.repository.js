import { supabase } from '../config/supabase.js';
import { handleDbError } from '../utils/supabaseDb.js';

const SELECT_FIELDS =
  'id, nombre, direccion, latitud, longitud, tipos_residuos, horario, activo, created_at';

export const puntoReciclajeRepository = {
  /**
   * Lista puntos activos/inactivos según filtro. La búsqueda y tipo se aplican en SQL.
   */
  async findAll({ activo = true } = {}) {
    let query = supabase.from('puntos_reciclaje').select(SELECT_FIELDS);

    if (activo !== undefined && activo !== null) {
      query = query.eq('activo', activo);
    }

    query = query.order('nombre', { ascending: true });

    const { data, error } = await query;
    handleDbError(error, 'Error al consultar puntos de reciclaje');
    return data ?? [];
  },
};
