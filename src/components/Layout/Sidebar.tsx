import React, { useState, useEffect } from 'react';
import useMemberStore from '../../store/memberStore';
import { Home, Folder, Info, ChevronDown, Trash,Users, Twitter, Linkedin, Github } from 'lucide-react';
import Modal from '../UI/Modal';

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
  
  // Modal state for member deletion confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<{id: string, name: string} | null>(null);
  
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
      {/* Mobile menu overlay - covers entire screen when menu is open */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} transition-all duration-300 ease-in-out z-30 lg:hidden`}
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
          <div className="text-xl font-bold text-gray-900 dark:text-white">Rakaya Task</div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-1.5">
            <li>
              <a href="#" className="flex items-center p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 border border-white/10 dark:border-gray-700/10">
                {/* Home Icon */}
                <Home className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="ml-3 text-sm">Home</span>
              </a>
            </li>
            <li>
              <button type="button" className="flex items-center w-full p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 border border-white/10 dark:border-gray-700/10" onClick={() => setProjectsOpen(!isProjectsOpen)}>
                {/* Projects Icon */}
                <Folder className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 ml-3 text-sm text-left whitespace-nowrap">Projects</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProjectsOpen ? 'rotate-180' : ''} text-gray-500 dark:text-gray-400`} />
              </button>
              {isProjectsOpen && (
                <ul className="pl-6 mt-1.5 space-y-1">
                  <li><a href="#" className="block p-1.5 text-xs text-gray-700 rounded-md dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors duration-200 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm border border-white/10 dark:border-gray-700/10">Today Task</a></li>
                </ul>
              )}
            </li>
            <li>
              <button type="button" className="flex items-center w-full p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium  duration-200 border border-white/10 dark:border-gray-700/10" onClick={() => setMembersOpen(!isMembersOpen)}>
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
                            onClick={() => {
                              setMemberToDelete({id: member.id, name: member.name});
                              setIsDeleteModalOpen(true);
                            }}
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
              <a href="https://3mmar.info" target="_blank" className="flex items-center p-2 text-gray-700 rounded-lg dark:text-gray-200 hover:bg-white/40 dark:hover:bg-gray-700/60 font-medium transition-colors duration-200 border border-white/10 dark:border-gray-700/10">
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
                <Github className="w-5 h-5" />
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/3mmar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-blue-600 hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              
              {/* Twitter */}
              <a 
                href="https://twitter.com/3mmarHus" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-lg border border-gray-200/50 dark:border-gray-600/30 text-gray-700 dark:text-gray-300 hover:text-blue-400 hover:bg-white dark:hover:bg-gray-600 hover:scale-110 hover:shadow-xl transition-all duration-300"
                aria-label="Twitter Profile"
              >
                <Twitter/>
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
      
      {/* Confirmation Modal for Member Deletion */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setMemberToDelete(null);
        }}
        title="Confirm Deletion"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col items-center">
          <p className="text-center text-gray-800 dark:text-gray-200 mb-4">
            Are you sure you want to delete <span className="font-semibold">{memberToDelete?.name}</span>?
          </p>
          <div className="flex space-x-3 mt-2">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setMemberToDelete(null);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (memberToDelete) {
                  useMemberStore.getState().deleteMember(memberToDelete.id);
                  setIsDeleteModalOpen(false);
                  setMemberToDelete(null);
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;