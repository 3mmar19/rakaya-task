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
  const [, setHasFocus] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Advanced search handler with tag, priority, and assignee detection
  const handleSearch = (value: string) => {
    const lowerValue = value.toLowerCase().trim();

    // Always update search text immediately
    setSearchText(value);

    // Clear existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
      searchTimeout.current = null;
    }
    
    // If search is cleared, reset all filters
    if (!value.trim()) {
      setPriorityFilter(null);
      setTagFilter(null);
      setAssigneeFilter(null);
    }

    // Set a new timeout to check for special search terms after user stops typing
    searchTimeout.current = setTimeout(() => {
      // Check for special search prefixes
      if (lowerValue.startsWith('tag:') || lowerValue.startsWith('#')) {
        // Tag search
        const tagQuery = lowerValue.startsWith('tag:') 
          ? lowerValue.substring(4).trim() 
          : lowerValue.substring(1).trim();
        
        if (tagQuery) {
          setTagFilter(tagQuery);
          setPriorityFilter(null);
          setAssigneeFilter(null);
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
          setTagFilter(null);
          setAssigneeFilter(null);
        } else if (priorityQuery === 'medium' || priorityQuery === 'med' || priorityQuery === 'm') {
          setPriorityFilter('medium');
          setTagFilter(null);
          setAssigneeFilter(null);
        } else if (priorityQuery === 'low' || priorityQuery === 'l') {
          setPriorityFilter('low');
          setTagFilter(null);
          setAssigneeFilter(null);
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
            // Set the assignee filter to the member's ID to filter tasks assigned to this member
            console.log('Exact member match found for @search:', exactMemberMatch.name, exactMemberMatch.id);
            
            // Keep the search text as requested by the user
            // Set the assignee filter
            setAssigneeFilter(exactMemberMatch.id);
            setPriorityFilter(null);
            setTagFilter(null);
          } else {
            // If no exact match found, try to find a member whose name contains the query
            const partialMatches = members.filter(member => 
              member.name.toLowerCase().includes(assigneeQuery.toLowerCase()));
            
            if (partialMatches.length > 0) {
              // Use the first partial match
              console.log('Partial member match found for @search:', partialMatches[0].name, partialMatches[0].id);
              
              // Keep the search text as requested by the user
              // Set the assignee filter
              setAssigneeFilter(partialMatches[0].id);
              setPriorityFilter(null);
              setTagFilter(null);
            } else {
              // If no member found, keep the search text but don't set assignee filter
              // This allows for searching task content that might mention a name
              console.log('No member matches found for @search:', assigneeQuery);
              setAssigneeFilter(null);
            }
          }
        } else {
          setAssigneeFilter(null);
        }
      } else if (lowerValue === 'high' || lowerValue === 'h') {
        // Direct priority terms
        setPriorityFilter('high');
        setTagFilter(null);
        setAssigneeFilter(null);
      } else if (lowerValue === 'medium' || lowerValue === 'med' || lowerValue === 'm') {
        setPriorityFilter('medium');
        setTagFilter(null);
        setAssigneeFilter(null);
      } else if (lowerValue === 'low' || lowerValue === 'l') {
        setPriorityFilter('low');
        setTagFilter(null);
        setAssigneeFilter(null);
      } else {
        // Check if the search text matches any team member's name directly
        // This allows searching for "John Smith" without @ or assignee: prefix
        if (value.trim() !== '') {
          // First try exact match (case insensitive)
          const exactMemberMatch = members.find(member => 
            member.name.toLowerCase() === lowerValue);
          
          if (exactMemberMatch) {
            // If we found an exact match to a member name, set the assignee filter
            console.log('Exact member match found for direct search:', exactMemberMatch.name, exactMemberMatch.id);
            
            // Keep the search text as requested by the user
            // Set the assignee filter
            setAssigneeFilter(exactMemberMatch.id);
            setPriorityFilter(null);
            setTagFilter(null);
            
            // Add a small delay to ensure the filter is applied before any other operations
            setTimeout(() => {
              console.log('Assignee filter set to:', exactMemberMatch.id);
            }, 50);
            
            return; // Exit early since we've set the filter
          }
          
          // Then try partial match (case insensitive)
          const partialMatches = members.filter(member => 
            member.name.toLowerCase().includes(lowerValue));
          
          if (partialMatches.length > 0) {
            // If we found partial matches to member names
            console.log('Partial member matches found for direct search:', partialMatches.length);
            
            // Use the first match (most relevant)
            const firstMatch = partialMatches[0];
            console.log('Using first match for direct search:', firstMatch.name, firstMatch.id);
            
            // Keep the search text as requested by the user
            setAssigneeFilter(firstMatch.id);
            setPriorityFilter(null);
            setTagFilter(null);
            
            // Add a small delay to ensure the filter is applied before any other operations
            setTimeout(() => {
              console.log('Assignee filter set to:', firstMatch.id);
            }, 50);
            
            return; // Exit early since we've set the filter
          }
        }
        
        // Regular text search - clear filters if they were set by special search terms
        if (tagFilter || priorityFilter || assigneeFilter) {
          setTagFilter(null);
          setPriorityFilter(null);
          setAssigneeFilter(null);
        }
      }
    }, 300); // 300ms delay
  };

  // Clear search when Escape key is pressed
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setSearchText('');
      setPriorityFilter(null);
      setTagFilter(null);
      setAssigneeFilter(null);
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
        searchTimeout.current = null;
      }
    }
  };

  // Clear search and filters
  const clearSearch = () => {
    setSearchText('');
    setPriorityFilter(null);
    setTagFilter(null);
    setAssigneeFilter(null);
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
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
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
                  setSearchText(''); // Clear search text to avoid confusion
                  setPriorityFilter('high'); 
                  setTagFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
                }}
                className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'high' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
              >
                High
              </button>
              <button 
                onClick={() => { 
                  setSearchText(''); // Clear search text to avoid confusion
                  setPriorityFilter('medium'); 
                  setTagFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
                }}
                className={`px-2 py-1 rounded-md text-xs ${priorityFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'}`}
              >
                Medium
              </button>
              <button 
                onClick={() => { 
                  setSearchText(''); // Clear search text to avoid confusion
                  setPriorityFilter('low'); 
                  setTagFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
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
                  setSearchText(''); // Clear search text to avoid confusion
                  setTagFilter('bug'); 
                  setPriorityFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
                }}
                className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'bug' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                Bug
              </button>
              <button 
                onClick={() => { 
                  setSearchText(''); // Clear search text to avoid confusion
                  setTagFilter('feature'); 
                  setPriorityFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
                }}
                className={`px-2 py-1 rounded-md text-xs ${tagFilter === 'feature' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}
              >
                Feature
              </button>
              <button 
                onClick={() => { 
                  setSearchText(''); // Clear search text to avoid confusion
                  setTagFilter('ui'); 
                  setPriorityFilter(null); 
                  setAssigneeFilter(null); 
                  setShowFilters(false); // Close filter panel after selection
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
                    console.log('Setting assignee filter from member selection:', member.id);
                    setSearchText(''); // Clear search text to avoid confusion
                    setAssigneeFilter(member.id); 
                    setPriorityFilter(null); 
                    setTagFilter(null); 
                    setShowFilters(false); // Close filter panel after selection
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
