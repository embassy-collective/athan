import React, { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
        </>
    );
};

export default Providers;
