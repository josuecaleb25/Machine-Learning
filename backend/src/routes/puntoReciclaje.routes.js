import { Router } from 'express';
import { puntoReciclajeController } from '../controllers/puntoReciclaje.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { listPuntosReciclajeSchema } from '../validators/puntoReciclaje.validator.js';

const router = Router();

/** Público — catálogo de puntos para el mapa */
router.get(
  '/',
  validate(listPuntosReciclajeSchema, 'query'),
  puntoReciclajeController.list
);

export default router;
