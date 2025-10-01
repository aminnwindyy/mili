import React from 'react';

export const Separator = ({ className = '', ...props }) => (
  <div className={`h-px w-full bg-slate-200 ${className}`} {...props} />
);

export default Separator;
