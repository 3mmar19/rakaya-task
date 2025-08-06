import React, { useState, useEffect, useRef } from 'react';
import useMemberStore from '../../store/memberStore';
import useTagStore from '../../store/tagStore';
import useTaskStore from '../../store/taskStore';
import {LayoutGrid, Plus, Tag, X, Clock, CalendarOff } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns'; //using date fns library for calc deadline

//---------------------------------------------------------------- BoardHeader Component ------------------------------------------------------//
interface BoardHeaderProps {
  onAddTask: () => void;
  onAddMember: () => void;
}
const BoardHeader: React.FC<BoardHeaderProps> = ({ onAddTask, onAddMember }) => {
  const [activeView, setActiveView] = useState('board');
  
  // for members and tasks from stores 
  const { tasks } = useTaskStore();
  const members = useMemberStore((state) => state.members);

  // for tags management state from store
  const { tags, addTag: addTagToStore, removeTag: removeTagFromStore } = useTagStore();
  const [newTag, setNewTag] = useState<string>('');
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const MAX_TAG_LENGTH = 20;

  // for Tag helper functions
  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag !== '') {
      if (tags.includes(trimmedTag)) {
        // Show duplicate warning
        setShowDuplicateWarning(true);
        setTimeout(() => setShowDuplicateWarning(false), 2000);
      } else if (trimmedTag.length <= MAX_TAG_LENGTH) {
        addTagToStore(trimmedTag);
        setNewTag('');
        setIsAddingTag(false);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    removeTagFromStore(tagToRemove);
  };
  
  // Tag click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tagInputRef.current && !tagInputRef.current.contains(event.target as Node)) {
        if (newTag.trim() !== '') {
          addTag();
        } else {
          setIsAddingTag(false);
        }
      }
    }

    if (isAddingTag) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddingTag, newTag, addTag]);

  // Get tag color based on tag content
  const getTagColorClasses = (tag: string) => {
    const colorOptions = [
      {
        bg: "bg-blue-100/80 dark:bg-blue-900/80",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200/30 dark:border-blue-800/30"
      },
      {
        bg: "bg-green-100/80 dark:bg-green-900/80",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-200/30 dark:border-green-800/30"
      },
      {
        bg: "bg-orange-100/80 dark:bg-orange-900/80",
        text: "text-orange-800 dark:text-orange-300",
        border: "border-orange-200/30 dark:border-orange-800/30"
      },
      {
        bg: "bg-purple-100/80 dark:bg-purple-900/80",
        text: "text-purple-800 dark:text-purple-300",
        border: "border-purple-200/30 dark:border-purple-800/30"
      },
      {
        bg: "bg-pink-100/80 dark:bg-pink-900/80",
        text: "text-pink-800 dark:text-pink-300",
        border: "border-pink-200/30 dark:border-pink-800/30"
      },
      {
        bg: "bg-teal-100/80 dark:bg-teal-900/80",
        text: "text-teal-800 dark:text-teal-300",
        border: "border-teal-200/30 dark:border-teal-800/30"
      }
    ];
    
    // Simple hash function to get a consistent index
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = hash % colorOptions.length;
    
    return colorOptions[colorIndex];
  };
  
  // Helper function to get color for days left text
  const getDaysLeftColor = (daysLeft: number): string => {
    if (daysLeft <= 2) return 'text-orange-500 dark:text-orange-400'; // Urgent
    if (daysLeft <= 7) return 'text-yellow-600 dark:text-yellow-400'; // Soon
    return 'text-green-600 dark:text-green-400'; // Plenty of time
  };
  
  // Helper function to get text for days left
  const getDaysLeftText = (daysLeft: number): string => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} ${Math.abs(daysLeft) === 1 ? 'day' : 'days'} overdue`;
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    return `${daysLeft} days left`;
  };

  useEffect(() => {
    // No need for click outside handler with native date input
  return () => {};
}, []);

  // Simple deadline state using ISO string format for HTML date input
  const [deadline, setDeadline] = useState(() => {
    const savedDeadline = localStorage.getItem('boardDeadline');
    if (savedDeadline) {
      return savedDeadline;
    }
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  });

  useEffect(() => {
    //---------------------------------------------------------------- Save deadline to localStorage on change ------------------------------------------------------//
    localStorage.setItem('boardDeadline', deadline);
  }, [deadline]);

  return (
    <>
      <div className="relative bg-white/70 dark:bg-gray-900 shadow-sm">
      {/*-------------------------------------------------- Project Info Section --------------------------------------------------*/}
      <div className="p-[0.3rem]">
        {/* Project Path */}
        <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400  overflow-x-auto scrollbar-hide whitespace-nowrap backdrop-blur-sm rounded-lg py-1.5 px-2.5 w-fit">
          <span>Projects</span>
          <span className="mx-1">/</span>
          <span>Today Task</span>
        </div>
        
        {/*---------------------------------------------------- Project Title ----------------------------------------------------*/}
        <div className="backdrop-blur-sm rounded-lg p-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3">Rakaya Task</h1>
          
          {/* Project Stats for better overview */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-1.5 shadow-md">
              <span className="text-xs text-gray-500 dark:text-gray-400">Members</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{members.length}</span>
            </div>
            <div className="flex flex-col items-center bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-1.5 shadow-md">
              <span className="text-xs text-gray-500 dark:text-gray-400">Tasks</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">{tasks.length}</span>
            </div>
            <div className="flex flex-col items-center bg-white/50 dark:bg-gray-800/50 rounded-lg px-3 py-1.5 shadow-md">
              <span className="text-xs text-gray-500 dark:text-gray-400">Tags</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{tags.length}</span>
            </div>
          </div>
        </div>
        
        {/*---------------------------------------------------- Project Details ----------------------------------------------------*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 backdrop-blur-sm rounded-lg p-3">
          {/* Assigned To */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24 mb-2 sm:mb-0">Assigned to</span>
            <div className="flex flex-wrap -space-x-2">
              {members.slice(0, 4).map(member => (
                <img key={member.id} src={member.avatar || `https://ui-avatars.com/api/?name=${member.name}`} alt={member.name} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" 
                  title={member.name}
                />
              ))}
              <button 
                onClick={onAddMember} 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-500 border-2 border-dashed border-blue-500 shadow-sm transition-colors"
                >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
          
          {/*---------------------------------------------------- Deadline ----------------------------------------------------*/}
          <div className="flex flex-row sm:flex-row sm:items-center gap-2">
            <CalendarOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1"/>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0 mt-1">Deadline</span>
            <div className="flex flex-row">
              <div className="relative flex items-center bg-white/50 dark:bg-gray-700/50 rounded-md px-2 py-1 shadow-lg">
                <input 
                  type="date" 
                  value={deadline} 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="text-xs sm:text-sm text-gray-900 dark:text-white bg-transparent border-none outline-none p-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert"
                />
              </div>
              {deadline && (
                <div className="flex items-center mt-1 ml-[1rem]">
                  <Clock className="w-3 h-3 mr-1 text-blue-500" />
                  <span className={`text-xs ${getDaysLeftColor(differenceInDays(parseISO(deadline), new Date()))}`}>
                    {getDaysLeftText(differenceInDays(parseISO(deadline), new Date()))}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/*---------------------------------------------------- Tags ----------------------------------------------------*/}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 relative">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">Tags:</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap overflow-x-auto scrollbar-hide">
                {/* Existing tags */}
                {tags.map((tag) => {
                  const tagColor = getTagColorClasses(tag);
                  return (
                    <span 
                      key={tag} 
                      className={`px-2 py-0.5 sm:py-1 ${tagColor.bg} ${tagColor.text} text-xs font-medium rounded-full backdrop-blur-sm ${tagColor.border} shadow-sm flex items-center gap-1 transition-all duration-200`}
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)} 
                        className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Remove tag"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  );
                })}
                
                {/* Add tag button or input field */}
                {isAddingTag ? (
                  <div className="relative">
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={newTag}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_TAG_LENGTH) {
                          setNewTag(e.target.value);
                          setShowDuplicateWarning(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addTag();
                        } else if (e.key === 'Escape') {
                          setIsAddingTag(false);
                          setNewTag('');
                        }
                      }}
                      autoFocus
                      className="px-2 py-0.5 text-xs border border-blue-300 dark:border-blue-700 rounded-full bg-white/80 dark:bg-gray-800/80 focus:outline-none focus:ring-1 focus:ring-blue-500 text-black dark:text-white"
                      placeholder="Enter tag..."
                    />
                    <div className="absolute -bottom-5 right-0 text-xs text-gray-500 dark:text-gray-400">
                      {newTag.length}/{MAX_TAG_LENGTH}
                    </div>
                    {showDuplicateWarning && (
                      <div className="absolute -bottom-5 left-0 text-xs text-red-500 dark:text-red-400">
                        Tag already exists
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="flex items-center px-2 py-0.5 sm:py-1 text-xs border border-dashed border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <Plus size={12} className="mr-1" />
                    Add tags
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* View Navigation */}
      <div className="flex flex-wrap overflow-x-auto scrollbar-hide backdrop-blur-sm">
        <button 
          className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 ${activeView === 'board' ? 'border-b-2 border-blue-500 text-blue-600 bg-white/50 dark:bg-gray-100/0' : 'text-gray-500 dark:text-gray-400 hover:bg-white/30 dark:hover:bg-gray-700'} transition-colors`}
          onClick={() => setActiveView('board')}
        >
          <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 dark:text-white" />
          <span className="text-sm sm:text-base dark:text-white">Board</span>
        </button>
        {/* Add new task button */}
        <div className="ml-auto pr-4 flex flex-col items-start sm:items-end mt-4 mb-4 sm:mt-0 z-10">
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={onAddTask}
              className="bg-blue-500/90 hover:bg-blue-600/90 text-white px-3 sm:px-4 py-1.5 rounded-md flex items-center text-xs sm:text-sm font-medium whitespace-nowrap shadow-sm backdrop-blur-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Add task
            </button>
            <div className="hidden sm:flex px-2 py-1 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border border-white/10 dark:border-gray-700/10 rounded-lg text-xs text-gray-600 dark:text-gray-400 items-center shadow-sm">
              <span className="px-1.5 py-0.5 bg-white/50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-mono">Space</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-2 hidden sm:block">Press space anywhere to quickly add a task</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default BoardHeader;
