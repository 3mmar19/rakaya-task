import React, { useState, useRef } from 'react';
import useFilterStore from '../../store/filterStore';
import useMemberStore from '../../store/memberStore';
import { Search, X, Filter } from 'lucide-react';

// Props interface for HeaderSearch
interface HeaderSearchProps {
  filterPosition?: 'top' | 'bottom';
}

//---------------------------------------------------------------- HeaderSearch Component ------------------------------------------------------//
const HeaderSearch: React.FC<HeaderSearchProps> = ({ filterPosition = 'bottom' }) => {
  const { 
    searchText, 
    setSearchText, 
    setPriorityFilter, 
    setTagFilter,
    setAssigneeFilter,
    priorityFilter,
    tagFilter,
    assigneeFilter
  } = useFilterStore();
  const { members } = useMemberStore();
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to reset filters except the specified one
  const resetOtherFilters = (keep: 'priority' | 'tag' | 'assignee' | null) => {
    if (keep !== 'priority') setPriorityFilter(null);
    if (keep !== 'tag') setTagFilter(null);
    if (keep !== 'assignee') setAssigneeFilter(null);
  };

  // Advanced search handler with tag, priority, and assignee detection
  const handleSearch = (value: string) => {
    const lowerValue = value.toLowerCase().trim();

    setSearchText(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    
    if (!value.trim()) {
      resetOtherFilters(null);
    }
    
    searchTimeout.current = setTimeout(() => {
      if (lowerValue.startsWith('tag:') || lowerValue.startsWith('#')) {
        const tagQuery = lowerValue.startsWith('tag:') 
          ? lowerValue.substring(4).trim() 
          : lowerValue.substring(1).trim();
        
        if (tagQuery) {
          setTagFilter(tagQuery);
          resetOtherFilters('tag');
        } else {
          setTagFilter(null);
        }
      } else if (lowerValue.startsWith('priority:') || lowerValue.startsWith('p:')) {
        // Priority search
        const priorityQuery = lowerValue.startsWith('priority:') 
          ? lowerValue.substring(9).trim() 
          : lowerValue.substring(2).trim();
        
        if (priorityQuery === 'high' || priorityQuery === 'h') {
          setPriorityFilter('high');
          resetOtherFilters('priority');
        } else if (priorityQuery === 'medium' || priorityQuery === 'med' || priorityQuery === 'm') {
          setPriorityFilter('medium');
          resetOtherFilters('priority');
        } else if (priorityQuery === 'low' || priorityQuery === 'l') {
          setPriorityFilter('low');
          resetOtherFilters('priority');
        } else {
          setPriorityFilter(null);
        }
      } else if (lowerValue.startsWith('assignee:') || lowerValue.startsWith('@')) {
        // Assignee search
        const assigneeQuery = lowerValue.startsWith('assignee:') 
          ? lowerValue.substring(9).trim() 
          : lowerValue.substring(1).trim();
        
        if (assigneeQuery) {
          // First try exact match (case insensitive)
          const exactMemberMatch = members.find(member => 
            member.name.toLowerCase() === assigneeQuery.toLowerCase());
          
          if (exactMemberMatch) {
            // Set the assignee filter
            setAssigneeFilter(exactMemberMatch.id);
            resetOtherFilters('assignee');
          } else {
            // If no exact match found, try to find a member whose name contains the query
            const partialMatches = members.filter(member => 
              member.name.toLowerCase().includes(assigneeQuery.toLowerCase()));
            
            if (partialMatches.length > 0) {
              // Set the assignee filter
              setAssigneeFilter(partialMatches[0].id);
              resetOtherFilters('assignee');
            } else {
              // If no member found, keep the search text but don't set assignee filter
              setAssigneeFilter(null);
            }
          }
        } else {
          setAssigneeFilter(null);
        }
      } else if (lowerValue === 'high' || lowerValue === 'h') {
        // Direct priority terms
        setPriorityFilter('high');
        resetOtherFilters('priority');
      } else if (lowerValue === 'medium' || lowerValue === 'med' || lowerValue === 'm') {
        setPriorityFilter('medium');
        resetOtherFilters('priority');
      } else if (lowerValue === 'low' || lowerValue === 'l') {
        setPriorityFilter('low');
        resetOtherFilters('priority');
      } else {
        if (value.trim() !== '') {
          const exactMemberMatch = members.find(member => 
            member.name.toLowerCase() === lowerValue);
          
          if (exactMemberMatch) {
            setAssigneeFilter(exactMemberMatch.id);
            resetOtherFilters('assignee');
          } else {
            const partialMatches = members.filter(member => 
              member.name.toLowerCase().includes(lowerValue));
            
            if (partialMatches.length > 0) {
              const firstMatch = partialMatches[0];
              setAssigneeFilter(firstMatch.id);
              resetOtherFilters('assignee');
            }
          }
        }
        if (tagFilter || priorityFilter || assigneeFilter) {
          resetOtherFilters(null);
        }
      }
    }, 300); 
  };

  // Clear search when Escape key is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchText('');
      resetOtherFilters(null);
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
    }
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchText('');
    resetOtherFilters(null);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    setShowFilters(false);
  };
  
  // Toggle filter panel visibility
  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <div className="relative flex-grow max-w-lg mx-auto md:mx-0 z-[100]">
      <div className="relative">
        <input
          type="text"
          className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   text-sm transition-all border-gray-300 dark:border-gray-600 
                   bg-white/90 dark:bg-gray-700/90 backdrop-blur-md
                   dark:text-white`}
          placeholder="Search tasks, #tags, @assignee, p:priority..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {}}
          onBlur={() => {}}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
        </div>
        {/* Clear search button */}
        {searchText && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={clearSearch}
            title="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
        {/* Filter button - hidden on mobile */}
        <button
          className={`absolute inset-y-0 right-10 pr-2 hidden sm:flex items-center ${showFilters || priorityFilter || tagFilter || assigneeFilter ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}
          onClick={toggleFilters}
          title="Toggle filters"
        >
          <Filter className="h-4 w-4 hover:text-blue-600" />
        </button>
        

      </div>
      
      {/* Active filters indicators */}
      {(priorityFilter || tagFilter || assigneeFilter) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {priorityFilter && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityFilter === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : priorityFilter === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}>
              Priority: {priorityFilter}
              <button onClick={() => setPriorityFilter(null)} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {tagFilter && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
              Tag: {tagFilter}
              <button onClick={() => setTagFilter(null)} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {assigneeFilter && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
              Assignee: {members.find(m => m.id === assigneeFilter)?.name || 'Unknown'}
              <button onClick={() => setAssigneeFilter(null)} className="ml-1 focus:outline-none">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
      
      {/* Filter panel */}
      {showFilters && (
        <div className={`absolute ${filterPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'} w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-md shadow-lg border border-white/20 dark:border-gray-700/20 p-3 z-[1000]`}>
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { 
                  setSearchText('');
                  setPriorityFilter('high'); 
                  resetOtherFilters('priority');
                  setShowFilters(false);
                }}
                className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'high' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
              >
                High
              </button>
              <button 
                onClick={() => { 
                  setSearchText('');
                  setPriorityFilter('medium'); 
                  resetOtherFilters('priority');
                  setShowFilters(false);
                }}
                className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}
              >
                Medium
              </button>
              <button 
                onClick={() => { 
                  setSearchText('');
                  setPriorityFilter('low'); 
                  resetOtherFilters('priority');
                  setShowFilters(false);
                }}
                className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'low' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'}`}
              >
                Low
              </button>
            </div>
          </div>
          
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Common Tags</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { 
                  setSearchText('');
                  setTagFilter('bug'); 
                  resetOtherFilters('tag');
                  setShowFilters(false);
                }}
                className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'bug' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                Bug
              </button>
              <button 
                onClick={() => { 
                  setSearchText('');
                  setTagFilter('feature'); 
                  resetOtherFilters('tag');
                  setShowFilters(false);
                }}
                className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'feature' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                Feature
              </button>
              <button 
                onClick={() => { 
                  setSearchText(''); 
                  setTagFilter('ui'); 
                  resetOtherFilters('tag');
                  setShowFilters(false); 
                }}
                className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'ui' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                UI
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Team Members</h4>
            <div className="flex flex-wrap gap-2">
              {members.map(member => (
                <button 
                  key={member.id}
                  onClick={() => { 
                    setSearchText(''); 
                    setAssigneeFilter(member.id); 
                    resetOtherFilters('assignee');
                    setShowFilters(false); 
                  }}
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
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button 
              onClick={clearSearch}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
