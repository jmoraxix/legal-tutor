"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogPortal,
  DialogOverlay
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitFeedback } from '@/lib/supabase/feedback';
import { useUser } from '@/hooks/useUser';

/**
 * Dialog for submitting user feedback
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.setOpen - Function to set the open state
 * @returns {JSX.Element} The feedback dialog component
 */
const FeedbackDialog = ({ open, setOpen }) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { user, isLoading } = useUser();
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor, escribe un mensaje de feedback",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userId = user?.id || null;
      
      await submitFeedback({
        message,
        type: feedbackType,
        pageUrl: pathname
      }, userId);
      
      toast({
        title: "¡Gracias por tu feedback!",
        description: "Hemos recibido tu mensaje y lo revisaremos pronto.",
      });
      
      // Reset form and close dialog
      setMessage('');
      setFeedbackType('general');
      setOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "No pudimos enviar tu feedback. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogContent className="sm:max-w-[425px] fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 bg-background border rounded-lg shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <DialogClose className="absolute right-4 top-4 rounded-full p-1.5 text-foreground/70 opacity-70 ring-offset-background transition-all hover:bg-muted hover:text-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enviar feedback</DialogTitle>
            <DialogDescription>
              Comparte tus comentarios, sugerencias o reporta problemas que hayas encontrado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="feedback-type">Tipo de feedback</label>
              <Select
                value={feedbackType}
                onValueChange={setFeedbackType}
              >
                <SelectTrigger id="feedback-type">
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bug">Reporte de error</SelectItem>
                  <SelectItem value="feature">Sugerencia de funcionalidad</SelectItem>
                  <SelectItem value="content">Contenido</SelectItem>
                  <SelectItem value="question">Pregunta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="message">Mensaje</label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu feedback aquí..."
                className="min-h-[120px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default FeedbackDialog;
