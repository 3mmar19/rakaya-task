import React from 'react';
import useThemeStore from '../../store/themeStore';
import { Moon, Sun } from 'lucide-react';

//---------------------------------------------------------------- ThemeToggle Component ------------------------------------------------------//
const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  // Toggle theme with a single click
  const handleToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleTheme}
        className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-gray-700/60 focus:outline-none bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10"
        aria-label="Toggle theme"
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? (
          <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;