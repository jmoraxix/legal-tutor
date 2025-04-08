/**
 * Tests for the ChatMessage component
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/chat/messages/ChatMessage';

describe('ChatMessage Component', () => {
  // Test for user message
  test('renders user message with correct styles', () => {
    const userMessage = {
      sender_type: 'user',
      content: 'This is a test user message',
    };

    const { container } = render(<ChatMessage message={userMessage} />);
    
    // Check content
    expect(screen.getByText('This is a test user message')).toBeInTheDocument();
    
    // Check alignment (justify-end for user messages)
    const messageContainer = container.firstChild;
    expect(messageContainer).toHaveClass('justify-end');
    
    // Check styling for user message
    const messageBubble = container.firstChild.firstChild;
    expect(messageBubble).toHaveClass('bg-legal-800');
    expect(messageBubble).toHaveClass('text-white');
  });

  // Test for AI message
  test('renders AI message with correct styles', () => {
    const aiMessage = {
      sender_type: 'AI',
      content: 'This is a test AI response',
    };

    const { container } = render(<ChatMessage message={aiMessage} />);
    
    // Check content
    expect(screen.getByText('This is a test AI response')).toBeInTheDocument();
    
    // Check alignment (justify-start for AI messages)
    const messageContainer = container.firstChild;
    expect(messageContainer).toHaveClass('justify-start');
    
    // Check styling for AI message
    const messageBubble = container.firstChild.firstChild;
    expect(messageBubble).toHaveClass('bg-legal-100');
    expect(messageBubble).toHaveClass('dark:bg-legal-800');
  });

  // Test for system message
  test('renders system message with correct styles', () => {
    const systemMessage = {
      sender_type: 'system',
      content: 'This is a system message',
    };

    const { container } = render(<ChatMessage message={systemMessage} />);
    
    // Check content
    expect(screen.getByText('This is a system message')).toBeInTheDocument();
    
    // Check alignment (justify-center for system messages)
    const messageContainer = container.firstChild;
    expect(messageContainer).toHaveClass('justify-center');
    
    // Check styling for system message
    const messageBubble = container.firstChild.firstChild;
    expect(messageBubble).toHaveClass('bg-amber-100');
    expect(messageBubble).toHaveClass('dark:bg-amber-900');
    expect(messageBubble).toHaveClass('text-amber-800');
  });
});
