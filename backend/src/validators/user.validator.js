import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    nombre: z.string().min(2).max(100).trim().optional(),
    email: z.string().email().max(255).toLowerCase().trim().optional(),
    avatarUrl: z.string().url().max(500).optional().nullable(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debe enviar al menos un campo para actualizar',
  });
