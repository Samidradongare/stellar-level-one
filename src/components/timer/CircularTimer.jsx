import React from 'react';
import { formatTime } from '../../utils/formatters';

export function CircularTimer({
  totalSeconds,
  remainingSeconds,
  isComplete = false
}) {
  const radius = 120;
  const strokeWidth = 10;
  const center = 140;
  const circumference = 2 * Math.PI * radius;

  // Prevent divide by zero
  const safeTotal = totalSeconds > 0 ? totalSeconds : 1;
  const percent = isComplete ? 100 : (remainingSeconds / safeTotal) * 100;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  const color = isComplete ? '#10b981' : '#06b6d4'; // success vs primary
  const shadowId = isComplete ? 'glow-success' : 'glow-primary';

  return (
    <div className="relative flex items-center justify-center w-[290px] h-[290px] mx-auto select-none">
      {/* Glow Effect Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow-primary" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="glow-success" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* SVG Circular Ring */}
      <svg className="w-full h-full transform -rotate-90">
        {/* Outer Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
        />
        
        {/* Animated Progress Ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: `url(#${shadowId})`,
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
          }}
          className={isComplete ? 'animate-pulse' : ''}
        />
      </svg>

      {/* Text inside the ring */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`text-4xl font-extrabold tracking-tighter tabular-nums transition-colors duration-300 ${
          isComplete ? 'text-success' : 'text-text-primary'
        }`}>
          {formatTime(remainingSeconds)}
        </span>
        <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-text-muted mt-2">
          {isComplete ? 'COMPLETE' : 'FOCUSING'}
        </span>
      </div>
    </div>
  );
}
