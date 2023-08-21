import React, { ReactNode } from 'react';
import Sidebar from '../molecules/sidebar';
import Titlebar from '../atoms/titlebar';

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Titlebar />
            <main className="grid grid-cols-12 h-screen">
                <Sidebar className="col-span-3" />
                <div className="col-span-9">{children}</div>
            </main>
            <footer></footer>
        </div>
    );
};

export default Layout;
