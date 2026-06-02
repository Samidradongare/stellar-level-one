import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  glow = false,
  ...props
}) {
  return (
    <div
      className={`bg-surface border border-border rounded-card p-6 transition-all duration-300 
        ${hover ? 'hover:border-primary hover:shadow-[0_0_20px_rgba(6,182,212,0.05)]' : ''}
        ${glow ? 'shadow-[0_0_25px_rgba(6,182,212,0.08)]' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`border-b border-border pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`border-t border-border pt-4 mt-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
