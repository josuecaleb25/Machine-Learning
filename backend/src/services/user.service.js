import { userRepository } from '../repositories/user.repository.js';
import { NotFoundError, ConflictError } from '../utils/errors.js';

export const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  },

  async updateProfile(userId, { nombre, email, avatarUrl }) {
    const user = await userRepository.findByIdWithSecrets(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    if (email && email !== user.email) {
      const existing = await userRepository.findByEmail(email);
      if (existing && existing.id !== userId) {
        throw new ConflictError('El email ya está en uso');
      }
    }

    const data = {};
    if (nombre !== undefined) data.nombre = nombre;
    if (email !== undefined) data.email = email;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl;

    return userRepository.update(userId, data);
  },
};
