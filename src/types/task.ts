export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  assignedMemberIds?: string[]; // Optional array of member IDs
  deadline?: Date; // Optional deadline for the task
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[]; // Optional array of tags for the task
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
}

//---------------------------------------------------------------- Column definitions ------------------------------------------------------//
export const COLUMNS: Record<TaskStatus, { title: string; color: string }> = {
  'backlog': { title: 'Backlog', color: 'gray-500' },
  'todo': { title: 'To Do', color: 'blue-500' },
  'in-progress': { title: 'In Progress', color: 'yellow-500' },
  'review': { title: 'Need Review', color: 'green-500' },
};
