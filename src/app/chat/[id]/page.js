"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { getConversationWithMessages, addMessageToConversation } from "@/lib/supabase/conversations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/components/auth/UserButton";

/**
 * Página de conversación específica
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.params - Parámetros de la ruta
 * @param {string} props.params.id - ID de la conversación
 * @returns {React.ReactNode} Componente de página
 */
export default function ConversationPage({ params }) {
  const { id } = params;
  const { user, loading, isAuthenticated } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Cargar conversación y mensajes
  useEffect(() => {
    async function loadConversation() {
      if (!user || !id) return;
      
      try {
        setIsLoading(true);
        setError("");
        
        const { conversation, messages, error } = await getConversationWithMessages(id);
        
        if (error) throw error;
        
        // Verificar que la conversación pertenece al usuario
        if (conversation.user_id !== user.id) {
          router.push("/historial");
          return;
        }
        
        setConversation(conversation);
        setMessages(messages);
      } catch (err) {
        console.error("Error al cargar conversación:", err);
        setError("No se pudo cargar la conversación. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user && id) {
      loadConversation();
    }
  }, [user, id, router]);

  /**
   * Maneja el envío de un mensaje
   * 
   * @param {Event} e - Evento de formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !conversation) return;
    
    try {
      setIsSending(true);
      
      // Añadir mensaje del usuario
      const userContent = input;
      setInput("");
      
      // Optimistic update
      const tempUserMessage = { 
        id: `temp-${Date.now()}`, 
        role: "user", 
        content: userContent,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMessage]);
      
      // Enviar mensaje a la base de datos
      const { message: userMessage, error: userError } = await addMessageToConversation(
        conversation.id, 
        "user", 
        userContent
      );
      
      if (userError) throw userError;
      
      // Aquí iría la llamada a n8n para procesar el mensaje
      // Simulamos una respuesta después de un retraso
      setTimeout(async () => {
        const assistantContent = "Esta es una respuesta de ejemplo. En la implementación real, esta respuesta vendría de n8n después de procesar tu consulta con IA y documentos legales de Costa Rica.";
        
        // Guardar respuesta del asistente
        const { message: assistantMessage, error: assistantError } = await addMessageToConversation(
          conversation.id,
          "assistant",
          assistantContent
        );
        
        if (assistantError) throw assistantError;
        
        // Actualizar mensajes
        setMessages(prev => [...prev, assistantMessage]);
        setIsSending(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("Error al enviar el mensaje. Intenta de nuevo.");
      setIsSending(false);
    }
  };

  // Mostrar spinner mientras carga
  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-legal-600 border-r-transparent dark:border-legal-400 dark:border-r-transparent"></div>
          <p className="mt-4 text-legal-600 dark:text-legal-400">Cargando conversación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-serif font-bold">
            Legal Tutor
          </Link>
          <nav className="flex items-center gap-6">
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/historial" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                  Historial
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                  Quiz
                </Link>
              </li>
            </ul>
            <UserButton />
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">
              {conversation?.title || "Conversación"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6 h-[60vh] overflow-y-auto bg-white dark:bg-slate-900">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                      message.role === "user"
                        ? "bg-legal-800 text-white dark:bg-legal-700"
                        : message.role === "system"
                        ? "bg-legal-100 dark:bg-legal-800 border border-legal-200 dark:border-legal-700 text-legal-800 dark:text-legal-200"
                        : "bg-legal-100 dark:bg-legal-800 border border-legal-200 dark:border-legal-700 text-legal-800 dark:text-legal-200"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-legal-100 dark:bg-legal-800 border border-legal-200 dark:border-legal-700 text-legal-800 dark:text-legal-200 shadow-sm">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-legal-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-legal-400 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-legal-400 animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t bg-white dark:bg-slate-900">
            {error && (
              <div className="w-full mb-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu consulta legal aquí..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isSending || !input.trim()}
                  className="bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </main>

      <footer className="border-t py-4 bg-white dark:bg-slate-900 shadow-md">
        <div className="container mx-auto text-center text-sm text-legal-500">
          <p>&copy; {new Date().getFullYear()} Ayzek Studio. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 mt-2">
            <Link href="/terminos" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Términos</Link>
            <Link href="/privacidad" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Privacidad</Link>
            <Link href="/contacto" className="text-legal-500 hover:text-legal-700 dark:hover:text-legal-300">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
