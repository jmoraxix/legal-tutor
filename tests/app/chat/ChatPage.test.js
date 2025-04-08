import { render, screen } from '@testing-library/react';
import ChatPage from '@/app/chat/page';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth';

// Mock necessary dependencies
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(param => {
      if (param === 'id') return null;
      if (param === 'new') return null;
      return null;
    })
  }),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/lib/supabase/conversations', () => ({
  createConversation: jest.fn(),
  addMessageToConversation: jest.fn(),
  getConversationWithMessages: jest.fn(),
}));

jest.mock('@/lib/chat/chat-service', () => ({
  sendMessageToN8N: jest.fn(),
}));

jest.mock('@/components/layout/ChatLayout', () => {
  return function MockChatLayout({ children }) {
    return <div data-testid="chat-layout">{children}</div>;
  };
});

describe('ChatPage', () => {
  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Mock useAuth to return non-authenticated state by default
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });
  });
  
  it('renders Suspense boundary correctly', () => {
    render(<ChatPage />);
    const layoutElement = screen.getByTestId('chat-layout');
    expect(layoutElement).toBeInTheDocument();
  });
  
  it('renders "Consulta Legal" title', async () => {
    // Mock our dependencies for this test
    render(<ChatPage />);
    
    // The title should appear after Suspense resolves
    const titleElement = await screen.findByText(/Consulta Legal/i);
    expect(titleElement).toBeInTheDocument();
  });
  
  it('shows login prompt for unauthenticated users', async () => {
    render(<ChatPage />);
    
    // After Suspense resolves, we should see the login prompt
    const loginPrompt = await screen.findByText(/Inicia sesión/i);
    expect(loginPrompt).toBeInTheDocument();
  });
  
  it('loads an existing conversation when id parameter is present', async () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      user: { id: 'user-123' },
      isAuthenticated: true,
    });
    
    // Mock the search params to return a chat id
    const mockGet = jest.fn(param => {
      if (param === 'id') return 'chat-123';
      return null;
    });
    
    useSearchParams.mockReturnValue({
      get: mockGet
    });
    
    // Mock the getConversationWithMessages function
    const mockConversation = {
      id: 'chat-123',
      user_id: 'user-123',
      session_title: 'Test Conversation'
    };
    
    const mockMessages = [
      { sender_type: 'user', content: 'Hello' },
      { sender_type: 'AI', content: 'Hi there!' }
    ];
    
    require('@/lib/supabase/conversations').getConversationWithMessages.mockResolvedValue({
      conversation: mockConversation,
      messages: mockMessages,
      error: null
    });
    
    render(<ChatPage />);
    
    // Should show the conversation title
    const titleElement = await screen.findByText('Test Conversation');
    expect(titleElement).toBeInTheDocument();
  });
});
