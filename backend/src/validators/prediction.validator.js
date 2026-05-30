import { z } from 'zod';
import { CATEGORIA_RESIDUO } from '../types/constants.js';

const categorias = Object.values(CATEGORIA_RESIDUO);

export const createPredictionSchema = z.object({
  residuoDetectado: z.string().min(1).max(200).trim(),
  categoria: z.enum(categorias),
  confianza: z.coerce.number().min(0).max(1),
});

export const historyQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const predictionIdParamSchema = z.object({
  id: z.string().uuid(),
});
