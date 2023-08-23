import { cn } from '@/lib/styles';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface MenuItemProps {
  children: React.ReactNode;
  to: string;
  key: number;
  className?: string;
}

const MenuItem = ({ children, to, className }: MenuItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(className, 'flex h-12 items-center px-8 pl-4 border-l-4 border-transparent hover:border-accent', {
          'border-accent': isActive,
          'border-transparent': !isActive
        })
      }
    >
      {children}
    </NavLink>
  );
};

export default MenuItem;
