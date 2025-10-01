import React, { useState, useRef, useEffect } from 'react';

export const Popover = ({ children }) => <div className="relative inline-block">{children}</div>;

export const PopoverTrigger = ({ children }) => children;

export const PopoverContent = ({ className = '', open, onOpenChange, children }) => {
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) onOpenChange && onOpenChange(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [onOpenChange]);
  if (!open) return null;
  return (
    <div ref={ref} className={`absolute z-50 mt-2 rounded-md border border-slate-200 bg-white shadow ${className}`}>{children}</div>
  );
};

export default Popover;
