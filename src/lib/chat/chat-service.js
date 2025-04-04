/**
 * Service for handling chat communication with N8N webhooks
 */

/**
 * Sends a message to the N8N webhook and processes the response
 * 
 * @param {string} message - The user's message content
 * @param {string|null} sessionId - The chat session ID (null for new sessions)
 * @returns {Promise<Object>} - The processed response with sessionId and message
 */
export async function sendMessageToN8N(message, sessionId = null) {
  try {
    const webhookUrl = process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('N8N webhook URL is not configured');
    }
    
    // Build payload - only include session_id if it's non-null
    const payload = {
      message,
      ...(sessionId && { session_id: sessionId }),
    };
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8N webhook error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    
    // If n8n didn't return a message, provide a default
    if (!data.message) {
      data.message = "Lo siento, hubo un problema al procesar tu consulta. Por favor intenta de nuevo.";
    }
    
    // The n8n webhook should return the session_id and response message
    return {
      sessionId: data.session_id || sessionId,
      message: data.message,
    };
  } catch (error) {
    console.error('Error sending message to N8N:', error);
    throw error;
  }
}
