import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus } from '../types/task';

//---------------------------------------------------------------- Task Store State Interface ------------------------------------------------------//
interface TaskState {
  tasks: Task[];
  assignMemberToTask: (taskId: string, memberId: string) => void;
  unassignMemberFromTask: (taskId: string, memberId: string) => void;
  
  // CRUD Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & { deadline?: Date }) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  
  // Drag and Drop
  moveTask: (id: string, newStatus: TaskStatus) => void;
  
  // Getters
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTaskById: (id: string) => Task | undefined;
}

//---------------------------------------------------------------- Create Task Store ------------------------------------------------------//
const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      assignMemberToTask: (taskId, memberId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignedMemberIds: [...(task.assignedMemberIds || []), memberId],
                }
              : task
          ),
        })),
      unassignMemberFromTask: (taskId, memberId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignedMemberIds: (task.assignedMemberIds || []).filter(
                    (id) => id !== memberId
                  ),
                }
              : task
          ),
        })),
      tasks: [],
      
      addTask: (task) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: uuidv4(),
              ...task,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => 
            task.id === id 
              ? { 
                  ...task, 
                  ...updates, 
                  updatedAt: new Date() 
                } 
              : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      moveTask: (id, newStatus) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: newStatus,
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status);
      },
      
      getTaskById: (id) => {
        return get().tasks.find((task) => task.id === id);
      },
    }),
    {
      name: 'task-storage', // name of the localStorage item
      version: 1, // version number for migrations
    }
  )
);

export default useTaskStore;
