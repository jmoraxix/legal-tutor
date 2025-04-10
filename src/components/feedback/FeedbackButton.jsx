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
      variant="ghost"
      size="icon"
      className={`text-primary hover:text-primary focus:outline-none ${className}`}
      onClick={onClick}
      aria-label="Enviar feedback"
    >
      <HelpCircle className="h-6 w-6" />
    </Button>
  );
};

export default FeedbackButton;
