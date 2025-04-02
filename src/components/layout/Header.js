"use client";

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import UserButton from '@/components/auth/UserButton';

/**
 * Shared Header component for consistent navigation across the app.
 * Displays different navigation options based on authentication state.
 *
 * @returns {React.ReactNode} The rendered header component
 */
export default function Header() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  
  // Helper to determine if link is active
  const isActive = (path) => pathname === path;
  
  return (
    <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-serif font-bold">
          Legal Tutor
        </Link>
        
        <nav className="flex items-center gap-6">
          <ul className="flex gap-6">
            {navLinks(isAuthenticated).map((link) => (
              <Fragment key={link.path}>
                {link.show && (
                  <li>
                    <Link
                      href={link.path}
                      className={`font-medium transition-colors ${
                        isActive(link.path)
                          ? "text-legal-900 dark:text-white"
                          : "text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                )}
              </Fragment>
            ))}
          </ul>
          <UserButton />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

/**
 * Returns an array of navigation links based on authentication state
 * 
 * @param {boolean} isAuthenticated - Whether the user is logged in
 * @returns {Array} Array of navigation link objects
 */
function navLinks(isAuthenticated) {
  return [
    { 
      path: "/chat", 
      label: "Chat", 
      show: isAuthenticated 
    },
    { 
      path: "/history", 
      label: "Mis Conversaciones", 
      show: isAuthenticated 
    },
    { 
      path: "/quiz", 
      label: "Quiz", 
      show: isAuthenticated 
    },
  ];
}
