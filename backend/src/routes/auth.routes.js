import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  loginSchema,
  loginFaceSchema,
  registerSchema,
  registerFaceSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/register-face',
  validate(registerFaceSchema),
  authController.registerFace
);
router.post('/login-face', validate(loginFaceSchema), authController.loginFace);
router.get('/me', authenticate, authController.me);

export default router;
