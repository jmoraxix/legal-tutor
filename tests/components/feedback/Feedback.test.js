import { render, screen, fireEvent } from '@testing-library/react';
import Feedback from '@/components/feedback/Feedback';
import { useUser } from '@/hooks/useUser';

// Mock dependencies
jest.mock('@/components/feedback/FeedbackDialog', () => {
  return function MockFeedbackDialog({ open, setOpen }) {
    return open ? <div data-testid="feedback-dialog">Mock Dialog</div> : null;
  };
});

jest.mock('@/hooks/useUser', () => ({
  useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/test-page',
}));

describe('Feedback', () => {
  beforeEach(() => {
    useUser.mockReturnValue({ user: null, isLoading: false });
  });

  test('renders the feedback button', () => {
    render(<Feedback />);
    
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    expect(button).toBeInTheDocument();
  });

  test('opens the dialog when button is clicked', () => {
    render(<Feedback />);
    
    // Dialog should initially be closed
    expect(screen.queryByTestId('feedback-dialog')).not.toBeInTheDocument();
    
    // Click the button
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    fireEvent.click(button);
    
    // Dialog should now be open
    expect(screen.getByTestId('feedback-dialog')).toBeInTheDocument();
  });

  test('applies additional class names to the button', () => {
    render(<Feedback className="test-class" />);
    
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    expect(button).toHaveClass('test-class');
  });
});
