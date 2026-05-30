import { predictionService } from '../services/prediction.service.js';
import { success } from '../utils/apiResponse.js';

export const predictionController = {
  async create(req, res, next) {
    try {
      const prediction = await predictionService.createPrediction(
        req.user.id,
        req.body
      );
      return success(res, {
        message: 'Predicción guardada en el historial',
        data: { prediction },
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req, res, next) {
    try {
      const { limit, offset } = req.query;
      const history = await predictionService.getHistory(req.user.id, {
        limit,
        offset,
      });
      return success(res, {
        message: 'Historial de predicciones',
        data: history,
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteHistoryItem(req, res, next) {
    try {
      const deleted = await predictionService.deletePrediction(
        req.user.id,
        req.params.id
      );
      return success(res, {
        message: 'Predicción eliminada del historial',
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
