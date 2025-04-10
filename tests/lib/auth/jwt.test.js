/**
 * Test file for JWT utility functions
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateWebhookToken } from '@/lib/auth/jwt';

// Mock the jose library
vi.mock('jose', () => {
  return {
    SignJWT: vi.fn().mockImplementation(() => ({
      setProtectedHeader: vi.fn().mockReturnThis(),
      sign: vi.fn().mockResolvedValue('mock.jwt.token'),
    })),
  };
});

describe('JWT Utilities', () => {
  beforeEach(() => {
    // Mock environment variables
    process.env.NEXT_PUBLIC_JWT_SECRET = 'test-secret-key-for-jwt-validation';
    
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('generateWebhookToken', () => {
    it('should generate a valid JWT token with correct payload', async () => {
      const payload = {
        sessionId: 'test-session-id',
        userId: 'test-user-id',
      };
      
      const token = await generateWebhookToken(payload);
      
      // Check that the token was generated
      expect(token).toBe('mock.jwt.token');
    });
    
    it('should throw an error if JWT secret is not configured', async () => {
      // Remove the secret
      delete process.env.NEXT_PUBLIC_JWT_SECRET;
      
      const payload = {
        sessionId: 'test-session-id',
        userId: 'test-user-id',
      };
      
      // Should throw an error
      await expect(generateWebhookToken(payload)).rejects.toThrow('JWT secret is not configured properly');
    });
    
    it('should include expiration time in the token payload', async () => {
      // Mock Date.now to return a fixed timestamp
      const now = 1617984000000; // 2021-04-09T12:00:00.000Z
      const originalDateNow = Date.now;
      Date.now = vi.fn(() => now);
      
      // Jest spy on SignJWT constructor
      const { SignJWT } = require('jose');
      
      const payload = {
        sessionId: 'test-session-id',
        userId: 'test-user-id',
      };
      
      await generateWebhookToken(payload, 300); // 5 minutes expiration
      
      // Check that SignJWT was called with the correct payload
      const expectedPayload = {
        ...payload,
        iat: Math.floor(now / 1000),
        exp: Math.floor(now / 1000) + 300,
        iss: 'legal-tutor-app',
      };
      
      expect(SignJWT).toHaveBeenCalledWith(expect.objectContaining(expectedPayload));
      
      // Restore Date.now
      Date.now = originalDateNow;
    });
  });
});
