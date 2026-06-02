import { z } from 'zod';

export const listPuntosReciclajeSchema = z.object({
  q: z.string().max(120).optional(),
  tipo: z
    .enum(['plastico', 'vidrio', 'carton', 'metal', 'organico', 'electronicos'])
    .optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  activo: z
    .enum(['true', 'false', 'all'])
    .optional()
    .default('true'),
});
