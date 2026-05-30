import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌ Define SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en backend/.env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const residuos = [
  {
    nombre: 'Plástico',
    categoria: 'PLASTICO',
    descripcion: 'Botellas, envases, bolsas y otros productos plásticos reciclables',
    colorTacho: '#FFD700',
  },
  {
    nombre: 'Cartón',
    categoria: 'CARTON',
    descripcion: 'Cajas, papel, cartón y productos de papel reciclables',
    colorTacho: '#8B4513',
  },
  {
    nombre: 'Vidrio',
    categoria: 'VIDRIO',
    descripcion: 'Botellas, frascos y otros productos de vidrio reciclables',
    colorTacho: '#00CED1',
  },
  {
    nombre: 'Orgánico',
    categoria: 'ORGANICO',
    descripcion: 'Restos de comida, cáscaras y residuos biodegradables',
    colorTacho: '#228B22',
  },
];

async function main() {
  console.log('🌱 Seed Supabase — residuos...');

  for (const r of residuos) {
    const { error } = await supabase.from('residuos').upsert(r, { onConflict: 'categoria' });
    if (error) {
      console.error('❌', r.categoria, error.message);
      process.exit(1);
    }
    console.log('✅', r.nombre);
  }

  console.log('🎉 Seed completado');
}

main();
