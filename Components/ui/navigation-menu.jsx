import React from 'react';

export const NavigationMenu = ({ children }) => (
  <nav className="relative">{children}</nav>
);

export const NavigationMenuList = ({ children }) => (
  <ul className="flex items-center gap-2">{children}</ul>
);

export const NavigationMenuItem = ({ children }) => (
  <li className="list-none">{children}</li>
);

export const NavigationMenuTrigger = ({ children }) => (
  <div>{children}</div>
);

export const NavigationMenuContent = ({ children }) => (
  <div className="absolute top-full mt-2">{children}</div>
);

export const NavigationMenuLink = ({ children }) => (
  <span>{children}</span>
);

export default NavigationMenu;
