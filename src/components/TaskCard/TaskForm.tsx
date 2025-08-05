import React, { useState, useEffect } from 'react';
import useTaskStore from '../../store/taskStore';
import useMemberStore from '../../store/memberStore';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { Check, AlertCircle, AlertTriangle, CircleDot } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  status?: TaskStatus;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, status, onClose }) => {
  const { addTask, updateTask } = useTaskStore();
  const members = useMemberStore((state) => state.members);
  const { showToast } = useToast();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [currentStatus, setCurrentStatus] = useState<TaskStatus>(task?.status || status || 'backlog');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(task?.assignedMemberIds || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  
  // Maximum description length
  const MAX_DESCRIPTION_LENGTH = 500;
  
  // Track if form has been modified
  useEffect(() => {
    if (title !== (task?.title || '') || 
        description !== (task?.description || '') ||
        priority !== (task?.priority || 'medium') ||
        currentStatus !== (task?.status || status || 'backlog') ||
        JSON.stringify(selectedMemberIds) !== JSON.stringify(task?.assignedMemberIds || [])) {
      setFormTouched(true);
    }
  }, [title, description, priority, currentStatus, selectedMemberIds, task, status]);

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Validate title
    if (!title.trim()) {
      setTitleError('Title is required');
      isValid = false;
    } else {
      setTitleError('');
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    // Show loading state
    setIsSubmitting(true);
    
    try {
      const taskData = {
        title,
        description,
        priority,
        status: currentStatus,
        assignedMemberIds: selectedMemberIds,
      };
      await new Promise(resolve => setTimeout(resolve, 500));

      if (task) {
        updateTask(task.id, taskData);
        showToast(`Task "${title}" updated successfully`, 'success');
      } else {
        addTask(taskData);
        showToast(`Task "${title}" created successfully`, 'success');
      }

      onClose();
    } catch (error) {
      showToast('Error saving task. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value.trim()) setTitleError('');
          }} 
          className={`w-full p-1.5 rounded-md bg-white/50 dark:bg-gray-700/50 border ${titleError ? 'border-red-500 dark:border-red-500' : 'border-white/20 dark:border-gray-700/20'} text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder-gray-400 dark:placeholder-gray-500`}
          placeholder="Task title"
        />
        {titleError && <p className="text-xs text-red-500 mt-1 animate-fade-in">{titleError}</p>}
      </div>
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="description" className="block text-xs font-medium text-gray-700 dark:text-white">Description</label>
          <span className={`text-xs ${description.length > MAX_DESCRIPTION_LENGTH ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
          rows={2}
          placeholder="Enter task description"
          className={`block w-full px-2 py-1 bg-white/90 dark:bg-gray-700/90 border ${description.length > MAX_DESCRIPTION_LENGTH * 0.9 ? 'border-yellow-400 dark:border-yellow-500' : 'border-white/20 dark:border-gray-700/20'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white text-sm transition-all duration-200`}
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-white mb-0.5">Status</label>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => setCurrentStatus('backlog')}
            className={`py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 ${currentStatus === 'backlog' 
              ? 'bg-gray-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            Backlog
          </button>
          <button
            type="button"
            onClick={() => setCurrentStatus('todo')}
            className={`py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 ${currentStatus === 'todo' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            To Do
          </button>
          <button
            type="button"
            onClick={() => setCurrentStatus('in-progress')}
            className={`py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 ${currentStatus === 'in-progress' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            In Progress
          </button>
          <button
            type="button"
            onClick={() => setCurrentStatus('review')}
            className={`py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 ${currentStatus === 'review' 
              ? 'bg-green-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            Need Review
          </button>
        </div>
      </div>
          
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Priority</label>
        <div className="flex flex-row space-x-1">
          <button
            type="button"
            onClick={() => setPriority('low')}
            className={`flex-1 py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center ${priority === 'low' 
              ? 'bg-green-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            <CircleDot className="h-3 w-3 mr-1.5" />
            <span>Low</span>
          </button>
          <button
            type="button"
            onClick={() => setPriority('medium')}
            className={`flex-1 py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center ${priority === 'medium' 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            <AlertTriangle className="h-3 w-3 mr-1.5" />
            <span>Medium</span>
          </button>
          <button
            type="button"
            onClick={() => setPriority('high')}
            className={`flex-1 py-1 px-1.5 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center ${priority === 'high' 
              ? 'bg-red-500 text-white' 
              : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
          >
            <AlertCircle className="h-3 w-3 mr-1.5" />
            <span>High</span>
          </button>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">Assign Members</label>
        <div className="grid grid-cols-2 gap-1">
          {members.map(member => (
            <div 
              key={member.id} 
              onClick={() => toggleMemberSelection(member.id)}
              className={`flex items-center p-1.5 rounded-lg cursor-pointer transition-all duration-200 ${selectedMemberIds.includes(member.id) 
                ? 'bg-blue-100/70 dark:bg-blue-900/70 border border-blue-500/70 dark:border-blue-400/70' 
                : 'bg-white/50 dark:bg-gray-700/50 border border-white/20 dark:border-gray-700/20 hover:bg-white/60 dark:hover:bg-gray-600/60'}`}
            >
              <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full mr-2" />
              <div>
                <span className="text-xs font-medium text-gray-800 dark:text-white">{member.name}</span>
                <p className="text-xs text-black-500 dark:text-gray-400 text-opacity-80">{member.role}</p>
              </div>
              {selectedMemberIds.includes(member.id) && (
                <div className="ml-auto bg-blue-500/80 text-white rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
        {members.length === 0 && (
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 dark:border-gray-700/20 text-center backdrop-blur-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400">No members available</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Add members from the board header</p>
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-2 border-t border-white/20 dark:border-gray-700/20 mt-2">
        <button 
          type="button" 
          onClick={onClose} 
          disabled={isSubmitting}
          className="px-3 py-1 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-red-500 dark:hover:bg-red-600/60 text-xs font-medium transition-all duration-200 border border-white/20 dark:border-gray-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting || (task && !formTouched) || (!title.trim())}
          className={`px-3 py-1 text-white rounded-lg text-xs font-medium shadow-sm hover:shadow transition-all duration-200 backdrop-blur-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[70px] ${!title.trim() ? 'bg-[#ff2355c9] hover:bg-[#ff2355c9]' : formTouched ? 'bg-blue-600/90 hover:bg-blue-700/90' : 'bg-blue-400/90 hover:bg-blue-500/90'}`}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" color="white" className="mr-2" />
              <span>{task ? 'Saving...' : 'Adding...'}</span>
            </>
          ) : title.trim() === '' ? (
            'Enter Title'
          ) : task && !formTouched ? (
            'No Changes'
          ) : (
            task ? 'Save Changes' : 'Add Task'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
