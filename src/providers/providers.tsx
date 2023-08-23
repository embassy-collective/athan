import { Toaster } from '@/components/atoms/toaster';
import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster />
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
};

export default Providers;
