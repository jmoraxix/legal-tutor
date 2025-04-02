import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth';
import LogoutButton from '@/components/auth/LogoutButton';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the context/auth module
jest.mock('@/context/auth', () => ({
  useAuth: jest.fn(),
}));

describe('LogoutButton Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();
  
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
    
    // Reset mocks between tests
    mockPush.mockClear();
    mockLogout.mockClear();
  });
  
  // Test for expected use - user is authenticated and button is visible
  test('renders the logout button when user is authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout,
    });
    
    render(<LogoutButton />);
    
    const logoutButton = screen.getByTitle('Cerrar Sesión');
    expect(logoutButton).toBeInTheDocument();
  });
  
  // Test for edge case - user is not authenticated and button is not visible
  test('does not render the logout button when user is not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      logout: mockLogout,
    });
    
    const { container } = render(<LogoutButton />);
    
    // The component should not render anything, so the container should be empty
    expect(container).toBeEmptyDOMElement();
  });
  
  // Test for functionality - logout and redirect to homepage
  test('calls logout function and redirects when clicked', async () => {
    // Mock window.location
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { href: '' }
    });
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      logout: mockLogout.mockResolvedValue({}),
    });
    
    render(<LogoutButton />);
    
    const logoutButton = screen.getByTitle('Cerrar Sesión');
    fireEvent.click(logoutButton);
    
    // Verify logout was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
    
    // Wait for the async operation to complete
    await Promise.resolve();
    
    // Verify window.location.href was set to homepage
    expect(window.location.href).toBe('/');
  });
});
