import React from 'react';

export const Button = ({
  variant = 'default',
  size = 'default',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none';
  const variants = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50',
    ghost: 'bg-transparent hover:bg-emerald-50 text-slate-600',
  };
  const sizes = {
    default: 'h-10 py-2 px-4',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};

export default Button;
