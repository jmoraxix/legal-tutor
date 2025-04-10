"use client";

import { useAuth } from '@/context/auth';

/**
 * Hook to access the currently authenticated user
 * 
 * @returns {Object} Object with user data and loading state
 * @returns {Object|null} user - Current user data or null if not authenticated
 * @returns {boolean} isLoading - Whether authentication state is still loading
 */
export const useUser = () => {
  const { user, loading } = useAuth();
  
  return { user, isLoading: loading };
};
