import { predictionRepository } from '../repositories/prediction.repository.js';
import { residuoRepository } from '../repositories/residuo.repository.js';
import { NotFoundError } from '../utils/errors.js';

export const predictionService = {
  async createPrediction(userId, { residuoDetectado, categoria, confianza }) {
    const residuo = await residuoRepository.findByCategoria(categoria);

    const prediction = await predictionRepository.create({
      usuarioId: userId,
      residuoDetectado,
      categoria,
      confianza,
    });

    return {
      ...prediction,
      residuoInfo: residuo ?? null,
    };
  },

  async getHistory(userId, { limit, offset }) {
    const [items, total] = await Promise.all([
      predictionRepository.findByUserId(userId, { limit, offset }),
      predictionRepository.countByUserId(userId),
    ]);

    return { items, total, limit, offset };
  },

  async deletePrediction(userId, predictionId) {
    const existing = await predictionRepository.findByIdAndUserId(
      predictionId,
      userId
    );
    if (!existing) {
      throw new NotFoundError('Predicción no encontrada en tu historial');
    }

    await predictionRepository.deleteByIdAndUserId(predictionId, userId);
    return { id: predictionId };
  },
};
