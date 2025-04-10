"use client";

import React, { useState } from 'react';
import FeedbackButton from './FeedbackButton';
import FeedbackDialog from './FeedbackDialog';

/**
 * Combines the feedback button and dialog in a single component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS classes for the button
 * @returns {JSX.Element} The combined feedback component
 */
const Feedback = ({ className }) => {
  const [open, setOpen] = useState(false);

  const handleButtonClick = () => {
    setOpen(true);
  };

  return (
    <>
      <FeedbackButton onClick={handleButtonClick} className={className} />
      <FeedbackDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default Feedback;
