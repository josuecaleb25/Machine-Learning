import { AppError, ConflictError, NotFoundError } from './errors.js';

export function handleDbError(error, context = 'Error de base de datos') {
  if (!error) return;

  if (error.code === '23505') {
    throw new ConflictError('El registro ya existe');
  }
  if (error.code === 'PGRST116') {
    throw new NotFoundError('Recurso no encontrado');
  }

  throw new AppError(`${context}: ${error.message}`, 500);
}

export const USER_PUBLIC_FIELDS =
  'id, nombre, email, authMethod, avatarUrl, createdAt, updatedAt';
