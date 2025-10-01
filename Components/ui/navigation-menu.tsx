import React, { createContext, useContext } from 'react';

const Ctx = createContext({});

export const NavigationMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="relative">{children}</nav>
);

export const NavigationMenuList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="flex items-center gap-2">{children}</ul>
);

export const NavigationMenuItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="list-none">{children}</li>
);

export const NavigationMenuTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const NavigationMenuContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="absolute top-full mt-2">{children}</div>
);

export const NavigationMenuLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);

export default NavigationMenu;


