"use client";

import React from 'react';
import { Feedback } from './index';

/**
 * A floating feedback button that is always visible at the bottom right of the page
 * 
 * @returns {JSX.Element} The floating feedback button component
 */
const FloatingFeedback = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="p-2 bg-background rounded-full shadow-xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-300 ease-in-out">
        <Feedback 
          className="rounded-full w-full h-full bg-transparent border-none shadow-none hover:bg-primary/10 hover:scale-105" 
        />
      </div>
    </div>
  );
};

export default FloatingFeedback;
