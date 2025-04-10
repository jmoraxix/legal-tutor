/**
 * Token API Route - Generates JWT tokens for client-side API calls
 */
import { NextResponse } from 'next/server';
import { generateWebhookToken } from '@/lib/auth/jwt';

/**
 * POST handler for generating JWT tokens
 * Creates a token that can be used for N8N webhook authentication
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse>} The JSON response with the token
 */
export async function POST(request) {
  try {
    // Get token data from request
    const data = await request.json();
    const { sessionId, userId } = data;
    
    // Generate JWT token with server-side secret
    const token = await generateWebhookToken({
      sessionId,
      userId,
      // Add a small random component to prevent token reuse
      nonce: Math.random().toString(36).substring(2, 15),
    });
    
    // Return the token
    return NextResponse.json({ token });
    
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Error generating token' },
      { status: 500 }
    );
  }
}
