"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { createConversation, addMessageToConversation, getConversationWithMessages } from "@/lib/supabase/conversations";
import { sendMessageToN8N } from "@/lib/chat/chat-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/layout/ChatLayout";
import { ChatMessage } from "@/components/chat/messages";

/**
 * ChatContent component - handles chat functionality for both new and existing conversations
 * 
 * @returns {React.ReactNode} The rendered chat content
 */
function ChatContent() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const searchParams = useSearchParams();
  const [isNewChat, setIsNewChat] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const router = useRouter();

  // Load the conversation if there's an ID in the query params
  useEffect(() => {
    const chatId = searchParams.get('id');
    const isNewParam = searchParams.get('new') === 'true';

    if (isNewParam) {
      // Reset chat state for new conversation
      setMessages([]);
      setSessionId(null);
      setConversation(null);
      setIsNewChat(true);
      setInput("");
      setError("");
      setCreatingSession(false);
      
      // Clean up the URL (remove the query parameter)
      if (typeof window !== 'undefined') {
        const url = window.location.pathname;
        window.history.replaceState({}, '', url);
      }
      return;
    }

    // If there's a chat ID and user is authenticated, load the conversation
    if (chatId && isAuthenticated) {
      const loadConversation = async () => {
        try {
          setIsLoading(true);
          setError("");

          const { conversation, messages, error } = await getConversationWithMessages(chatId);
          
          if (error) throw error;
          
          if (!conversation) {
            throw new Error("Conversación no encontrada");
          }
          
          // Verify the conversation belongs to current user
          if (conversation.user_id !== user?.id) {
            router.push('/history');
            return;
          }
          
          setConversation(conversation);
          setSessionId(conversation.id);
          setMessages(messages);
          setIsNewChat(false);
        } catch (err) {
          console.error("Error loading conversation:", err);
          setError("No se pudo cargar la conversación. " + err.message);
        } finally {
          setIsLoading(false);
        }
      };

      loadConversation();
    } else if (!chatId) {
      // If no chat ID, it's a new conversation
      setIsNewChat(true);
      setMessages([]);
      setSessionId(null);
      setConversation(null);
    }
  }, [searchParams, isAuthenticated, user, router]);

  /**
   * Handles sending a message in the chat.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || isSending || creatingSession) return;

    try {
      setIsSending(true);
      setError("");

      const userMessage = { sender_type: "user", content: input };

      // Add user message to UI immediately
      setMessages((prev) => [...prev, userMessage]);
      
      // No longer a new chat after the first message
      if (isNewChat) {
        setIsNewChat(false);
      }

      let currentSessionId = sessionId;

      // If authenticated user and first message in a new chat, create a new session
      if (isAuthenticated && !currentSessionId && !conversation && !creatingSession) {
        // Set creating session flag to prevent loops
        setCreatingSession(true);

        try {
          const { conversation: newConversation, error: convError } = await createConversation(user.id);

          if (convError) throw convError;

          currentSessionId = newConversation.id;
          setSessionId(currentSessionId);
          setConversation(newConversation);

          // Update URL with the new session ID without reloading
          const url = `/chat?id=${currentSessionId}`;
          window.history.pushState({}, '', url);

          // Save user message
          await addMessageToConversation(
            currentSessionId,
            "user",
            input
          );

          // Send message to N8N webhook
          const response = await sendMessageToN8N(input, currentSessionId);

          // Create AI response message
          const botMessage = {
            sender_type: "AI",
            content: response.message
          };

          // Add AI response to UI
          setMessages((prev) => [...prev, botMessage]);

          // Clear input field
          setInput("");
        } catch (err) {
          console.error("Error creating session:", err);
          setError("Error creating session: " + err.message);

          // Add system error message
          const errorMessage = {
            sender_type: "system",
            content: "Ocurrió un error al crear la sesión. Por favor, intenta de nuevo."
          };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setCreatingSession(false);
        }
      }
      // If already have a session ID
      else if (isAuthenticated && currentSessionId) {
        // Save user message
        await addMessageToConversation(
          currentSessionId,
          "user",
          input
        );

        // Clear input field
        setInput("");

        // Send message to N8N webhook
        const response = await sendMessageToN8N(input, currentSessionId);

        // Create AI response message
        const botMessage = {
          sender_type: "AI",
          content: response.message
        };

        // Add AI response to UI
        setMessages((prev) => [...prev, botMessage]);
      }
      // If not authenticated
      else if (!isAuthenticated) {
        // Clear input field
        setInput("");

        // Send message to N8N webhook without a session ID
        const response = await sendMessageToN8N(input, null);

        // Create AI response message
        const botMessage = {
          sender_type: "AI",
          content: response.message
        };

        // Add AI response to UI
        setMessages((prev) => [...prev, botMessage]);
      }

    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      setError("");

      // Add system error message to UI without saving to DB
      const systemErrorMessage = {
        sender_type: "system",
        content: "Ocurrió un error al procesar tu mensaje. Por favor, intenta de nuevo."
      };
      setMessages((prev) => [...prev, systemErrorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto shadow-legal">
        <CardHeader className="border-b bg-white dark:bg-slate-900">
          <CardTitle className="font-serif text-legal-800 dark:text-legal-200">
            {isLoading ? "Cargando..." : conversation?.session_title || "Consulta Legal"}
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
          {error && (
            <div className="w-full mb-2 p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full relative">
            <div className="flex gap-2">
              <div className="flex-1 relative group">   
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu consulta legal aquí..."
                disabled={isLoading || isSending || creatingSession}
                className="w-full"
                title={isNewChat ? "¡Bienvenido al Chat de Legal Tutor! Puedes hacerme cualquier consulta sobre temas legales en Costa Rica." : ""}
                aria-describedby={isNewChat ? "welcome-tooltip" : ""}
              />
              {isNewChat && (
                <div id="welcome-tooltip" className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-slate-800 border border-legal-200 dark:border-legal-700 rounded shadow-md text-sm max-w-xs invisible group-hover:visible transition-all duration-200">
                  ¡Bienvenido al Chat de Legal Tutor! Puedes hacerme cualquier consulta sobre temas legales en Costa Rica.
                </div>
              )}
            </div>
              <Button
                type="submit"
                disabled={isLoading || isSending || creatingSession}
                className="bg-legal-600 hover:bg-legal-500 dark:bg-legal-400 dark:hover:bg-legal-300 dark:text-slate-900"
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
    </div>
  );
}

/**
 * Chat page component for general legal queries.
 * Wraps the ChatContent in a Suspense boundary to handle useSearchParams.
 *
 * @returns {React.ReactNode} The rendered chat page
 */
export default function ChatPage() {
  return (
    <ChatLayout>
      <Suspense fallback={
        <div className="flex-1 container mx-auto py-8 px-4">
          <div className="w-full max-w-4xl mx-auto p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-legal-200 dark:bg-legal-700 rounded w-1/3 mx-auto"></div>
              <div className="h-64 bg-legal-100 dark:bg-legal-800 rounded"></div>
              <div className="h-10 bg-legal-200 dark:bg-legal-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      }>
        <ChatContent />
      </Suspense>
    </ChatLayout>
  );
}
