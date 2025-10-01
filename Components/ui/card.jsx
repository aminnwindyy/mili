import React from 'react';

export const Card = ({ className = '', ...props }) => (
  <div className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`} {...props} />
);

export const CardHeader = ({ className = '', ...props }) => (
  <div className={`p-4 border-b border-slate-100 ${className}`} {...props} />
);

export const CardTitle = ({ className = '', ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-900 ${className}`} {...props} />
);

export const CardContent = ({ className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props} />
);

export default Card;
