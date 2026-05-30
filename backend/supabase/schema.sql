-- =============================================================================
-- EcoVision Smart City — Schema PostgreSQL para Supabase
-- =============================================================================
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
--
-- Backend EcoVision: solo Supabase JS (sin Prisma).
-- Ejecutar una vez en base vacía.
-- =============================================================================

-- Extensiones (Supabase ya las tiene; IF NOT EXISTS por seguridad)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Limpiar (solo si quieres reiniciar desde cero — descomenta con cuidado)
-- -----------------------------------------------------------------------------
-- DROP TABLE IF EXISTS historial_predicciones CASCADE;
-- DROP TABLE IF EXISTS sesiones CASCADE;
-- DROP TABLE IF EXISTS residuos CASCADE;
-- DROP TABLE IF EXISTS usuarios CASCADE;
-- DROP TYPE IF EXISTS "CategoriaResiduo";
-- DROP TYPE IF EXISTS "AuthMethod";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "AuthMethod" AS ENUM ('FACIAL', 'MANUAL', 'BOTH');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CategoriaResiduo" AS ENUM ('PLASTICO', 'CARTON', 'VIDRIO', 'ORGANICO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- -----------------------------------------------------------------------------
-- Tabla: usuarios
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre          TEXT NOT NULL,
  email           TEXT UNIQUE,
  "passwordHash"  TEXT,
  "facialEmbedding" JSONB,
  "authMethod"    "AuthMethod" NOT NULL,
  "avatarUrl"     TEXT,
  "createdAt"     TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updatedAt"     TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usuarios IS 'Usuarios EcoVision: auth manual, facial o ambos';
COMMENT ON COLUMN usuarios."facialEmbedding" IS 'Vector facial (JSON array). No se guardan imágenes.';
COMMENT ON COLUMN usuarios."passwordHash" IS 'bcrypt hash; NULL si solo auth facial';

-- -----------------------------------------------------------------------------
-- Tabla: sesiones (JWT persistidos)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "usuarioId" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  "expiresAt" TIMESTAMPTZ(3) NOT NULL,
  "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sesiones_usuario_id_idx ON sesiones("usuarioId");
CREATE INDEX IF NOT EXISTS sesiones_token_idx ON sesiones(token);

-- -----------------------------------------------------------------------------
-- Tabla: historial_predicciones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial_predicciones (
  id                 TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "usuarioId"        TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
  "residuoDetectado" TEXT NOT NULL,
  categoria          "CategoriaResiduo" NOT NULL,
  confianza          DOUBLE PRECISION NOT NULL CHECK (confianza >= 0 AND confianza <= 1),
  "createdAt"        TIMESTAMPTZ(3) NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS historial_usuario_id_idx ON historial_predicciones("usuarioId");
CREATE INDEX IF NOT EXISTS historial_categoria_idx ON historial_predicciones(categoria);
CREATE INDEX IF NOT EXISTS historial_created_at_idx ON historial_predicciones("createdAt" DESC);

-- -----------------------------------------------------------------------------
-- Tabla: residuos (catálogo fijo)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS residuos (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  nombre      TEXT NOT NULL,
  categoria   "CategoriaResiduo" NOT NULL UNIQUE,
  descripcion TEXT NOT NULL,
  "colorTacho" TEXT NOT NULL
);

-- -----------------------------------------------------------------------------
-- Trigger: actualizar updatedAt en usuarios
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS usuarios_updated_at ON usuarios;
CREATE TRIGGER usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security (opcional)
-- -----------------------------------------------------------------------------
-- El backend usa SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
-- El frontend usa anon key + políticas RLS donde aplique.

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_predicciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE residuos ENABLE ROW LEVEL SECURITY;

-- Política: lectura pública del catálogo de residuos (anon/authenticated)
DROP POLICY IF EXISTS "residuos_lectura_publica" ON residuos;
CREATE POLICY "residuos_lectura_publica"
  ON residuos FOR SELECT
  USING (true);

-- El backend con service_role bypass RLS. Las demás tablas quedan sin políticas
-- para anon → el resto de tablas solo vía API Express con service_role.

-- =============================================================================
-- Fin del schema. Ejecuta seed.sql después para datos iniciales.
-- =============================================================================
