/**
 * Chat API Route - Proxy between frontend and N8N webhook
 * This avoids CORS issues by making the N8N request from the server side
 */
import { NextResponse } from 'next/server';
import { generateWebhookToken } from '@/lib/auth/jwt';

/**
 * POST handler for chat messages
 * Receives message from client, adds JWT, forwards to N8N, and returns response
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The JSON response
 */
export async function POST(request) {
  try {
    // Get message data from request
    const data = await request.json();
    const { message, sessionId, userId } = data;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Generate JWT token
    const token = await generateWebhookToken({
      sessionId,
      userId,
      // Add a small random component to prevent token reuse
      nonce: Math.random().toString(36).substring(2, 15),
    });
    
    // Get N8N webhook URL from server environment
    // Note: We use a server-side env var here, not NEXT_PUBLIC_*
    const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error('N8N webhook URL is not configured');
      return NextResponse.json(
        { error: 'Server misconfiguration' },
        { status: 500 }
      );
    }
    
    // Prepare payload for N8N
    const payload = {
      message,
      ...(sessionId && { session_id: sessionId }),
    };
    
    // Forward the request to N8N with JWT token
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });
    
    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error(`N8N webhook error (${n8nResponse.status}): ${errorText}`);
      return NextResponse.json(
        { 
          error: 'Error processing message',
          message: 'Lo siento, hubo un problema al procesar tu consulta. Por favor intenta de nuevo.'
        },
        { status: n8nResponse.status }
      );
    }
    
    // Parse N8N response
    const responseData = await n8nResponse.json();
    
    // If n8n didn't return a message, provide a default
    if (!responseData.message) {
      responseData.message = "Lo siento, hubo un problema al procesar tu consulta. Por favor intenta de nuevo.";
    }
    
    // Return the response from N8N
    return NextResponse.json({
      sessionId: responseData.session_id || sessionId,
      message: responseData.message,
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Error processing message',
        message: 'Lo siento, hubo un problema al procesar tu consulta. Por favor intenta de nuevo.'
      },
      { status: 500 }
    );
  }
}
