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
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 duration-500">
      <Feedback className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-background border-2 border-primary/10 hover:scale-110" />
    </div>
  );
};

export default FloatingFeedback;
