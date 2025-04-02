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
  
  return { conversations: data || [], error };
}

/**
 * Obtiene una conversación específica con sus mensajes
 * 
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise} Conversación con mensajes y posible error
 */
export async function getConversationWithMessages(conversationId) {
  // Obtener la conversación
  const { data: conversation, error: conversationError } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', conversationId)
    .single();
  
  if (conversationError) {
    return { conversation: null, messages: [], error: conversationError };
  }
  
  // Obtener los mensajes de la conversación
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('chat_session_id', conversationId)
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
 * @param {string} title - Título de la conversación
 * @returns {Promise} Conversación creada y posible error
 */
export async function createConversation(userId, title) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId, title }])
    .select()
    .single();
  
  return { conversation: data, error };
}

/**
 * Actualiza el título de una conversación
 * 
 * @param {string} conversationId - ID de la conversación
 * @param {string} title - Nuevo título
 * @returns {Promise} Resultado de la operación
 */
export async function updateConversationTitle(conversationId, title) {
  const { data, error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date() })
    .eq('id', conversationId)
    .select()
    .single();
  
  return { conversation: data, error };
}

/**
 * Elimina una conversación
 * 
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise} Resultado de la operación
 */
export async function deleteConversation(conversationId) {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', conversationId);
  
  return { error };
}

/**
 * Añade un mensaje a una conversación
 * 
 * @param {string} conversationId - ID de la conversación
 * @param {string} role - Rol del mensaje (user, assistant, system)
 * @param {string} content - Contenido del mensaje
 * @returns {Promise} Mensaje añadido y posible error
 */
export async function addMessageToConversation(conversationId, role, content) {
  // Añadir el mensaje
  const { data: message, error: messageError } = await supabase
    .from('chat_messages')
    .insert([{ chat_session_id: conversationId, role, content }])
    .select()
    .single();
  
  if (messageError) {
    return { message: null, error: messageError };
  }
  
  // Actualizar la fecha de la conversación
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date() })
    .eq('id', conversationId);
  
  return { message, error: null };
}
