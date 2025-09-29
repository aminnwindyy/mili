import React from 'react';

export const Label = ({ className = '', ...props }) => (
  <label className={`text-sm font-medium text-slate-700 ${className}`} {...props} />
);

export default Label;
