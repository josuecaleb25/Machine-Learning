import { Router } from 'express';
import { getLimaRecoleccion } from '../controllers/recoleccion.controller.js';

const router = Router();

router.get('/lima', getLimaRecoleccion);

export default router;
