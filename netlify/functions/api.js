/**
 * Netlify serverless function handler for API routes
 * This acts as a catch-all handler for your Next.js API routes
 */
exports.handler = async (event, context) => {
  // Log the request details for debugging
  console.log(`API request: ${event.path}, method: ${event.httpMethod}`);
  
  try {
    // You can include specific logic for different API routes here
    // Example: Handle a specific API route
    if (event.path.startsWith('/.netlify/functions/api/health')) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
      };
    }

    // Default response - in production, you'd map to actual Next.js API handlers
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Legal Tutor API', 
        path: event.path,
        method: event.httpMethod,
        query: event.queryStringParameters || {},
      }),
    };
  } catch (error) {
    console.error('API error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
