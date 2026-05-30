import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

/** Cliente público (anon). Respeta RLS. */
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  clientOptions
);

/** Cliente del servidor (service_role). Usado para todo el API. */
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  clientOptions
);
