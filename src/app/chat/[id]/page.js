"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { getConversationWithMessages, addMessageToConversation } from "@/lib/supabase/conversations";
import { sendMessageToN8N } from "@/lib/chat/chat-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/layout/ChatLayout";
import { ChatMessage } from "@/components/chat/messages";

/**
 * Page component for displaying and continuing a specific conversation.
 *
 * @param {Object} props - Component props
 * @param {Object} props.params - Route parameters
 * @param {string} props.params.id - Conversation ID from the URL
 * @returns {React.ReactNode} The rendered conversation page
 */
export default function ConversationPage({ params }) {
  const { id } = params;
  const { user, isAuthenticated } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Cargar la conversación y mensajes al inicio
  useEffect(() => {
    async function loadConversation() {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      try {
        setIsLoading(true);
        setError("");
        
        const { conversation, messages, error } = await getConversationWithMessages(id);
        
        if (error) throw error;
        
        if (!conversation) {
          throw new Error("Conversación no encontrada");
        }
        
        // Verificar que la conversación pertenece al usuario actual
        if (conversation.user_id !== user?.id) {
          router.push('/history');
          return;
        }
        
        setConversation(conversation);
        setMessages(messages);
      } catch (err) {
        console.error("Error al cargar conversación:", err);
        setError("No se pudo cargar la conversación. " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (isAuthenticated) {
      loadConversation();
    }
  }, [id, isAuthenticated, user, router]);

  /**
   * Handles sending a new message in the existing conversation.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !conversation) return;
    
    try {
      setIsSending(true);
      setError("");
      
      const userMessage = { sender_type: "user", content: input };
      
      // Add user message to UI
      setMessages((prev) => [...prev, userMessage]);
      
      // Save user message to database
      await addMessageToConversation(
        conversation.id,
        "user",
        input
      );
      
      // Clear input field
      setInput("");
      
      // Send message to N8N webhook
      const response = await sendMessageToN8N(input, conversation.id);
      
      // Create AI response message
      const botMessage = {
        sender_type: "AI",
        content: response.message
      };
      
      // No longer saving AI responses
      
      // Add AI response to UI
      setMessages((prev) => [...prev, botMessage]);
      
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("");
      
      // Add system error message to UI without saving to DB
      const systemErrorMessage = {
        sender_type: "system",
        content: "Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo."
      };
      
      // Add system message to UI
      setMessages((prev) => [...prev, systemErrorMessage]);
      
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <ChatLayout>
      <div className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">
              {isLoading ? "Cargando..." : conversation?.title || "Conversación"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6 h-[60vh] overflow-y-auto bg-white dark:bg-slate-900">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-legal-400 animate-bounce"></div>
                    <div className="w-3 h-3 rounded-full bg-legal-400 animate-bounce delay-75"></div>
                    <div className="w-3 h-3 rounded-full bg-legal-400 animate-bounce delay-150"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center p-4 text-red-600 dark:text-red-400">
                  {error}
                </div>
              ) : (
                <>
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
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
                </>
              )}
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t bg-white dark:bg-slate-900">
            {error && !isLoading && (
              <div className="w-full mb-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-2">
                <div className="flex-1 relative group">  
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Escribe tu consulta legal aquí..."
                    disabled={isLoading || isSending}
                    className="w-full"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || isSending}
                  className="bg-legal-600 hover:bg-legal-500 dark:bg-legal-400 dark:hover:bg-legal-300 dark:text-slate-900"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </div>
    </ChatLayout>
  );
}
