import React from 'react';

export const Switch = ({ checked, onCheckedChange, className = '', ...props }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ease-out ${
      checked ? 'bg-emerald-500' : 'bg-slate-200'
    } shadow-inner ${className}`}
    {...props}
  >
    <span
      className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-200 ease-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)' }}
    />
  </button>
);

export default Switch;
