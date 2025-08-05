import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//---------------------------------------------------------------- Theme Store Types ------------------------------------------------------//
interface ThemeState {
  isDarkMode: boolean;
  useSystemTheme: boolean;
  toggleTheme: () => void;
  enableDarkMode: () => void;
  disableDarkMode: () => void;
  setUseSystemTheme: (useSystem: boolean) => void;
}

//---------------------------------------------------------------- Theme Store ------------------------------------------------------//
const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false, // Default to light mode
      useSystemTheme: true, // Default to using system preference
      
      toggleTheme: () => 
        set((state) => {
          // If using system theme, switch to manual control first
          if (state.useSystemTheme) {
            const newIsDarkMode = !state.isDarkMode;
            if (newIsDarkMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            return { isDarkMode: newIsDarkMode, useSystemTheme: false };
          } else {
            const newIsDarkMode = !state.isDarkMode;
            if (newIsDarkMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            return { isDarkMode: newIsDarkMode };
          }
        }),
      
      enableDarkMode: () => 
        set(() => {
          document.documentElement.classList.add('dark');
          return { isDarkMode: true, useSystemTheme: false };
        }),
      
      disableDarkMode: () => 
        set(() => {
          document.documentElement.classList.remove('dark');
          return { isDarkMode: false, useSystemTheme: false };
        }),

      setUseSystemTheme: (useSystem: boolean) =>
        set((state) => {
          if (useSystem) {
            // Apply system preference immediately
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
              document.documentElement.classList.add('dark');
              return { isDarkMode: true, useSystemTheme: true };
            } else {
              document.documentElement.classList.remove('dark');
              return { isDarkMode: false, useSystemTheme: true };
            }
          }
          // Just disable system theme without changing current mode
          return { useSystemTheme: false };
        }),
    }),
    {
      name: 'theme-storage', // Name for localStorage key
    }
  )
);

//---------------------------------------------------------------- Initialize Theme ------------------------------------------------------//
// This function should be called once when the app starts
export const initializeTheme = () => {
  const { isDarkMode, useSystemTheme } = useThemeStore.getState();
  
  // Set up system theme change listener
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    const state = useThemeStore.getState();
    if (state.useSystemTheme) {
      if (event.matches) {
        document.documentElement.classList.add('dark');
        useThemeStore.setState({ isDarkMode: true });
      } else {
        document.documentElement.classList.remove('dark');
        useThemeStore.setState({ isDarkMode: false });
      }
    }
  };
  
  // Add listener for system theme changes
  try {
    // Modern browsers
    darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);
  } catch (e) {
    // Fallback for older browsers
    darkModeMediaQuery.addListener(handleSystemThemeChange);
  }
  
  // Initial theme setup
  if (useSystemTheme) {
    // Use system preference
    const prefersDark = darkModeMediaQuery.matches;
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      useThemeStore.setState({ isDarkMode: true });
    } else {
      document.documentElement.classList.remove('dark');
      useThemeStore.setState({ isDarkMode: false });
    }
  } else {
    // Use saved preference
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

export default useThemeStore;