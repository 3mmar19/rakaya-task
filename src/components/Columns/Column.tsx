import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types/task';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from '../Tasks/TaskCard';
import TaskForm from '../Tasks/TaskForm';
import Modal from '../UI/Modal';
import { Plus } from 'lucide-react';

//---------------------------------------------------------------- Column Props Interface ------------------------------------------------------//
interface ColumnProps {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  showHeader?: boolean;
  onDeleteRequest?: (taskId: string, taskTitle: string) => void;
}

//---------------------------------------------------------------- Column Component ------------------------------------------------------//
const Column: React.FC<ColumnProps> = ({ id, title, color, tasks, showHeader = true, onDeleteRequest }) => {
  // State to control the add task form
  const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
  
  // Setup droppable for this column
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });
  
  // Extract task IDs for SortableContext
  const taskIds = tasks.map(task => task.id);
  
  // Function to handle closing the add task form
  const handleCloseAddTaskForm = () => {
    setIsAddTaskFormOpen(false);
  };
  
  // Map column ID to appropriate background color classes with glass effect styling
  const getColumnHeaderClass = () => {
    // Base glass effect styling for all columns
    const baseGlassStyle = 'backdrop-blur-xl backdrop-saturate-[180%] border border-white/20 dark:border-gray-700/20 shadow-lg rounded-lg';
    
    switch (id) {
      case 'backlog':
        return `${baseGlassStyle} bg-[#c1c1c1] dark:bg-gray-700/50`;
      case 'todo':
        return `${baseGlassStyle} bg-blue-500/30 dark:bg-blue-700/30`;
      case 'in-progress':
        return `${baseGlassStyle} bg-amber-500/30 dark:bg-amber-700/30`;
      case 'review':
        return `${baseGlassStyle} bg-green-500/30 dark:bg-green-700/30`;
      default:
        return `${baseGlassStyle} bg-gray-500/30 dark:bg-gray-700/30`;
    }
  };
  
  return (
    <div 
      ref={setNodeRef}
      className={`bg-white/40 dark:bg-gray-900 backdrop-blur-sm backdrop-saturate-150 flex flex-col h-full rounded-xl p-2 ${
        isOver ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Only render header if showHeader is true */}
      {showHeader && (
        <div className={`${getColumnHeaderClass()} p-4 mb-3`}>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full bg-${color} mr-2 shadow-sm`}></div>
            <h3 className="font-medium text-sm text-gray-900 dark:text-white">{title}</h3>
            <span className="ml-2 text-xs bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">{tasks.length}</span>
          </div>
        </div>
      )}
      
      <div className={`flex-grow ${showHeader ? 'p-4' : ''}`}>
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-gray-400 dark:text-gray-500 text-sm italic border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-md">
            No tasks
          </div>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} onDeleteRequest={onDeleteRequest} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
      
      <div className={`${showHeader ? 'p-4' : ''} pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto`}>
        <button 
          className="w-full py-2 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          onClick={() => setIsAddTaskFormOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add a card
        </button>
      </div>
      
      {/* Task Form Modal - Using Portal to render at document root */}
      <Modal
        isOpen={isAddTaskFormOpen}
        onClose={handleCloseAddTaskForm}
        title="Add New Card"
      >
        <TaskForm 
          status={id} 
          onClose={handleCloseAddTaskForm} 
        />
      </Modal>
    </div>
  );
};

export default Column;
