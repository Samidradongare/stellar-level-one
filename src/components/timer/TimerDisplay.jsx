import React, { useEffect } from 'react';
import { formatTime } from '../../utils/formatters';

export function TimerDisplay({ remainingSeconds, isComplete }) {
  // Sync remaining time to the browser tab title
  useEffect(() => {
    if (isComplete) {
      document.title = 'Session Complete! 🎯';
    } else {
      document.title = `(${formatTime(remainingSeconds)}) Proof of Focus`;
    }

    return () => {
      document.title = 'Proof of Focus';
    };
  }, [remainingSeconds, isComplete]);

  return null; // Side-effect only component
}
