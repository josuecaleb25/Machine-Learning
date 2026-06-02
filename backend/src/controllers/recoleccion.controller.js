import { getLimaRecyclingPoints } from '../services/overpass.service.js';
import { success } from '../utils/apiResponse.js';

export async function getLimaRecoleccion(req, res, next) {
  try {
    const data = await getLimaRecyclingPoints();
    return success(res, {
      message: 'Puntos de reciclaje en Lima Metropolitana',
      data,
    });
  } catch (err) {
    next(err);
  }
}
