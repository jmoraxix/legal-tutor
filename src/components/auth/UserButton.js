"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";

/**
 * Componente de botón de usuario para navegar a login/registro o mostrar menú de usuario
 *
 * @returns {React.ReactNode} Componente React
 */
export default function UserButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    // Force a complete refresh of the page to ensure state is reset
    window.location.href = "/";
  };

  // Si no está autenticado, mostrar botones de login/registro
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link 
          href="/login" 
          className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white"
        >
          Iniciar Sesión
        </Link>
        <Link 
          href="/register" 
          className="bg-legal-800 hover:bg-legal-700 text-white px-4 py-2 rounded-md transition-colors dark:bg-legal-700 dark:hover:bg-legal-600"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white"
      >
        <div className="w-8 h-8 rounded-full bg-legal-200 dark:bg-legal-700 flex items-center justify-center">
          {profile?.first_name ? profile.first_name[0].toUpperCase() : user?.email[0].toUpperCase()}
        </div>
        <span>
          {profile?.first_name || user?.email.split("@")[0]}
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-legal-800 rounded-md shadow-lg py-1 z-10 border border-legal-200 dark:border-legal-700">
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-legal-700 hover:bg-legal-100 dark:text-legal-300 dark:hover:bg-legal-700"
            onClick={() => {
              setIsMenuOpen(false); 
              // Ensure we only navigate to profile if authenticated
              if (!isAuthenticated) {
                router.push('/login');
              }
            }}
          >
            Mi Perfil
          </Link>
          <Link 
            href="/history" 
            className="block px-4 py-2 text-sm text-legal-700 hover:bg-legal-100 dark:text-legal-300 dark:hover:bg-legal-700"
            onClick={() => setIsMenuOpen(false)}
          >
            Mis Conversaciones
          </Link>
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-legal-700 hover:bg-legal-100 dark:text-legal-300 dark:hover:bg-legal-700"
          >
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
