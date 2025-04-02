import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

/**
 * Next.js middleware that handles authentication redirects and session refresh.
 * - Refreshes auth cookies on each request
 * - Unauthenticated users viewing protected routes are redirected to login
 * - Authenticated users visiting the homepage are redirected to the dashboard
 * 
 * @param {Object} req - Next.js request object
 * @returns {NextResponse} Next.js response object
 */
export async function middleware(req) {
  const res = NextResponse.next();
  
  // Create a Supabase client specifically for this middleware
  const supabase = createMiddlewareClient({ req, res });
  
  // This will refresh the session cookie if needed
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth session error:', error.message);
  }
  
  const isAuthenticated = !!session;
  const { pathname } = req.nextUrl;
  
  // Add debug response header
  res.headers.set('X-Auth-Status', isAuthenticated ? 'authenticated' : 'unauthenticated');
  
  // Protected routes that require authentication
  const protectedRoutes = ['/history', '/profile', '/chat', '/quiz'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Public routes that should redirect to dashboard if authenticated
  const isHomePage = pathname === '/';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }
  
  // Redirect authenticated users from homepage or auth pages to chat
  if ((isHomePage || isAuthPage) && isAuthenticated) {
    return NextResponse.redirect(new URL('/chat', req.url));
  }
  
  return res;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ['/', '/history/:path*', '/profile/:path*', '/login', '/register', '/chat/:path*', '/quiz/:path*']
};
