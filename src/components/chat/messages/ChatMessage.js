/**
 * Component for rendering chat messages with different styles based on sender_type
 * Supports Markdown formatting for AI messages
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';

/**
 * Renders a chat message with style based on sender_type
 * Uses ReactMarkdown for rendering AI messages with markdown support
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object with sender_type and content
 * @returns {React.ReactNode} The rendered message
 */
export default function ChatMessage({ message }) {
  // Define positioning based on sender_type
  const justifyClass = 
    message.sender_type === "user" 
      ? "justify-end" 
      : message.sender_type === "system" 
        ? "justify-center" 
        : "justify-start";
  
  // Define styling based on sender_type
  const styleClass = 
    message.sender_type === "user"
      ? "bg-legal-800 text-white dark:bg-legal-700"
      : message.sender_type === "system"
      ? "bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-200"
      : "bg-legal-100 dark:bg-legal-800 border border-legal-200 dark:border-legal-700 text-legal-800 dark:text-legal-200";
  
  // Add markdown specific styling for AI messages
  const markdownClass = message.sender_type === "AI" 
    ? "markdown-content" 
    : "";
  
  return (
    <div className={`flex ${justifyClass}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${styleClass} ${markdownClass}`}
      >
        {message.sender_type === "AI" ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
}