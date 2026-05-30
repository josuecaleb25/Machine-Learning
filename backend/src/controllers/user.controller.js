import { userService } from '../services/user.service.js';
import { success } from '../utils/apiResponse.js';

export const userController = {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      return success(res, {
        message: 'Perfil obtenido',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      return success(res, {
        message: 'Perfil actualizado',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },
};
