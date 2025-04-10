"use client";

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * A button with a question mark icon that triggers the feedback dialog
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Function to call when the button is clicked
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} The feedback button component
 */
const FeedbackButton = ({ onClick, className = '' }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full hover:bg-primary hover:text-primary-foreground ${className}`}
      onClick={onClick}
      aria-label="Enviar feedback"
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
};

export default FeedbackButton;
