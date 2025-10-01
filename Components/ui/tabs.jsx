import React from "react";

export function Tabs({ value, onValueChange, className, children }) {
  return (
    <div className={className} data-value={value}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              tabsValue: value,
              onValueChange,
            })
          : child
      )}
    </div>
  );
}

export function TabsList({ className, children }) {
  return <div className={className} role="tablist">{children}</div>;
}

export function TabsTrigger({ value, className, children, tabsValue, onValueChange }) {
  const isActive = tabsValue === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`${className || ""} ${isActive ? "bg-emerald-600 text-white" : "text-slate-700"}`}
      onClick={() => onValueChange && onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, tabsValue }) {
  if (tabsValue !== value) return null;
  return <div role="tabpanel">{children}</div>;
}

export default Tabs;

