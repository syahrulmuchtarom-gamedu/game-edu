'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  emoji?: string;
  loading?: boolean;
}

export default function GameButton({
  children,
  variant = 'primary',
  size = 'md',
  emoji,
  loading = false,
  className = '',
  disabled,
  ...props
}: GameButtonProps) {
  const baseClasses = 'font-bold rounded-2xl shadow-lg transform transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-target flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white',
    secondary: 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white',
    success: 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white',
    danger: 'bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <>
          {emoji && <span className="text-xl">{emoji}</span>}
          {children}
        </>
      )}
    </button>
  );
}