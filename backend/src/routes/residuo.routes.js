import { Router } from 'express';
import { residuoController } from '../controllers/residuo.controller.js';

const router = Router();

/** Público — lee `residuos` con anon key + RLS de lectura pública */
router.get('/', residuoController.list);

export default router;
