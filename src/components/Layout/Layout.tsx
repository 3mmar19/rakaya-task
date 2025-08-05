import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

//---------------------------------------------------------------- Layout Component Props ------------------------------------------------------//
interface LayoutProps {
  children: React.ReactNode;
}

//---------------------------------------------------------------- Layout Component ------------------------------------------------------//
const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Sidebar is closed by default on mobile, only opens when menu button is clicked
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
      {/* Sidebar component with state passed from Layout */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        {/* Main content area - allows natural page scrolling */}
        <main className="flex-1 p-4 sm:p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
