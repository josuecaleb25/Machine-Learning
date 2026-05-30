import { supabase } from '../config/supabase.js';
import { handleDbError, USER_PUBLIC_FIELDS } from '../utils/supabaseDb.js';

const USER_WITH_SECRETS =
  'id, nombre, email, passwordHash, facialEmbedding, authMethod, avatarUrl, createdAt, updatedAt';

export const userRepository = {
  async findById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(USER_PUBLIC_FIELDS)
      .eq('id', id)
      .maybeSingle();

    handleDbError(error, 'Error al buscar usuario');
    return data;
  },

  async findByIdWithSecrets(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(USER_WITH_SECRETS)
      .eq('id', id)
      .maybeSingle();

    handleDbError(error, 'Error al buscar usuario');
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(USER_PUBLIC_FIELDS)
      .eq('email', email)
      .maybeSingle();

    handleDbError(error, 'Error al buscar email');
    return data;
  },

  async findByEmailForAuth(email) {
    const { data, error } = await supabase
      .from('usuarios')
      .select(USER_WITH_SECRETS)
      .eq('email', email)
      .maybeSingle();

    handleDbError(error, 'Error al buscar email');
    return data;
  },

  async findAllWithFacialEmbeddings() {
    const { data, error } = await supabase
      .from('usuarios')
      .select(USER_WITH_SECRETS)
      .not('facialEmbedding', 'is', null);

    handleDbError(error, 'Error al listar usuarios faciales');
    return data ?? [];
  },

  async create(payload) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert({
        nombre: payload.nombre,
        email: payload.email ?? null,
        passwordHash: payload.passwordHash ?? null,
        facialEmbedding: payload.facialEmbedding ?? null,
        authMethod: payload.authMethod,
        avatarUrl: payload.avatarUrl ?? null,
      })
      .select(USER_PUBLIC_FIELDS)
      .single();

    handleDbError(error, 'Error al crear usuario');
    return data;
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', id)
      .select(USER_PUBLIC_FIELDS)
      .single();

    handleDbError(error, 'Error al actualizar usuario');
    return data;
  },
};
