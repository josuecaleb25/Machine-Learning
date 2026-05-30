import { authService } from '../services/auth.service.js';
import { success } from '../utils/apiResponse.js';

export const authController = {
  async register(req, res, next) {
    try {
      const result = await authService.registerManual(req.body);
      return success(res, {
        message: 'Registro exitoso',
        data: {
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        },
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.loginManual(req.body);
      return success(res, {
        message: 'Inicio de sesión exitoso',
        data: {
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async registerFace(req, res, next) {
    try {
      const result = await authService.registerFace(req.body);
      return success(res, {
        message: 'Registro facial exitoso',
        data: {
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
        },
        statusCode: 201,
      });
    } catch (err) {
      next(err);
    }
  },

  async loginFace(req, res, next) {
    try {
      const result = await authService.loginFace(req.body);
      return success(res, {
        message: `Bienvenido, ${result.user.nombre}`,
        data: {
          user: result.user,
          token: result.token,
          expiresAt: result.expiresAt,
          similarity: result.similarity,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return success(res, {
        message: 'Usuario autenticado',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },
};
