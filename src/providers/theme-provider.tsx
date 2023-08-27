import { useStore } from '@/lib/store';
import { Settings } from '@/lib/validation';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: string;
  setTheme: (theme: Settings['theme']) => void;
  previewTheme: Settings['theme'] | undefined;
  setPreviewTheme: React.Dispatch<Settings['theme'] | undefined>;
};

const initialState = {
  theme: 'system',
  setTheme: () => null,
  previewTheme: undefined,
  setPreviewTheme: () => null
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme, setTheme } = useStore();
  const [previewTheme, setPreviewTheme] = useState<Settings['theme'] | undefined>();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (previewTheme === 'system' || (theme === 'system' && !previewTheme)) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(previewTheme || theme);
  }, [theme, previewTheme]);

  const value = {
    theme: theme ?? ('dark' as string),
    setTheme,
    previewTheme,
    setPreviewTheme
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
