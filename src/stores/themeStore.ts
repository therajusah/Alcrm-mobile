import { create } from 'zustand';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  initializeTheme: () => Promise<(() => void) | undefined>;
}

const THEME_STORAGE_KEY = '@theme_mode';

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: 'system',
  isDark: false,

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);

      const systemColorScheme = Appearance.getColorScheme();
      const isDark =
        mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

      set({ themeMode: mode, isDark });

      console.log('Theme mode set to:', mode, 'isDark:', isDark);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  },

  initializeTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      const themeMode = (savedTheme as ThemeMode) || 'system';

      const systemColorScheme = Appearance.getColorScheme();
      const isDark =
        themeMode === 'dark' ||
        (themeMode === 'system' && systemColorScheme === 'dark');

      set({ themeMode, isDark });

      console.log('Theme initialized:', {
        themeMode,
        systemColorScheme,
        isDark,
      });

      // Listen for system theme changes
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        const { themeMode: currentMode } = get();
        console.log(
          'System theme changed to:',
          colorScheme,
          'Current mode:',
          currentMode
        );

        if (currentMode === 'system') {
          const isDark = colorScheme === 'dark';
          set({ isDark });
          console.log('Auto-switched to:', isDark ? 'dark' : 'light', 'theme');
        }
      });

      return () => subscription?.remove();
    } catch (error) {
      console.error('Error initializing theme:', error);
      // Fallback to system theme
      const systemColorScheme = Appearance.getColorScheme();
      set({ themeMode: 'system', isDark: systemColorScheme === 'dark' });
      return undefined;
    }
  },
}));
