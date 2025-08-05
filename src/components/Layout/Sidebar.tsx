import React, { useState, useEffect } from 'react';
import useMemberStore from '../../store/memberStore';
import { Home, Folder, Calendar, Users, Settings, Info, ChevronDown, Trash } from 'lucide-react';

//---------------------------------------------------------------- Sidebar Props Interface ------------------------------------------------------//
interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

//---------------------------------------------------------------- Sidebar Component ------------------------------------------------------//
const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const [isProjectsOpen, setProjectsOpen] = useState(true);
  const [isMembersOpen, setMembersOpen] = useState(false);
  const members = useMemberStore((state) => state.members);
  
  // Close sidebar when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile menu overlay - only visible when menu is open */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out z-30 flex flex-col`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar - hidden by default on mobile, shown when menu button is clicked */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-50 w-64 h-screen flex-shrink-0 
          bg-[#f9fbfc] dark:bg-gray-800/70 backdrop-blur-md 
          border-r border-white/20 dark:border-gray-700/20 
          flex flex-col p-4 transition-all duration-300 ease-out
          shadow-lg lg:shadow-none overflow-y-auto
          ${isOpen ? 'translate-x-0 opacity-100 scale-x-100' : '-translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100 scale-x-95 lg:scale-x-100'}`}
      >
      {/* Logo */}
      <div className="flex items-center mb-6">
        <img src="/logo.png" alt="Rakaya Task Logo" className="w-10 h-10 mr-3 rounded-md shadow-sm" />
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Rakaya Task</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-grow">
        <ul className="space-y-1.5">
          <li>
            <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10">
              {/* Home Icon */}
              <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="ml-3 text-sm">Home</span>
            </a>
          </li>
          <li>
            <button type="button" className="flex items-center w-full p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10" onClick={() => setProjectsOpen(!isProjectsOpen)}>
              {/* Projects Icon */}
              <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 ml-3 text-sm text-left whitespace-nowrap">Projects</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
            </button>
            {isProjectsOpen && (
              <ul className="pl-6 mt-1.5 space-y-1">
                <li><a href="#" className="block p-1.5 text-xs text-gray-700 rounded-md dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors duration-200 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/10">Rakaya Task
</a></li>
              </ul>
            )}
          </li>
          <li>
            <button type="button" className="flex items-center w-full p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10" onClick={() => setMembersOpen(!isMembersOpen)}>
              {/* Members Icon */}
              <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 ml-3 text-sm text-left whitespace-nowrap">Members</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isMembersOpen ? 'rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
            </button>
            {isMembersOpen && (
              <ul className="pl-6 mt-1.5 space-y-1">
                {members.length > 0 ? members.map(member => (
                  <li key={member.id} className="relative group">
                    <div className="flex items-center justify-between p-1.5 text-xs text-gray-700 rounded-md dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors duration-200 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/10">
                      <span className="truncate">{member.name}</span>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => useMemberStore.getState().deleteMember(member.id)}
                          className="p-0.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          aria-label="Delete member"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                )) : (
                  <li className="p-1.5 text-xs text-gray-500 dark:text-gray-400 text-center">
                    No members available
                  </li>
                )}
              </ul>
            )}
          </li>
          <li>
            <a href="https://3mmar.info" target="_blank" className="flex items-center p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10">
              <Info className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="ml-3 text-sm">Support</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* Let's Connect Section */}
      <div className="mt-auto">
        <div className="text-center p-6 rounded-xl bg-[#d1d1d180] dark:bg-gray-800/70 backdrop-blur-lg shadow-lg border border-white/20 dark:border-gray-700/50 transition-all duration-300">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Let's Connect</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {/* GitHub */}
            <a 
              href="https://github.com/3mmar19" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
              aria-label="GitHub Profile"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
            </a>
            
            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/3mmar" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path></svg>
            </a>
            
            {/* Twitter */}
            <a 
              href="https://twitter.com/3mmarHus" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
              aria-label="Twitter Profile"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path></svg>
            </a>
            
            {/* WhatsApp */}
            <a 
              href="https://wa.me/+966535676369" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-green-500 hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
              aria-label="WhatsApp Contact"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-5 h-5" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
