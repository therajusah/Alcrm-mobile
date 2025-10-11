import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useThemeStore } from '../stores/themeStore';
import { colors, ColorScheme } from '../styles/colors';

interface ThemeContextType {
  colors: ColorScheme;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { themeMode, isDark, setThemeMode, initializeTheme } = useThemeStore();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initialize = async () => {
      console.log('ThemeProvider: Initializing theme...');
      const result = await initializeTheme();
      cleanup = result;
      console.log('ThemeProvider: Theme initialization complete');
    };

    initialize();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeTheme]);

  const currentColors = isDark ? colors.dark : colors.light;

  const value: ThemeContextType = {
    colors: currentColors,
    isDark,
    themeMode,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
