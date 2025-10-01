import React from 'react';

export const Select = ({ className = '', children, ...props }) => (
  <select className={`h-10 px-3 rounded-md border border-slate-300 bg-white ${className}`} {...props}>
    {children}
  </select>
);

export const SelectTrigger = ({ className = '', ...props }) => (
  <div className={`inline-flex items-center h-10 px-3 rounded-md border border-slate-300 bg-white ${className}`} {...props} />
);

export const SelectValue = ({ placeholder }) => (
  <span>{placeholder}</span>
);

export const SelectContent = ({ className = '', ...props }) => (
  <div className={`mt-2 rounded-md border border-slate-200 bg-white shadow ${className}`} {...props} />
);

export const SelectItem = ({ className = '', ...props }) => (
  <div className={`px-3 py-2 cursor-pointer hover:bg-slate-50 ${className}`} {...props} />
);

export default Select;
