"use client";

import { useState } from "react";
import Link from "next/link";
// Temporarily remove date-fns import
// import { formatDistanceToNow } from "date-fns";
// import { es } from "date-fns/locale";
import { deleteConversation, updateConversationTitle } from "@/lib/supabase/conversations";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

/**
 * Formatea una fecha en formato relativo simple
 * Función temporal hasta que se pueda usar date-fns correctamente
 * 
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Texto formateado
 */
function formatDateRelative(date) {
  if (!date) return "";
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Convertir milisegundos a minutos, horas, días
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  } else if (hours > 0) {
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else if (minutes > 0) {
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else {
    return "justo ahora";
  }
}

/**
 * Componente para mostrar un ítem de conversación en la lista de historial
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.conversation - Datos de la conversación
 * @param {Function} props.onDelete - Función a llamar después de eliminar
 * @returns {React.ReactNode} Componente React
 */
export default function ConversationItem({ conversation, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  // Usar la función temporal en lugar de date-fns
  const formattedDate = conversation.updated_at
    ? formatDateRelative(new Date(conversation.updated_at))
    : "";
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSave = async () => {
    try {
      setError("");
      const { error } = await updateConversationTitle(conversation.id, title);
      
      if (error) throw error;
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error al actualizar título:", err);
      setError("Error al guardar el título");
    }
  };
  
  const handleCancel = () => {
    setTitle(conversation.title);
    setIsEditing(false);
    setError("");
  };
  
  const handleDeleteClick = () => {
    setIsConfirmOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      setError("");
      
      const { error } = await deleteConversation(conversation.id);
      
      if (error) throw error;
      
      // Notificar al componente padre que se eliminó esta conversación
      if (onDelete) onDelete(conversation.id);
    } catch (err) {
      console.error("Error al eliminar conversación:", err);
      setError("Error al eliminar la conversación");
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="border border-legal-200 dark:border-legal-700 rounded-md p-4 hover:bg-legal-50 dark:hover:bg-legal-800/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-legal-300 dark:border-legal-600 rounded px-2 py-1 bg-white dark:bg-legal-800 text-legal-800 dark:text-legal-200"
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="text-xs bg-legal-800 text-white dark:bg-legal-700 px-2 py-1 rounded hover:bg-legal-700 dark:hover:bg-legal-600"
                >
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="text-xs bg-legal-200 text-legal-800 dark:bg-legal-700 dark:text-legal-200 px-2 py-1 rounded hover:bg-legal-300 dark:hover:bg-legal-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <Link 
              href={`/chat/${conversation.id}`} 
              className="font-medium text-legal-800 dark:text-legal-200 hover:text-legal-600 dark:hover:text-legal-300"
            >
              {conversation.title}
            </Link>
          )}
          <p className="text-xs text-legal-500 mt-1">{formattedDate}</p>
        </div>
        
        {!isEditing && (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="text-legal-600 hover:text-legal-800 dark:text-legal-400 dark:hover:text-legal-200"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              title="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{error}</p>
      )}

      <DeleteConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={handleDeleteConfirm}
        title="¿Eliminar conversación?"
        description="Esta acción no se puede deshacer. La conversación será eliminada permanentemente."
      />
    </div>
  );
}