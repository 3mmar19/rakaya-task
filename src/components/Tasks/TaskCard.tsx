import React, { useState } from 'react';
import { Task } from '../../types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskForm from './TaskForm';
import TaskAssignments from './TaskAssignments';
import Modal from '../UI/Modal';
import { AlertCircle, CircleDot, Edit, Trash, AlertTriangle } from 'lucide-react';
//---------------------------------------------------------------- TaskCard Props Interface ------------------------------------------------------//
interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onDeleteRequest?: (taskId: string, taskTitle: string) => void;
}

//---------------------------------------------------------------- TaskCard Component ------------------------------------------------------//
const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay = false, onDeleteRequest }) => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  
  // Only use sortable if not in overlay mode
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task
    },
    disabled: isOverlay
  });
  
  // Apply the transform and transition to the card element with enhanced animations
  const style = isOverlay 
    ? { 
        width: '100%',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
        cursor: 'grabbing',
        transform: 'scale(1.02) rotate(2deg)', // Slightly larger and rotated when dragging
        zIndex: 50,
      } 
    : {
        transform: CSS.Transform.toString(transform),
        transition: isDragging 
          ? 'transform 200ms cubic-bezier(0.18, 0.67, 0.6, 1.22)' // Bouncy effect during drag
          : 'transform 250ms cubic-bezier(0.2, 1, 0.1, 1), opacity 250ms ease', // Smooth return on drop
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
      };

  return (
    <>
      <div
        ref={!isOverlay ? setNodeRef : undefined}
        style={{...style}}
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
        className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ease-in-out p-4 mb-3 
          ${isDragging ? 'shadow-lg opacity-50' : 'hover:shadow-md hover:translate-y-[-2px]'} 
          ${isOverlay ? 'cursor-grabbing scale-105 shadow-xl' : 'cursor-grab'}`}
      >
        <div className="flex justify-between items-start mb-2">
          {/* Priority Tag */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200'}`}>
            {task.priority === 'high' ? (
              <AlertCircle className="h-4 w-4 mr-1" />
            ) : task.priority === 'medium' ? (
              <AlertTriangle className="h-4 w-4 mr-1" />
            ) : (
              <CircleDot className="h-4 w-4 mr-1" />
            )}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
            {/* Edit Button */}
            <div 
              className="relative z-20 w-full sm:w-auto" 
              onMouseDown={(e) => e.stopPropagation()} 
              onTouchStart={(e) => e.stopPropagation()}
            >
              <button 
                className="p-1.5 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-gray-500 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110 w-full sm:w-auto"
                title="Edit task"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag from starting
                  e.preventDefault(); // Prevent any default behavior
                  setIsEditFormOpen(true);
                }}
              >
                <Edit className="h-4 w-4 md:h-5 md:w-5 mx-auto" />
              </button>
            </div>
            
            {/* Delete Button */}
            <div 
              className="relative z-20 w-full sm:w-auto" 
              onMouseDown={(e) => e.stopPropagation()} 
              onTouchStart={(e) => e.stopPropagation()}
            >
              <button 
                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-gray-500 dark:hover:text-red-400 transition-all duration-200 transform hover:scale-110 w-full sm:w-auto"
                title="Delete task"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent drag from starting
                  e.preventDefault(); // Prevent any default behavior
                  if (onDeleteRequest) {
                    onDeleteRequest(task.id, task.title);
                  }
                }}
              >
                <Trash className="h-4 w-4 md:h-5 md:w-5 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Task Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>
        
        {/* Task Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{task.description}</p>
        
        {/* Task Footer */}
        <div className="flex items-center justify-between mt-4">
          {/* Assigned Members */}
          <TaskAssignments taskId={task.id} assignedMemberIds={task.assignedMemberIds || []} />
        </div>
      </div>
      
      <Modal
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        title="Edit Task"
        maxWidth="max-w-md lg:max-w-lg"
      >
        <TaskForm
          task={task}
          onClose={() => setIsEditFormOpen(false)}
        />
      </Modal>
      

    </>
  );
};

export default TaskCard;
