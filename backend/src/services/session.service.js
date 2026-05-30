import { sessionRepository } from '../repositories/session.repository.js';
import { signToken, getTokenExpiration } from '../utils/jwt.js';

export const sessionService = {
  async createSession(usuarioId) {
    const token = signToken({ sub: usuarioId });
    const expiresAt = getTokenExpiration();

    await sessionRepository.create({ usuarioId, token, expiresAt });

    return { token, expiresAt };
  },

  async revokeSession(token) {
    await sessionRepository.deleteByToken(token);
  },
};
