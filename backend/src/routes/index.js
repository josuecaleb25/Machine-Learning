import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import predictionRoutes from './prediction.routes.js';
import residuoRoutes from './residuo.routes.js';
import recoleccionRoutes from './recoleccion.routes.js';
import puntoReciclajeRoutes from './puntoReciclaje.routes.js';
import { supabaseService } from '../services/supabase.service.js';
import { success } from '../utils/apiResponse.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/predictions', predictionRoutes);
router.use('/residuos', residuoRoutes);
router.use('/recoleccion', recoleccionRoutes);
router.use('/puntos-reciclaje', puntoReciclajeRoutes);

router.get('/health', async (_req, res, next) => {
  try {
    let supabaseStatus = { connected: false };
    try {
      supabaseStatus = await supabaseService.ping();
    } catch {
      supabaseStatus = { connected: false, hint: 'Revisa SUPABASE_URL, keys y que exista la tabla residuos' };
    }

    return success(res, {
      message: 'EcoVision API operativa',
      data: {
        service: 'ecovision-backend',
        timestamp: new Date().toISOString(),
        supabase: supabaseStatus,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
