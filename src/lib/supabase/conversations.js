import { createSupabaseClient } from './client';

const supabase = createSupabaseClient();

/**
 * Obtiene todas las conversaciones de un usuario
 *
 * @param {string} userId - ID del usuario
 * @returns {Promise} Conversaciones y posible error
 */
export async function getUserConversations(userId) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

    // console.log(data, error);

  return { conversations: data || [], error };
}

/**
 * Obtiene una conversación específica con sus mensajes
 *
 * @param {string} sessionId - ID de la sesión de chat
 * @returns {Promise} Conversación con mensajes y posible error
 */
export async function getConversationWithMessages(sessionId) {
  // Obtener la conversación
  const { data: conversation, error: conversationError } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (conversationError) {
    return { conversation: null, messages: [], error: conversationError };
  }

  // Obtener los mensajes de la conversación
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  return {
    conversation,
    messages: messages || [],
    error: messagesError
  };
}

/**
 * Crea una nueva conversación
 *
 * @param {string} userId - ID del usuario
 * @param {string} session_title - Título de la sesión de chat
 * @returns {Promise} Conversación creada y posible error
 */
export async function createConversation(userId) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId }])
    .select()
    .single();

  return { conversation: data, error };
}

/**
 * Actualiza el título de una conversación
 *
 * @param {string} sessionId - ID de la sesión de chat
 * @param {string} session_title - Nuevo título
 * @returns {Promise} Resultado de la operación
 */
export async function updateConversationTitle(sessionId, session_title) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update({ session_title, updated_at: new Date() })
    .eq('id', sessionId)
    .select()
    .single();

  return { conversation: data, error };
}

/**
 * Elimina una conversación
 *
 * @param {string} sessionId - ID de la sesión de chat
 * @returns {Promise} Resultado de la operación
 */
export async function deleteConversation(sessionId) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  return { error };
}

/**
 * Añade un mensaje a una conversación
 *
 * @param {string} sessionId - ID de la sesión de chat
 * @param {string} sender_type - Tipo de remitente (user, AI)
 * @param {string} content - Contenido del mensaje
 * @returns {Promise} Mensaje añadido y posible error
 */
export async function addMessageToConversation(sessionId, sender_type, content) {
  // Añadir el mensaje
  const { data: message, error: messageError } = await supabase
    .from('chat_messages')
    .insert([{ session_id: sessionId, sender_type, content }])
    .select()
    .single();

  if (messageError) {
    return { message: null, error: messageError };
  }

  // Actualizar la fecha de la conversación
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date() })
    .eq('id', sessionId);

  return { message, error: null };
}
