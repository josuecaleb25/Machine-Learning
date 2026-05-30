import { supabase } from '../config/supabase.js';
import { handleDbError } from '../utils/supabaseDb.js';

export const residuoRepository = {
  async findByCategoria(categoria) {
    const { data, error } = await supabase
      .from('residuos')
      .select()
      .eq('categoria', categoria)
      .maybeSingle();

    handleDbError(error, 'Error al buscar residuo');
    return data;
  },

  async findAll() {
    const { data, error } = await supabase
      .from('residuos')
      .select()
      .order('nombre', { ascending: true });

    handleDbError(error, 'Error al listar residuos');
    return data ?? [];
  },
};
