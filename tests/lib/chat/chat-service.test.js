/**
 * Tests for the chat service
 */
import { sendMessageToN8N } from '@/lib/chat/chat-service';

// Mock global fetch
global.fetch = jest.fn();
global.process = {
  ...global.process,
  env: {
    ...global.process.env,
    NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL: 'https://example.com/n8n-webhook',
  },
};

describe('Chat Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test for expected use case
  test('should send message to N8N webhook and process response', async () => {
    // Mock successful response
    const mockResponse = {
      session_id: 'test-session-id',
      message: 'This is a response from the N8N webhook',
    };

    // Setup fetch mock
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Call the function
    const result = await sendMessageToN8N('Hello, this is a test message', null);

    // Check if fetch was called correctly
    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/n8n-webhook',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Hello, this is a test message',
          session_id: null,
        }),
      }
    );

    // Check if result is as expected
    expect(result).toEqual({
      sessionId: 'test-session-id',
      message: 'This is a response from the N8N webhook',
    });
  });

  // Test for edge case - existing session ID
  test('should include session ID in payload if provided', async () => {
    // Mock successful response
    const mockResponse = {
      session_id: 'existing-session-id',
      message: 'Response to existing session',
    };

    // Setup fetch mock
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    // Call the function with a session ID
    const result = await sendMessageToN8N('Message in existing session', 'existing-session-id');

    // Check if fetch was called with the session ID
    expect(fetch).toHaveBeenCalledWith(
      'https://example.com/n8n-webhook',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Message in existing session',
          session_id: 'existing-session-id',
        }),
      }
    );

    // Check if result is as expected
    expect(result).toEqual({
      sessionId: 'existing-session-id',
      message: 'Response to existing session',
    });
  });

  // Test for failure case
  test('should throw error when N8N webhook returns error', async () => {
    // Mock error response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    // Call the function and expect it to throw
    await expect(sendMessageToN8N('Message that causes error', null))
      .rejects
      .toThrow('N8N webhook error (500): Internal Server Error');
  });

  // Test for missing webhook URL
  test('should throw error when webhook URL is not configured', async () => {
    // Temporarily remove the webhook URL
    const originalEnv = { ...process.env };
    delete process.env.NEXT_PUBLIC_N8N_CHAT_WEBHOOK_URL;

    // Call the function and expect it to throw
    await expect(sendMessageToN8N('Test message', null))
      .rejects
      .toThrow('N8N webhook URL is not configured');

    // Restore the environment
    process.env = originalEnv;
  });
});
