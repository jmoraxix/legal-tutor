"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";

/**
 * ResizablePanel component for adjustable width panels
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.defaultSize - Default panel width in pixels
 * @param {number} props.minSize - Minimum panel width in pixels
 * @param {number} props.maxSize - Maximum panel width in pixels
 * @param {Function} props.onResize - Callback when resizing is complete
 * @returns {React.ReactNode} Resizable panel component
 */
export function ResizablePanel({
  children,
  className = "",
  defaultSize = 250,
  minSize = 180,
  maxSize = 500,
  onResize,
}) {
  const [size, setSize] = useState(defaultSize);
  // Using ref instead of state to avoid unused variable warning
  const isResizingRef = useRef(false);
  
  // Functions to handle resizing as refs to avoid dependency issues
  const handleMouseMoveRef = useRef(null);
  const handleMouseUpRef = useRef(null);

  // Get initial size from localStorage or use default
  useEffect(() => {
    try {
      const savedSize = parseInt(localStorage.getItem("sidebar-size"));
      if (savedSize && !isNaN(savedSize)) {
        // Ensure size is within min-max bounds
        const boundedSize = Math.max(minSize, Math.min(maxSize, savedSize));
        setSize(boundedSize);
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, [minSize, maxSize]);

  // Save size to localStorage when it changes
  useEffect(() => {
    if (size !== defaultSize) {
      try {
        localStorage.setItem("sidebar-size", size.toString());
      } catch (error) {
        console.error("Error writing to localStorage:", error);
      }
    }
  }, [size, defaultSize]);

  // Update function references when dependencies change
  useEffect(() => {
    // Handle mouse movement during resize
    handleMouseMoveRef.current = (e) => {
      if (!isResizingRef.current) return;

      // Calculate new size based on mouse position
      let newSize = e.clientX;

      // Enforce min and max constraints
      newSize = Math.max(minSize, Math.min(maxSize, newSize));

      setSize(newSize);
    };

    // End resizing
    handleMouseUpRef.current = () => {
      isResizingRef.current = false;

      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMoveRef.current);
      document.removeEventListener("mouseup", handleMouseUpRef.current);

      // Reset cursor and user-select
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      if (onResize) {
        onResize(size);
      }
    };
  }, [minSize, maxSize, onResize, size]);

  // Start resizing
  const handleResizeStart = (e) => {
    e.preventDefault();
    isResizingRef.current = true;

    // Add event listeners for resize
    document.addEventListener("mousemove", handleMouseMoveRef.current);
    document.addEventListener("mouseup", handleMouseUpRef.current);

    // Change cursor and prevent text selection
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      if (handleMouseMoveRef.current) {
        document.removeEventListener("mousemove", handleMouseMoveRef.current);
      }
      if (handleMouseUpRef.current) {
        document.removeEventListener("mouseup", handleMouseUpRef.current);
      }
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${size}px` }}
    >
      {children}

      {/* Resize handle */}
      <div
        className="absolute top-0 right-0 h-full w-4 cursor-ew-resize group z-10"
        onMouseDown={handleResizeStart}
      >
        <div className="absolute top-0 right-0 h-full w-1 bg-legal-200 dark:bg-legal-700 group-hover:bg-legal-400 dark:group-hover:bg-legal-500 transition-colors" />
      </div>
    </div>
  );
}
