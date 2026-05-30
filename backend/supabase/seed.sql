-- =============================================================================
-- EcoVision Smart City — Datos iniciales (residuos)
-- Ejecutar DESPUÉS de schema.sql en Supabase SQL Editor
-- =============================================================================

INSERT INTO residuos (id, nombre, categoria, descripcion, "colorTacho")
VALUES
  (
    gen_random_uuid()::text,
    'Plástico',
    'PLASTICO',
    'Botellas, envases, bolsas y otros productos plásticos reciclables',
    '#FFD700'
  ),
  (
    gen_random_uuid()::text,
    'Cartón',
    'CARTON',
    'Cajas, papel, cartón y productos de papel reciclables',
    '#8B4513'
  ),
  (
    gen_random_uuid()::text,
    'Vidrio',
    'VIDRIO',
    'Botellas, frascos y otros productos de vidrio reciclables',
    '#00CED1'
  ),
  (
    gen_random_uuid()::text,
    'Orgánico',
    'ORGANICO',
    'Restos de comida, cáscaras y residuos biodegradables',
    '#228B22'
  )
ON CONFLICT (categoria) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  descripcion = EXCLUDED.descripcion,
  "colorTacho" = EXCLUDED."colorTacho";
