import { supabase } from '../config/supabase.js';
import { residuoRepository } from '../repositories/residuo.repository.js';
import { AppError } from '../utils/errors.js';

export const supabaseService = {
  async ping() {
    const { error } = await supabase.from('residuos').select('id').limit(1);
    if (error) {
      throw new AppError(`Supabase: ${error.message}`, 503);
    }
    return { connected: true };
  },

  async listResiduos() {
    return residuoRepository.findAll();
  },
};
