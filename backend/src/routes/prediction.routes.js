import { Router } from 'express';
import { predictionController } from '../controllers/prediction.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createPredictionSchema,
  historyQuerySchema,
  predictionIdParamSchema,
} from '../validators/prediction.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createPredictionSchema), predictionController.create);
router.get('/history', validate(historyQuerySchema, 'query'), predictionController.getHistory);
router.delete(
  '/history/:id',
  validate(predictionIdParamSchema, 'params'),
  predictionController.deleteHistoryItem
);

export default router;
