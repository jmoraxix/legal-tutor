"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

/**
 * Componente de botón de cierre de sesión dedicado
 *
 * @returns {React.ReactNode} Componente React
 */
export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  /**
   * Maneja el proceso de cierre de sesión
   */
  const handleLogout = async () => {
    await logout();
    // Force a complete refresh of the page to ensure state is reset
    window.location.href = "/";
  };

  // Solo mostrar cuando el usuario está autenticado
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="text-legal-600 hover:text-legal-900 hover:bg-legal-100 dark:text-legal-300 dark:hover:text-white dark:hover:bg-legal-800 flex items-center gap-1"
      title="Cerrar Sesión"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Cerrar Sesión</span>
    </Button>
  );
}
