import React, { useState, useRef, useEffect } from 'react';
import HeaderSearch from './HeaderSearch';
import useFilterStore from '../../store/filterStore';
import useMemberStore from '../../store/memberStore';
import { Search } from 'lucide-react';

//---------------------------------------------------------------- FloatingSearchButton Component ------------------------------------------------------//
const FloatingSearchButton: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [, setShowFilters] = useState(false);
  const searchOverlayRef = useRef<HTMLDivElement>(null);
  
  // Get filter state from store
  const { 
    setSearchText, 
    setPriorityFilter, 
    setTagFilter,
    setAssigneeFilter,
    priorityFilter,
    tagFilter,
    assigneeFilter
  } = useFilterStore();
  const { members } = useMemberStore();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Don't automatically show filters when opening search
    setShowFilters(false);
  };
  
  // Handle clicks outside the search overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchOverlayRef.current && 
        !searchOverlayRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    // Add event listener when search is open
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <>
      {/* Floating search button - hidden when search is open */}
      {!isSearchOpen && (
        <button
          onClick={toggleSearch}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/20 dark:bg-gray-700/20 text-gray-700 dark:text-white shadow-lg flex items-center justify-center z-50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-2glass-light backdrop-blur-xl backdrop-saturate-[180%] border border-white/20 dark:border-gray-700/20 rounded-2xl overflow-hidden transition-all duration-200 ease-in-out shadow-lg"
          aria-label="Search"
        >
          {/* Always show search icon, never show X */}
          <Search className="h-6 w-6" />
        </button>
      )}

      {/* Mobile search overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center pb-[1rem] px-4 z-[60]">
          <div 
            ref={searchOverlayRef}
            className="w-full max-w-md pointer-events-auto glass-light backdrop-blur-xl backdrop-saturate-[180%] border border-white/20 dark:border-gray-700/20 rounded-2xl overflow-hidden transition-all duration-200 ease-in-out shadow-lg"
          >
            <div className="flex items-center justify-between p-3 border-b border-white/20">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
            {/* Filter section at the top */}
            <div className="p-4 border-b border-white/20">
              <h4 className="text-sm font-medium text-black dark:text-gray-300 mb-2">Filters</h4>
              
              {/* Priority filters */}
              <div className="mb-3">
                <h5 className="text-xs text-black dark:text-gray-400 mb-1">Priority</h5>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setPriorityFilter('high')}
                    className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'high' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                  >
                    High
                  </button>
                  <button 
                    onClick={() => setPriorityFilter('medium')}
                    className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}
                  >
                    Medium
                  </button>
                  <button 
                    onClick={() => setPriorityFilter('low')}
                    className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'low' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}
                  >
                    Low
                  </button>
                </div>
              </div>
              
              {/* Tag filters */}
              <div className="mb-3">
                <h5 className="text-xs text-black dark:text-gray-400 mb-1">Tags</h5>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setTagFilter('bug')}
                    className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'bug' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                  >
                    Bug
                  </button>
                  <button 
                    onClick={() => setTagFilter('feature')}
                    className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'feature' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                  >
                    Feature
                  </button>
                  <button 
                    onClick={() => setTagFilter('ui')}
                    className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'ui' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
                  >
                    UI
                  </button>
                </div>
              </div>
              
              {/* Team members */}
              <div className="mb-3">
                <h5 className="text-xs text-black dark:text-gray-400 mb-1">Team Members</h5>
                <div className="flex flex-wrap gap-2">
                  {members.map(member => (
                    <button 
                      key={member.id}
                      onClick={() => setAssigneeFilter(member.id)}
                      className={`px-2 py-1 rounded-md text-xs flex items-center ${assigneeFilter === member.id ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'}`}
                    >
                      <span className="w-4 h-4 rounded-full bg-gray-300 mr-1 overflow-hidden">
                        {member.avatar && <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />}
                      </span>
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Clear filters button */}
              <button 
                onClick={() => {
                  setSearchText('');
                  setPriorityFilter(null);
                  setTagFilter(null);
                  setAssigneeFilter(null);
                }}
                className="w-full px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Clear All Filters
              </button>
            </div>
            
            {/* Search input */}
            <div className="p-4 relative">
              <HeaderSearch />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingSearchButton;
