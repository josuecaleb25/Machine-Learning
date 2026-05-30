# EcoVision Smart City — Backend

API REST en **Node.js + Express + Supabase** (sin Prisma).

## Stack

- Node.js, Express.js
- **Supabase** (`@supabase/supabase-js`) — URL + anon + service_role
- JWT, bcrypt, Zod, Helmet, CORS, Morgan

## Configuración

1. Supabase → SQL Editor → `supabase/schema.sql` + `supabase/seed.sql`
2. Copia `backend/.env.example` → `.env` con tus keys de **Project Settings → API**
3. Instala y arranca:

```bash
npm install
npm run seed
npm run dev
```

- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor (obligatoria) |
| `JWT_SECRET` | Firma de tokens del API |

**No se usa `DATABASE_URL`.**

## Endpoints

Ver [docs/API_EXAMPLES.md](./docs/API_EXAMPLES.md) y [supabase/README.md](./supabase/README.md).

## Licencia

MIT
