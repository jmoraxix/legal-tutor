"use client";

import React, { useState } from 'react';
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
  DialogTitle 
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
      <DialogContent className="sm:max-w-[425px]">
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
    </Dialog>
  );
};

export default FeedbackDialog;
