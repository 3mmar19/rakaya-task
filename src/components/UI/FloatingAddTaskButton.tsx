import React from 'react';
import { Plus } from 'lucide-react';

//---------------------------------------------------------------- FloatingAddTaskButton Component ------------------------------------------------------//
interface FloatingAddTaskButtonProps {
  onAddTask: () => void;
}

const FloatingAddTaskButton: React.FC<FloatingAddTaskButtonProps> = ({ onAddTask }) => {
  return (
    <button
      onClick={onAddTask}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full glass-light backdrop-blur-xl backdrop-saturate-[180%] border border-white/20 dark:border-gray-700/20 text-blue-600 dark:text-blue-400 shadow-lg flex items-center justify-center z-50 hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200"
      aria-label="Add new task"
    >
      <Plus className="h-6 w-6" />
    </button>
  );
};

export default FloatingAddTaskButton;
