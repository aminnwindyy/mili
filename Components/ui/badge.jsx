import React from 'react';

export const Badge = ({ className = '', ...props }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 ${className}`} {...props} />
);

export default Badge;
