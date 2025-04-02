"use client";

import { useAuth } from '@/context/auth';
import Header from './Header';
import ChatSidebar from '@/components/chat/ChatSidebar';

/**
 * Layout específico para la sección de chat que incluye la barra lateral
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 * @returns {React.ReactNode} El layout renderizado
 */
export default function ChatLayout({ children }) {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && <ChatSidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
