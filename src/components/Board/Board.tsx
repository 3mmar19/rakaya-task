import React, { useState, useEffect } from 'react';
import TaskForm from '../Tasks/TaskForm';
import MemberForm from '../UI/MemberForm';
import Modal from '../UI/Modal';
import { AlertTriangle } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  MeasuringStrategy
} from '@dnd-kit/core';
import useTaskStore from '../../store/taskStore';
import useFilterStore from '../../store/filterStore';
import { COLUMNS, TaskStatus, Task } from '../../types/task';
import { filterAndSortTasks } from '../../utils/taskUtils';
import Column from '../Columns/Column';
import TaskCard from '../Tasks/TaskCard';
import BoardHeader from './BoardHeader';


// Interface for delete confirmation dialog
interface DeleteConfirmState {
  isOpen: boolean;
  taskId: string | null;
  taskTitle: string | null;
}


interface BoardProps {
  isAddTaskModalOpen: boolean;
  setIsAddTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Board: React.FC<BoardProps> = ({ isAddTaskModalOpen, setIsAddTaskModalOpen }) => {
  const { tasks, moveTask, deleteTask } = useTaskStore();
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const { searchText, priorityFilter, statusFilter, sortOption, assigneeFilter, tagFilter } = useFilterStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // State for delete confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    taskId: null,
    taskTitle: null
  });
  
  // Function to open delete confirmation dialog
  const openDeleteConfirm = (taskId: string, taskTitle: string) => {
    setDeleteConfirm({
      isOpen: true,
      taskId,
      taskTitle
    });
  };
  
  // Function to close delete confirmation dialog
  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      taskId: null,
      taskTitle: null
    });
  };
  
  // Function to handle task deletion
  const handleDeleteTask = () => {
    if (deleteConfirm.taskId) {
      deleteTask(deleteConfirm.taskId);
      closeDeleteConfirm();
    }
  };
  
  // Space  shortcut to add new task
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if space key was pressed and no input elements are focused
      if (event.code === 'Space' && 
          !['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((document.activeElement?.tagName || '').toUpperCase()) &&
          !isAddTaskModalOpen) {
        event.preventDefault(); // Prevent page scrolling
        setIsAddTaskModalOpen(true);
      }
      
      // Close modal with Escape key
      if (event.key === 'Escape' && isAddTaskModalOpen) {
        setIsAddTaskModalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
        return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddTaskModalOpen, setIsAddTaskModalOpen]);

  // Function to trigger vibration on mobile devices
  const vibrate = (duration = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const sensors = useSensors(
    // For mouse and desktop
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        tolerance: 5,
        delay: 100,
      },
    }),
    // Touch  for mobile
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 0,
      },
    }),
    // Keyboard accessibility
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        return {
          x: 0,
          y: 0,
        };
      },
    })
  );

  const filteredTasks = filterAndSortTasks(
    tasks,
    searchText,
    priorityFilter,
    statusFilter,
    sortOption,
    assigneeFilter,
    tagFilter
  );

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'task') {
      setActiveTask(event.active.data.current.task);
      // Provide haptic on mobile
      vibrate(50);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;
    const isActiveATask = active.data.current?.type === 'task';
    const isOverAColumn = over.data.current?.type === 'column' || Object.keys(COLUMNS).includes(over.id.toString());
    if (isActiveATask && isOverAColumn && active.data.current) {
      const task = active.data.current.task as Task;
      const newStatus = over.id as TaskStatus;
      if (task.status !== newStatus) {
        moveTask(task.id, newStatus);
        // Provide haptic on mobile
        vibrate(100);
      }
    }
  };

  return (
    <div className="flex flex-col flex-grow bg-white dark:bg-gray-900">
      <div className="flex flex-col">
        <BoardHeader 
          onAddTask={() => setIsAddTaskModalOpen(true)} 
          onAddMember={() => setIsAddMemberModalOpen(true)}
        />
      
        <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-[15px]">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            measuring={{
              droppable: {
                strategy: MeasuringStrategy.Always,
              },
            }}
          >
            <div className="pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(COLUMNS).map(([status, { title, color }]) => (
                  <Column
                    key={status}
                    id={status as TaskStatus}
                    title={title}
                    color={color}
                    tasks={getTasksByStatus(status as TaskStatus)}
                    onDeleteRequest={openDeleteConfirm}
                    showHeader={true}
                  />
                ))}
              </div>
            </div>

            <DragOverlay>
              {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      
      {/*---------------------------------------------- Task Form Modal ----------------------------------------- */}
      <Modal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        title="Add New Task"
        maxWidth="max-w-md lg:max-w-lg"
      >
        <TaskForm 
          status="backlog" 
          onClose={() => setIsAddTaskModalOpen(false)} 
        />
      </Modal>
      
      {/*---------------------------------------------- Member Form Modal ----------------------------------------- */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add New Member"
        maxWidth="max-w-md"
      >
        <MemberForm onClose={() => setIsAddMemberModalOpen(false)} />
      </Modal>
      
      {/*---------------------------------------------- Delete Confirmation Dialog ----------------------------------------- */}
      <Modal
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        title="Confirm Delete"
        maxWidth="max-w-sm"
      >
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-black-600 dark:text-white font-medium">Delete Task</span>
        </div> 
        <p className="text-xs text-black-600 dark:text-gray-300 mb-4">
          Are you sure you want to delete the task <span className="font-medium">"{deleteConfirm.taskTitle}"</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-2">
          <button 
            className="px-3 py-1.5 text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-600/80 rounded border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 transition-all duration-200"
            onClick={closeDeleteConfirm}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-xs bg-red-500/70 hover:bg-red-500/90 rounded border border-red-500/20 text-white transition-all duration-200"
            onClick={handleDeleteTask}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Board;

