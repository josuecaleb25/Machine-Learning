# Base de datos Supabase — EcoVision (sin Prisma)

Solo necesitas **URL + anon key + service_role** en `backend/.env`. No uses `DATABASE_URL`.

## 1. Crear tablas

Supabase Dashboard → **SQL Editor** → ejecuta en orden:

1. `schema.sql`
2. `seed.sql` (o desde terminal: `npm run seed`)

## 2. Variables en `backend/.env`

```env
SUPABASE_URL="https://wishguhgzpjnhjgczucd.supabase.co"
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
JWT_SECRET="..."
```

## 3. Arrancar API

```bash
cd backend
npm install
npm run seed   # opcional si ya corriste seed.sql
npm run dev
```

## 4. Frontend

`frontend/.env`:

```env
VITE_SUPABASE_URL="https://wishguhgzpjnhjgczucd.supabase.co"
VITE_SUPABASE_ANON_KEY="..."
VITE_API_URL="http://localhost:3000/api"
```

## Seguridad

- **service_role** → solo `backend/.env`
- **anon** → frontend y lecturas públicas (RLS)
- Nunca subas `.env` a Git

## Reset

```sql
DROP TABLE IF EXISTS historial_predicciones CASCADE;
DROP TABLE IF EXISTS sesiones CASCADE;
DROP TABLE IF EXISTS residuos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TYPE IF EXISTS "CategoriaResiduo";
DROP TYPE IF EXISTS "AuthMethod";
```

Luego `schema.sql` + `seed.sql` de nuevo.
