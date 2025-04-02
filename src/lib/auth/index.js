import { createSupabaseClient } from '@/lib/supabase/client';

/**
 * Cliente de Supabase para autenticación
 */
const supabase = createSupabaseClient();

/**
 * Registra un nuevo usuario con email y contraseña
 *
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Resultado de la operación
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Inicia sesión con email y contraseña
 * 
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Resultado de la operación
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

/**
 * Cierra la sesión del usuario actual
 * 
 * @returns {Promise} Resultado de la operación
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Obtiene el usuario actualmente autenticado
 * 
 * @returns {Promise} Datos del usuario y posible error
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Recupera la información del perfil de usuario
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise} Datos del perfil y posible error
 */
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { profile: data, error };
}

/**
 * Actualiza el perfil de un usuario
 * 
 * @param {string} userId - ID del usuario
 * @param {Object} updates - Campos a actualizar
 * @returns {Promise} Resultado de la operación
 */
export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  return { data, error };
}

/**
 * Configura un listener para cambios en el estado de autenticación
 * 
 * @param {Function} callback - Función a ejecutar cuando cambie el estado
 * @returns {Function} Función para eliminar el listener
 */
export function onAuthStateChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      callback(session, event);
    }
  );
  
  return () => {
    subscription.unsubscribe();
  };
}
