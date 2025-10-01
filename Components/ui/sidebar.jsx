
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Context for sidebar state
const SidebarContext = createContext(null);

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Effect to detect mobile screen
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const value = useMemo(() => ({ isOpen, isMobile, toggle, close }), [isOpen, isMobile, toggle, close]);

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Main Sidebar Component
export const Sidebar = ({ children, className = '' }) => {
  const { isOpen, isMobile, close } = useSidebar();
  
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "100%" }, // For RTL
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-black/50 z-40"
            />
            {/* Sidebar */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col ${className}`}
            >
              {children}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <aside className={`w-72 flex-shrink-0 flex flex-col bg-white ${className}`}>
      {children}
    </aside>
  );
};

// Sidebar Trigger
export const SidebarTrigger = ({ className = '', ...props }) => {
  const { toggle } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggle} className={className} {...props}>
      <Menu className="w-6 h-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

// Sub-components for structure
export const SidebarHeader = ({ children, className = '' }) => (
  <header className={`p-4 border-b ${className}`}>{children}</header>
);

export const SidebarContent = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>
);

export const SidebarFooter = ({ children, className = '' }) => (
  <footer className={`p-4 border-t ${className}`}>{children}</footer>
);

export const SidebarGroup = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const SidebarGroupLabel = ({ children, className = '' }) => (
  <h3 className={`px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>
    {children}
  </h3>
);

export const SidebarGroupContent = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const SidebarMenu = ({ children, className = '' }) => (
  <nav className={`flex flex-col ${className}`}>{children}</nav>
);

export const SidebarMenuItem = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export const SidebarMenuButton = React.forwardRef(({ asChild, children, className, ...props }, ref) => {
  const Comp = asChild ? 'div' : 'button';
  return <Comp ref={ref} className={`w-full text-right ${className}`} {...props}>{children}</Comp>;
});
SidebarMenuButton.displayName = 'SidebarMenuButton';
