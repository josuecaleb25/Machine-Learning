import { z } from 'zod';

const embeddingSchema = z
  .array(z.coerce.number())
  .min(1, 'El embedding facial debe tener al menos un valor');

export const registerSchema = z.object({
  nombre: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(128),
});

export const loginSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(1).max(128),
});

export const registerFaceSchema = z.object({
  nombre: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).toLowerCase().trim().optional(),
  facialEmbedding: embeddingSchema,
});

export const loginFaceSchema = z.object({
  facialEmbedding: embeddingSchema,
});
