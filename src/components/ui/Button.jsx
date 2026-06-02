import React from 'react';
import { Spinner } from './Spinner';

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary | secondary | outline | ghost | danger | success
  size = 'md', // sm | md | lg
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-input transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-primary text-background hover:bg-cyan-400 focus:ring-primary shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-gray-800 hover:text-white focus:ring-gray-700',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary-glow focus:ring-primary',
    ghost: 'bg-transparent text-text-muted hover:bg-surface hover:text-text-primary focus:ring-gray-700',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    success: 'bg-success text-white hover:bg-emerald-600 focus:ring-success shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Spinner className="mr-2" size="sm" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
}
