import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { sessionService } from './session.service.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import {
  findDuplicateUser,
  evaluateFaceMatch,
  parseEmbedding,
  formatSimilarityPct,
} from '../utils/faceRecognition.js';
import { toPublicUser } from '../utils/userMapper.js';
import { AUTH_METHOD } from '../types/constants.js';
import { logger } from '../utils/logger.js';
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

function logFaceCandidates(ranked) {
  return ranked.map(({ user, similarity }) => ({
    id: user.id,
    nombre: user.nombre ?? user.email ?? '—',
    similitud: formatSimilarityPct(similarity),
  }));
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
      logger.warn('[FACE REGISTER] Registro rechazado — rostro duplicado', {
        candidato: duplicate.user.nombre ?? duplicate.user.id,
        similitud: formatSimilarityPct(duplicate.similarity),
        umbral: formatSimilarityPct(env.FACE_SIMILARITY_THRESHOLD),
      });
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

    logger.info('[FACE REGISTER] Registro exitoso', {
      usuario: nombre,
      id: user.id,
    });

    const session = await sessionService.createSession(user.id);
    return { user, ...session };
  },

  async loginFace({ facialEmbedding }) {
    const embedding = parseEmbedding(facialEmbedding);
    const usersWithFace = await userRepository.findAllWithFacialEmbeddings();

    const evaluation = evaluateFaceMatch(
      embedding,
      usersWithFace,
      env.FACE_SIMILARITY_THRESHOLD,
      env.FACE_SIMILARITY_MARGIN
    );

    const candidates = logFaceCandidates(evaluation.ranked);

    console.log('─── Intento de autenticación facial ───');
    candidates.forEach((c, i) => {
      console.log(`  ${i + 1}. ${c.nombre} → similitud: ${c.similitud}`);
    });

    if (!evaluation.accepted) {
      const best = evaluation.best;
      const bestPct = best ? formatSimilarityPct(best.similarity) : 'N/A';
      const umbralPct = formatSimilarityPct(env.FACE_SIMILARITY_THRESHOLD);

      let motivo;
      if (evaluation.reason === 'no_users') {
        motivo = 'No hay usuarios con rostro registrado';
      } else if (evaluation.reason === 'below_threshold') {
        motivo = `Similitud ${bestPct} por debajo del umbral ${umbralPct}`;
      } else if (evaluation.reason === 'ambiguous') {
        const secondPct = formatSimilarityPct(evaluation.second.similarity);
        motivo = `Coincidencia ambigua: ${bestPct} vs ${secondPct} (margen insuficiente)`;
      } else {
        motivo = 'Coincidencia no confiable';
      }

      console.log(`  Resultado: DENEGADO — ${motivo}`);
      console.log('───────────────────────────────────────');

      logger.warn('[FACE AUTH] Acceso DENEGADO', {
        motivo,
        mejorCandidato: best
          ? { nombre: best.user.nombre ?? best.user.id, similitud: bestPct }
          : null,
        umbral: umbralPct,
        margen: formatSimilarityPct(env.FACE_SIMILARITY_MARGIN),
        candidatos: candidates,
      });

      throw new ForbiddenError('Rostro no registrado en el sistema.');
    }

    const { user, similarity } = evaluation;
    const simPct = formatSimilarityPct(similarity);

    console.log(
      `  Usuario detectado: ${user.nombre ?? user.id} → similitud: ${simPct}`
    );
    console.log('  Resultado: ACCESO CONCEDIDO');
    console.log('───────────────────────────────────────');

    logger.info('[FACE AUTH] Acceso CONCEDIDO', {
      usuario: user.nombre ?? user.id,
      id: user.id,
      similitud: simPct,
      candidatos: candidates,
    });

    const publicUser = await userRepository.findById(user.id);
    const session = await sessionService.createSession(user.id);

    return {
      user: publicUser,
      similarity,
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
