import React, { createContext, useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const DropdownMenuContext = createContext();

export const DropdownMenu = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);
  
  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const close = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <DropdownMenuContext.Provider value={{ isOpen, toggleOpen, close }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, ...props }) => {
  const { toggleOpen } = useContext(DropdownMenuContext);
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e) => {
        e.preventDefault();
        toggleOpen();
        children.props.onClick?.(e);
      }
    });
  }
  
  return (
    <Button {...props} onClick={toggleOpen}>
      {children}
    </Button>
  );
};

export const DropdownMenuContent = ({ children, className = '', align = 'center', ...props }) => {
  const { isOpen, close } = useContext(DropdownMenuContext);
  
  if (!isOpen) return null;
  
  const alignmentClasses = {
    center: 'left-1/2 transform -translate-x-1/2',
    start: 'left-0',
    end: 'right-0'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={close}
      />
      
      {/* Dropdown Content */}
      <div 
        className={`absolute top-full mt-2 z-50 min-w-[200px] ${alignmentClasses[align]} ${className}`}
        {...props}
      >
        {children}
      </div>
    </>
  );
};

export const DropdownMenuItem = ({ children, asChild, className = '', onClick, ...props }) => {
  const { close } = useContext(DropdownMenuContext);
  
  const handleClick = (e) => {
    onClick?.(e);
    close();
  };
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      className: `${className} ${children.props.className || ''}`,
      onClick: handleClick
    });
  }
  
  return (
    <div 
      className={`cursor-pointer ${className}`} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};