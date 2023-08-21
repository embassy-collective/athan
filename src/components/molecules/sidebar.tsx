import React from 'react';
import Logo from '../atoms/logo';
import Menu from './menu';
import { cn } from '@/lib/styles';

const Sidebar = ({ className }: { className?: string }) => {
    return (
        <div className={cn(className, 'flex flex-col')}>
            <Logo className="m-4 mb-24 p-8 " />
            <Menu />
        </div>
    );
};

export default Sidebar;
