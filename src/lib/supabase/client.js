import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

/**
 * Creates a Supabase client instance optimized for client components.
 * Uses auth-helpers-nextjs which correctly manages session cookies.
 *
 * @returns {Object} Supabase client.
 */
export const createSupabaseClient = () => {
  // createClientComponentClient automatically uses env variables and handles cookies
  return createClientComponentClient();
};
