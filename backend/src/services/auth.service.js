import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { sessionService } from './session.service.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import {
  findDuplicateUser,
  findMatchingUser,
  parseEmbedding,
} from '../utils/faceRecognition.js';
import { toPublicUser } from '../utils/userMapper.js';
import { AUTH_METHOD } from '../types/constants.js';
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';

function resolveAuthMethod(current, incoming) {
  if (!current) return incoming;
  if (current === incoming) return current;
  return AUTH_METHOD.BOTH;
}

export const authService = {
  async registerManual({ nombre, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('El email ya está registrado');
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepository.create({
      nombre,
      email,
      passwordHash,
      authMethod: AUTH_METHOD.MANUAL,
    });

    const session = await sessionService.createSession(user.id);
    return { user, ...session };
  },

  async loginManual({ email, password }) {
    const user = await userRepository.findByEmailForAuth(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    const publicUser = await userRepository.findById(user.id);
    const session = await sessionService.createSession(user.id);
    return { user: publicUser, ...session };
  },

  async registerFace({ nombre, email, facialEmbedding }) {
    const embedding = parseEmbedding(facialEmbedding);
    const usersWithFace = await userRepository.findAllWithFacialEmbeddings();

    const duplicate = findDuplicateUser(
      embedding,
      usersWithFace,
      env.FACE_SIMILARITY_THRESHOLD
    );
    if (duplicate) {
      throw new ConflictError(
        'Este rostro ya está registrado en el sistema. No se permiten duplicados.'
      );
    }

    if (email) {
      const existingEmail = await userRepository.findByEmail(email);
      if (existingEmail) {
        throw new ConflictError('El email ya está registrado');
      }
    }

    const user = await userRepository.create({
      nombre,
      email: email ?? null,
      facialEmbedding: embedding,
      authMethod: AUTH_METHOD.FACIAL,
    });

    const session = await sessionService.createSession(user.id);
    return { user, ...session };
  },

  async loginFace({ facialEmbedding }) {
    const embedding = parseEmbedding(facialEmbedding);
    const usersWithFace = await userRepository.findAllWithFacialEmbeddings();

    const match = findMatchingUser(
      embedding,
      usersWithFace,
      env.FACE_SIMILARITY_THRESHOLD
    );

    if (!match) {
      throw new ForbiddenError(
        'Acceso denegado: no se encontró coincidencia facial con el umbral requerido'
      );
    }

    const publicUser = await userRepository.findById(match.user.id);
    const session = await sessionService.createSession(match.user.id);

    return {
      user: publicUser,
      similarity: match.similarity,
      ...session,
    };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  },

  async linkManualToUser(userId, { email, password }) {
    const user = await userRepository.findByIdWithSecrets(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    const existing = await userRepository.findByEmail(email);
    if (existing && existing.id !== userId) {
      throw new ConflictError('El email ya está en uso');
    }

    const passwordHash = await hashPassword(password);
    return userRepository.update(userId, {
      email,
      passwordHash,
      authMethod: resolveAuthMethod(user.authMethod, AUTH_METHOD.MANUAL),
    });
  },

  async linkFaceToUser(userId, { facialEmbedding }) {
    const embedding = parseEmbedding(facialEmbedding);
    const usersWithFace = await userRepository.findAllWithFacialEmbeddings();
    const others = usersWithFace.filter((u) => u.id !== userId);

    const duplicate = findDuplicateUser(
      embedding,
      others,
      env.FACE_SIMILARITY_THRESHOLD
    );
    if (duplicate) {
      throw new ConflictError('Este rostro ya pertenece a otro usuario');
    }

    const user = await userRepository.findByIdWithSecrets(userId);
    if (!user) throw new NotFoundError('Usuario no encontrado');

    return userRepository.update(userId, {
      facialEmbedding: embedding,
      authMethod: resolveAuthMethod(user.authMethod, AUTH_METHOD.FACIAL),
    });
  },
};
