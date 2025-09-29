import React from 'react';

export const Input = ({ className = '', ...props }) => (
  <input className={`h-10 px-3 rounded-md border border-slate-300 bg-white ${className}`} {...props} />
);

export default Input;
