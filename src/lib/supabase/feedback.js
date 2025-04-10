import { createSupabaseClient } from './client';

/**
 * Submits user feedback to the database
 * 
 * @param {Object} feedbackData - The feedback data to be submitted
 * @param {string} feedbackData.message - The feedback message content
 * @param {string} [feedbackData.type='general'] - The type of feedback (bug, suggestion, question, etc.)
 * @param {string} [feedbackData.pageUrl] - The URL of the page where feedback was submitted
 * @param {string} [userId] - Optional user ID for authenticated users
 * @returns {Promise<Object>} - The result of the insert operation
 */
export const submitFeedback = async (feedbackData, userId = null) => {
  const supabase = createSupabaseClient();
  
  // Prepare the feedback data
  const feedback = {
    message: feedbackData.message,
    type: feedbackData.type || 'general',
    page_url: feedbackData.pageUrl || null,
    user_id: userId,
    status: 'pending',
    created_at: new Date()
  };
  
  // Insert the feedback into the database
  const { data, error } = await supabase
    .from('user_feedback')
    .insert(feedback)
    .select()
    .single();
    
  if (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
  
  return data;
};

/**
 * Retrieves a user's feedback history
 * 
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} - The user's feedback submissions
 */
export const getUserFeedback = async (userId) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .from('user_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error retrieving user feedback:', error);
    throw error;
  }
  
  return data;
};
