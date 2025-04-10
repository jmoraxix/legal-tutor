import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackDialog from '@/components/feedback/FeedbackDialog';
import { submitFeedback } from '@/lib/supabase/feedback';
import { AuthContext } from '@/context/auth';

// Mock the dependencies
jest.mock('@/lib/supabase/feedback', () => ({
  submitFeedback: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/test-page',
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('FeedbackDialog', () => {
  const mockUser = { id: 'test-user-id' };
  const mockSetOpen = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders the dialog when open', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false }}>
        <FeedbackDialog open={true} setOpen={mockSetOpen} />
      </AuthContext.Provider>
    );
    
    expect(screen.getByText('Enviar feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensaje')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Enviar feedback')).toBeInTheDocument();
  });
  
  test('does not render when closed', () => {
    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false }}>
        <FeedbackDialog open={false} setOpen={mockSetOpen} />
      </AuthContext.Provider>
    );
    
    expect(screen.queryByText('Enviar feedback')).not.toBeInTheDocument();
  });
  
  test('submits feedback with user ID when authenticated', async () => {
    submitFeedback.mockResolvedValue({ id: 'new-feedback-id' });
    
    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false }}>
        <FeedbackDialog open={true} setOpen={mockSetOpen} />
      </AuthContext.Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: { value: 'Test feedback message' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Enviar feedback' }));
    
    await waitFor(() => {
      expect(submitFeedback).toHaveBeenCalledWith(
        {
          message: 'Test feedback message',
          type: 'general',
          pageUrl: '/test-page',
        },
        mockUser.id
      );
      expect(mockSetOpen).toHaveBeenCalledWith(false);
    });
  });
  
  test('submits feedback without user ID when not authenticated', async () => {
    submitFeedback.mockResolvedValue({ id: 'new-feedback-id' });
    
    render(
      <AuthContext.Provider value={{ user: null, isLoading: false }}>
        <FeedbackDialog open={true} setOpen={mockSetOpen} />
      </AuthContext.Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: { value: 'Anonymous feedback' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Enviar feedback' }));
    
    await waitFor(() => {
      expect(submitFeedback).toHaveBeenCalledWith(
        {
          message: 'Anonymous feedback',
          type: 'general',
          pageUrl: '/test-page',
        },
        null
      );
    });
  });
  
  test('shows error toast when submission fails', async () => {
    const mockError = new Error('Test error');
    submitFeedback.mockRejectedValue(mockError);
    
    const { toast } = useToast();
    
    render(
      <AuthContext.Provider value={{ user: mockUser, isLoading: false }}>
        <FeedbackDialog open={true} setOpen={mockSetOpen} />
      </AuthContext.Provider>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Mensaje'), {
      target: { value: 'Test feedback message' },
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Enviar feedback' }));
    
    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'No pudimos enviar tu feedback. Por favor, intenta de nuevo.',
        variant: 'destructive',
      });
    });
  });
});
