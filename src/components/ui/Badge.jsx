import React from 'react';

export function Badge({
  children,
  variant = 'info', // info | success | danger | warning | primary
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border';

  const variants = {
    primary: 'bg-primary-glow border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    success: 'bg-emerald-950/30 border-success/40 text-success shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    danger: 'bg-red-950/30 border-error/40 text-error shadow-[0_0_10px_rgba(239,68,68,0.1)]',
    warning: 'bg-amber-950/30 border-warning/40 text-warning shadow-[0_0_10px_rgba(245,158,11,0.1)]',
    info: 'bg-gray-800/50 border-border text-text-muted',
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
