import React, { useState } from 'react';
import NotificationBell from '../UI/NotificationBell';
import HeaderSearch from '../UI/SearchBar';
import ThemeToggle from '../UI/ThemeToggle';
import { X, Menu } from 'lucide-react';

//------------------------------------------------------ Header Props Interface ------------------------------------------------------//
interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

//---------------------------------------------------------------- Header Component ------------------------------------------------------//
const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-2 sm:p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 relative z-40">
      {/* Left side - Mobile menu button */}
      <div className="w-10 sm:hidden">
        {/* Mobile menu button*/}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 glass-light"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg z-50 border-t border-gray-200 dark:border-gray-700 mt-1">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar - Hidden on mobile, visible on desktop */}
      <div className="hidden sm:block w-full sm:w-1/2 md:w-1/3 max-w-xs sm:max-w-sm relative z-50">
        <HeaderSearch />
      </div>

      {/* Right-side controls */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <ThemeToggle />
        
        {/* Notification Bell */}
        <NotificationBell />

        {/* User Avatar */}
        <div className="flex items-center space-x-2 relative group">
            <div className="relative">
                <img src="https://api.dicebear.com/7.x/initials/svg?seed=ammar hussain" alt="User avatar" className="w-10 h-10 rounded-full border-2 border-blue-500/30" />
                {/* Online status indicator */}
                <div className="absolute -right-1 -top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            {/* Desktop view - always visible */}
            <div className="hidden sm:block">
                <div className="font-medium text-gray-900 dark:text-white">Ammar Hussain</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Frontend Developer</div>
            </div>
            {/* Mobile view */}
            <div className="sm:hidden absolute -top-16 right-0 w-max bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 dark:border-gray-700 z-[150]">
                <div className="font-medium text-gray-900 dark:text-white text-right">Ammar Hussain</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">Frontend Developer</div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
