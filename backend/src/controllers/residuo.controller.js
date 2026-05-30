import { supabaseService } from '../services/supabase.service.js';
import { success } from '../utils/apiResponse.js';

export const residuoController = {
  async list(req, res, next) {
    try {
      const residuos = await supabaseService.listResiduos();
      return success(res, {
        message: 'Catálogo de residuos (Supabase)',
        data: { residuos },
      });
    } catch (err) {
      next(err);
    }
  },
};
