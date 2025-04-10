import { submitFeedback, getUserFeedback } from '@/lib/supabase/feedback';
import { createSupabaseClient } from '@/lib/supabase/client';

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createSupabaseClient: jest.fn(),
}));

describe('Feedback Supabase Functions', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    createSupabaseClient.mockReturnValue(mockSupabase);
  });

  describe('submitFeedback', () => {
    test('submits feedback with user ID when provided', async () => {
      const mockFeedbackData = {
        message: 'Test feedback',
        type: 'bug',
        pageUrl: '/test-page',
      };
      
      const userId = 'test-user-id';
      
      mockSupabase.single.mockResolvedValue({
        data: { id: 'new-feedback-id', ...mockFeedbackData, user_id: userId },
        error: null,
      });
      
      const result = await submitFeedback(mockFeedbackData, userId);
      
      expect(createSupabaseClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('user_feedback');
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        message: mockFeedbackData.message,
        type: mockFeedbackData.type,
        page_url: mockFeedbackData.pageUrl,
        user_id: userId,
      }));
      
      expect(result).toEqual(expect.objectContaining({
        id: 'new-feedback-id',
      }));
    });
    
    test('submits feedback without user ID for anonymous submissions', async () => {
      const mockFeedbackData = {
        message: 'Anonymous feedback',
        type: 'general',
      };
      
      mockSupabase.single.mockResolvedValue({
        data: { id: 'anonymous-feedback-id', ...mockFeedbackData, user_id: null },
        error: null,
      });
      
      await submitFeedback(mockFeedbackData);
      
      expect(mockSupabase.insert).toHaveBeenCalledWith(expect.objectContaining({
        message: mockFeedbackData.message,
        type: mockFeedbackData.type,
        user_id: null,
      }));
    });
    
    test('throws an error when submission fails', async () => {
      const mockError = new Error('Database error');
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: mockError,
      });
      
      await expect(submitFeedback({ message: 'Test' })).rejects.toThrow();
    });
  });
  
  describe('getUserFeedback', () => {
    test('retrieves feedback for a specific user', async () => {
      const userId = 'test-user-id';
      const mockFeedbackList = [
        { id: 'feedback-1', message: 'First feedback', user_id: userId },
        { id: 'feedback-2', message: 'Second feedback', user_id: userId },
      ];
      
      // Override select for this test since we're not calling single()
      mockSupabase.select.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockFeedbackList,
            error: null,
          }),
        }),
      });
      
      const result = await getUserFeedback(userId);
      
      expect(createSupabaseClient).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('user_feedback');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(result).toEqual(mockFeedbackList);
    });
    
    test('throws an error when retrieval fails', async () => {
      const mockError = new Error('Retrieval error');
      
      mockSupabase.select.mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: null,
            error: mockError,
          }),
        }),
      });
      
      await expect(getUserFeedback('user-id')).rejects.toThrow();
    });
  });
});
