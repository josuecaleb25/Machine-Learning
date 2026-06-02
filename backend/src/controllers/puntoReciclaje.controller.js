import { puntoReciclajeService } from '../services/puntoReciclaje.service.js';
import { success } from '../utils/apiResponse.js';

export const puntoReciclajeController = {
  async list(req, res, next) {
    try {
      const { q, tipo, lat, lng, activo } = req.query;
      const activoFilter =
        activo === 'all' ? undefined : activo === 'false' ? false : true;

      const data = await puntoReciclajeService.listPuntos({
        q,
        tipo,
        lat,
        lng,
        activo: activoFilter,
      });

      return success(res, {
        message: 'Puntos de reciclaje',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
