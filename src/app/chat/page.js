"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { createConversation, addMessageToConversation } from "@/lib/supabase/conversations";
import { sendMessageToN8N } from "@/lib/chat/chat-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/layout/ChatLayout";
import { ChatMessage } from "@/components/chat/messages";

/**
 * Chat page component for general legal queries.
 *
 * @returns {React.ReactNode} The rendered chat page
 */
export default function ChatPage() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const router = useRouter();

  /**
   * Handles sending a message in the chat.
   *
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || isLoading || creatingSession) return;

    try {
      setIsLoading(true);
      setError("");

      const userMessage = { sender_type: "user", content: input };

      // Add user message to UI immediately
      setMessages((prev) => [...prev, userMessage]);
      
      // No longer a new chat after the first message
      if (isNewChat) {
        setIsNewChat(false);
      }

      let currentSessionId = sessionId;

      // If authenticated user and first message, create a new session
      if (isAuthenticated && !currentSessionId && messages.length === 1 && !creatingSession) {
        // Set creating session flag to prevent loops
        setCreatingSession(true);

        try {
          const { conversation, error: convError } = await createConversation(user.id);

          if (convError) throw convError;

          currentSessionId = conversation.id;
          setSessionId(currentSessionId);

          // No longer saving system welcome message

          // Save user message
          await addMessageToConversation(
            currentSessionId,
            "user",
            input
          );

          // Send message to N8N webhook with the new session ID
          const response = await sendMessageToN8N(input, currentSessionId);

          // Create AI response message
          const botMessage = {
            sender_type: "AI",
            content: response.message
          };

          // No longer saving AI responses

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

        // No longer saving AI responses

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

      // No longer needed as we already add the system error message above

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatLayout>
      <div className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">Consulta Legal</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-4 p-6 h-[60vh] overflow-y-auto bg-white dark:bg-slate-900">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
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
            <form onSubmit={handleSubmit} className="w-full relative">
              <div className="flex gap-2">
                <div className="flex-1 relative group">   
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu consulta legal aquí..."
                  disabled={isLoading || creatingSession}
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
                  disabled={isLoading || creatingSession}
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
    </ChatLayout>
  );
}
