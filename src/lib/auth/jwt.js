/**
 * JWT utility for generating and verifying tokens for webhook authorization
 */

/**
 * Generates a JWT token for the N8N webhook authorization
 * 
 * @param {Object} payload - The payload to include in the token
 * @param {string} payload.sessionId - The chat session ID (optional)
 * @param {string} payload.userId - The user ID (optional)
 * @param {number} expiresIn - Token expiration time in seconds (default: 5 minutes)
 * @returns {Promise<string>} - The generated JWT token
 */
export async function generateWebhookToken(payload, expiresIn = 300) {
  // Dynamically import jose library (it's a standard Web Crypto wrapper)
  const { SignJWT } = await import('jose');
  
  // Create payload with claims
  const jwtPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn,
    iss: 'legal-tutor-app', // Issuer
  };
  
  // Get JWT secret from environment
  const secret = new TextEncoder().encode(
    process.env.NEXT_PUBLIC_JWT_SECRET
  );
  
  if (!secret || secret.length === 0) {
    throw new Error('JWT secret is not configured properly');
  }
  
  // Generate and sign the token
  const token = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(secret);
    
  return token;
}
