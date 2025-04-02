"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { createConversation, addMessageToConversation } from "@/lib/supabase/conversations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import UserButton from "@/components/auth/UserButton";

/**
 * Chat page component for general legal queries.
 *
 * @returns {React.ReactNode} The rendered chat page
 */
export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: "¡Bienvenido al Chat de Legal Tutor! Puedes hacerme cualquier consulta sobre temas legales en Costa Rica."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Handles sending a message in the chat.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    try {
      setIsLoading(true);
      setError("");
      
      const userMessage = { role: "user", content: input };
      
      // Si es el primer mensaje del usuario y está autenticado, crear una nueva conversación
      if (isAuthenticated && !conversationId && messages.length === 1) {
        // El primer mensaje será el título de la conversación (truncado)
        const title = input.length > 50 ? `${input.substring(0, 50)}...` : input;
        
        const { conversation, error: convError } = await createConversation(user.id, title);
        
        if (convError) throw convError;
        
        setConversationId(conversation.id);
        
        // Guardar el mensaje del sistema inicial
        await addMessageToConversation(
          conversation.id,
          "system",
          messages[0].content
        );
        
        // Guardar el mensaje del usuario
        await addMessageToConversation(
          conversation.id,
          "user",
          input
        );
      } else if (isAuthenticated && conversationId) {
        // Si ya hay una conversación, añadir el mensaje
        await addMessageToConversation(
          conversationId,
          "user",
          input
        );
      }
      
      // Add user message to chat (UI)
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      
      // Simulamos respuesta del asistente
      setTimeout(async () => {
        const assistantContent = "Esta es una respuesta de ejemplo. En la implementación real, esta respuesta vendría de n8n después de procesar tu consulta con IA y documentos legales de Costa Rica.";
        
        const botMessage = {
          role: "assistant",
          content: assistantContent
        };
        
        // Guardar la respuesta si está autenticado
        if (isAuthenticated && conversationId) {
          await addMessageToConversation(
            conversationId,
            "assistant",
            assistantContent
          );
        }
        
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("Ocurrió un error al procesar tu mensaje. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

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
              {isAuthenticated && (
                <li>
                  <Link href="/historial" className="text-legal-600 hover:text-legal-900 dark:text-legal-300 dark:hover:text-white font-medium">
                    Historial
                  </Link>
                </li>
              )}
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
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">Consulta Legal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6 h-[60vh] overflow-y-auto bg-white dark:bg-slate-900">
              {messages.map((message, index) => (
                <div 
                  key={index} 
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
              {isLoading && (
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
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                >
                  Enviar
                </Button>
              </div>
              {!isAuthenticated && (
                <div className="mt-2 text-sm text-legal-500">
                  <Link href="/login" className="text-legal-700 hover:text-legal-900 dark:text-legal-400 dark:hover:text-legal-200 font-medium">
                    Inicia sesión
                  </Link> para guardar tus conversaciones y acceder a tu historial.
                </div>
              )}
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
