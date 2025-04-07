/**
 * Example webhook handler for n8n integration
 * This can be triggered by your n8n workflows for chat processing
 */
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the incoming request body
    const payload = JSON.parse(event.body);
    console.log('Received webhook:', JSON.stringify(payload));

    // Example: Process a chat message from n8n
    if (payload.type === 'chat_message') {
      // Process the message
      // In a real implementation, you might:
      // 1. Save to Supabase
      // 2. Process with an AI service
      // 3. Return structured data
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: 'Webhook processed successfully',
          data: {
            // Example response data
            messageId: payload.messageId || 'unknown',
            processed: true,
            timestamp: new Date().toISOString(),
          }
        }),
      };
    }

    // Default response for other webhook types
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Webhook received',
        webhookType: payload.type || 'unknown',
      }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};
