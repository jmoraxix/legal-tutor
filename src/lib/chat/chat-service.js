/**
 * Service for handling chat communication with N8N webhooks
 * Includes JWT authentication for secure webhook communication
 */

// Server-side JWT generation now happens via API

/**
 * Sends a message to the N8N webhook and processes the response
 *
 * @param {string} message - The user's message content
 * @param {string|null} sessionId - The chat session ID (null for new sessions)
 * @returns {Promise<Object>} - The processed response with sessionId and message
 */
export async function sendMessageToN8N(message, sessionId = null, userId = null) {
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

    // Get JWT token from the API
    const tokenResponse = await fetch('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userId,
      }),
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`Token generation error: ${tokenResponse.status}`);
    }
    
    const { token } = await tokenResponse.json();

    // Including Authorization header triggers a CORS preflight request
    // We'll make sure our fetch request is properly configured
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // Add the below header if your N8N is configured to check origin
        'Origin': typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000'
      },
      // Enable CORS mode
      //mode: 'cors',
      // Include credentials if your N8N requires cookies/auth to be passed
      // credentials: 'include', // Uncomment if needed
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
