"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserConversations } from '@/lib/supabase/conversations';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';

/**
 * Sidebar component for chat page that displays all user conversations
 * 
 * @returns {React.ReactNode} The rendered sidebar component
 */
export default function ChatSidebar() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const pathname = usePathname();
  
  useEffect(() => {
    const loadConversations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { conversations, error } = await getUserConversations(user.id);
        
        if (error) throw error;
        
        // Sort conversations by updatedAt date (newest first)
        const sortedConversations = conversations.sort((a, b) => {
          return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        setConversations(sortedConversations);
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('No se pudieron cargar las conversaciones.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
    
    // Setup a subscription to refresh the conversation list when it changes
    if (user) {
      const { createSupabaseClient } = require('@/lib/supabase/client');
      const supabase = createSupabaseClient();
      
      const conversationsSubscription = supabase
        .channel('chat_sessions_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`,
        }, () => {
          loadConversations();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(conversationsSubscription);
      };
    }
  }, [user, pathname]);
  
  // Helper to determine if conversation is active
  const isActive = (id) => pathname === `/chat/${id}`;
  
  return (
    <aside className="w-64 border-r border-legal-200 dark:border-legal-700 min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 overflow-y-auto">
      <div className="p-4">
        <Link href="/chat">
          <Button 
            className="w-full bg-legal-600 hover:bg-legal-500 dark:bg-legal-400 dark:hover:bg-legal-300 dark:text-slate-900"
          >
            Nueva Conversación
          </Button>
        </Link>
      </div>
      
      <div className="px-3 py-2">
        <h3 className="text-xs font-medium text-legal-500 dark:text-legal-400 uppercase tracking-wider mb-2">
          Mis Conversaciones
        </h3>
        
        {isLoading ? (
          <div className="px-2 py-6 text-center">
            <div className="animate-pulse flex space-x-2 justify-center">
              <div className="w-2 h-2 rounded-full bg-legal-400"></div>
              <div className="w-2 h-2 rounded-full bg-legal-400 delay-75"></div>
              <div className="w-2 h-2 rounded-full bg-legal-400 delay-150"></div>
            </div>
          </div>
        ) : error ? (
          <div className="px-2 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : conversations.length === 0 ? (
          <div className="px-2 py-3 text-sm text-legal-500 dark:text-legal-400">
            No tienes conversaciones aún.
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map(conversation => (
              <li key={conversation.id}>
                <Link 
                  href={`/chat/${conversation.id}`}
                  className={`block px-3 py-2 text-sm rounded-md truncate ${
                    isActive(conversation.id)
                      ? 'bg-legal-100 text-legal-900 dark:bg-legal-800 dark:text-white font-medium'
                      : 'text-legal-700 hover:bg-legal-50 dark:text-legal-300 dark:hover:bg-legal-800/50'
                  }`}
                  title={conversation.title || "Loading title..."}
                >
                  {conversation.title || "Loading title..."}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}