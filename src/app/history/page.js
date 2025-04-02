"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth";
import { getUserConversations } from "@/lib/supabase/conversations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ConversationItem from "@/components/conversation/ConversationItem";
import PageLayout from "@/components/layout/PageLayout";

/**
 * History page for user conversations
 * 
 * @returns {React.ReactNode} Page component
 */
export default function HistoryPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError("");
        
        const { conversations, error } = await getUserConversations(user.id);
        
        if (error) throw error;
        
        setConversations(conversations);
      } catch (err) {
        console.error("Error al cargar conversaciones:", err);
        setError("No se pudieron cargar las conversaciones. Intenta de nuevo más tarde.");
      } finally {
        setIsLoading(false);
      }
    }
    
    if (user) {
      loadConversations();
    }
  }, [user]);

  /**
   * Handles the deletion of a conversation
   * 
   * @param {string} conversationId - ID of the deleted conversation
   */
  const handleConversationDelete = (conversationId) => {
    setConversations(conversations.filter(conv => conv.id !== conversationId));
  };

  // Show spinner while loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-legal-600 border-r-transparent dark:border-legal-400 dark:border-r-transparent"></div>
          <p className="mt-4 text-legal-600 dark:text-legal-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout>

      <main className="flex-1 container mx-auto py-8 px-4">
        <Card className="w-full max-w-4xl mx-auto shadow-legal">
          <CardHeader className="border-b bg-white dark:bg-slate-900">
            <CardTitle className="font-serif text-legal-800 dark:text-legal-200">Mis Conversaciones</CardTitle>
            <CardDescription>
              Accede a tus conversaciones anteriores
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 divide-y divide-legal-200 dark:divide-legal-700">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-legal-600 border-r-transparent dark:border-legal-400 dark:border-r-transparent"></div>
                <p className="mt-4 text-legal-600 dark:text-legal-400">Cargando conversaciones...</p>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button 
                  className="mt-4 bg-legal-800 hover:bg-legal-700 dark:bg-legal-700 dark:hover:bg-legal-600"
                  onClick={() => window.location.reload()}
                >
                  Reintentar
                </Button>
              </div>
            ) : conversations.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-legal-600 dark:text-legal-400">No tienes conversaciones guardadas.</p>
                <Link 
                  href="/chat" 
                  className="mt-4 inline-block bg-legal-800 hover:bg-legal-700 text-white dark:bg-legal-700 dark:hover:bg-legal-600 px-4 py-2 rounded-md"
                >
                  Iniciar una nueva conversación
                </Link>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {conversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    onDelete={handleConversationDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

    </PageLayout>
  );
}
