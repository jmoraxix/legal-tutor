import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client instance.
 *
 * @returns {Object} Supabase client.
 */
export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and key must be provided');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};
