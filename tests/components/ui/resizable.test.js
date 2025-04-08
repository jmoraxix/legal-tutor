import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { ResizablePanel } from '@/components/ui/resizable/resizable';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('ResizablePanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  it('renders with default size', () => {
    const { container } = render(
      <ResizablePanel>
        <div>Content</div>
      </ResizablePanel>
    );
    const panel = container.firstChild;
    expect(panel).toHaveStyle('width: 250px');
  });

  it('reads size from localStorage if available', () => {
    localStorageMock.getItem.mockReturnValue('300');
    
    const { container } = render(
      <ResizablePanel>
        <div>Content</div>
      </ResizablePanel>
    );
    
    // Run the effect
    act(() => {
      jest.runAllTimers();
    });
    
    const panel = container.firstChild;
    expect(localStorageMock.getItem).toHaveBeenCalledWith('sidebar-size');
    expect(panel).toHaveStyle('width: 300px');
  });

  it('enforces minimum size', () => {
    localStorageMock.getItem.mockReturnValue('100'); // Below min of 180
    
    const { container } = render(
      <ResizablePanel minSize={180}>
        <div>Content</div>
      </ResizablePanel>
    );
    
    // Run the effect
    act(() => {
      jest.runAllTimers();
    });
    
    const panel = container.firstChild;
    expect(panel).toHaveStyle('width: 180px'); // Should use min size
  });

  it('handles resize actions', () => {
    const onResizeMock = jest.fn();
    
    const { container } = render(
      <ResizablePanel onResize={onResizeMock}>
        <div>Content</div>
      </ResizablePanel>
    );
    
    const resizeHandle = container.querySelector('.cursor-ew-resize');
    
    // Start resizing
    fireEvent.mouseDown(resizeHandle);
    
    // Move mouse
    fireEvent.mouseMove(document, { clientX: 300 });
    
    // End resizing
    fireEvent.mouseUp(document);
    
    expect(onResizeMock).toHaveBeenCalled();
  });

  it('handles errors when localStorage is unavailable', () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Make localStorage.getItem throw an error
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage unavailable');
    });
    
    render(
      <ResizablePanel>
        <div>Content</div>
      </ResizablePanel>
    );
    
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
});
