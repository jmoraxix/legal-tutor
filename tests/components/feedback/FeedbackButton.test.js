import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackButton from '@/components/feedback/FeedbackButton';

describe('FeedbackButton', () => {
  test('renders the button with question mark icon', () => {
    render(<FeedbackButton onClick={() => {}} />);
    
    // Check that the button exists
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    expect(button).toBeInTheDocument();
  });
  
  test('applies additional class names', () => {
    render(<FeedbackButton onClick={() => {}} className="test-class" />);
    
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    expect(button).toHaveClass('test-class');
  });
  
  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<FeedbackButton onClick={handleClick} />);
    
    const button = screen.getByRole('button', { name: /enviar feedback/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
