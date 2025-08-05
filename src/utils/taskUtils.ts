import { Task, TaskStatus, TaskPriority } from '../types/task';
import { SortOption } from '../store/filterStore';

//---------------------------------------------------------------- Task Filtering Utilities ------------------------------------------------------//

/**
 * Filters and sorts tasks based on various criteria.
 * @param tasks - The array of tasks to filter and sort.
 * @param searchText - The text to search for in task titles and descriptions.
 * @param priorityFilter - The priority to filter by.
 * @param statusFilter - The status to filter by.
 * @param sortOption - The sorting option.
 * @param assigneeFilter - The member ID to filter tasks by assignee.
 * @param tagFilter - The tag to filter tasks by.
 * @returns The filtered and sorted array of tasks.
 */
export const filterAndSortTasks = (
  tasks: Task[],
  searchText: string,
  priorityFilter: TaskPriority | null,
  statusFilter: TaskStatus | null,
  sortOption: SortOption,
  assigneeFilter: string | null = null,
  tagFilter: string | null = null
): Task[] => {
  let filteredTasks = [...tasks];

  // 1. Filter by priority first if a priority is set from search
  if (priorityFilter) {
    filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
  }

  // 2. Filter by search text for all other cases
  if (searchText) {
    const lowercasedFilter = searchText.toLowerCase();
    // This condition ensures we don't re-filter if a priority was already matched from search
    if (!['high', 'medium', 'low', 'h', 'm', 'l', 'med'].includes(lowercasedFilter)) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(lowercasedFilter) ||
            (task.description && task.description.toLowerCase().includes(lowercasedFilter))
        );
    }
  }

  // 3. Filter by status (if any is selected, usually from a dropdown)
  if (statusFilter) {
    filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
  }
  
  // 4. Filter by assignee if specified
  if (assigneeFilter) {
    console.log('Filtering by assignee ID:', assigneeFilter);
    
    // First, check if we have any tasks with this assignee
    const tasksWithAssignee = filteredTasks.filter(task => {
      // Ensure task has assignedMemberIds and it's an array
      if (!task.assignedMemberIds || !Array.isArray(task.assignedMemberIds)) {
        return false;
      }
      
      // Check if the assignee ID is in the task's assignedMemberIds array
      const hasAssignee = task.assignedMemberIds.includes(assigneeFilter);
      
      // For debugging
      if (hasAssignee) {
        console.log(`Task ${task.id} has assignee ${assigneeFilter}`);
      }
      
      return hasAssignee;
    });
    
    console.log(`Found ${tasksWithAssignee.length} tasks with assignee ID ${assigneeFilter}`);
    
    // Apply the filter
    filteredTasks = tasksWithAssignee;
  }
  
  // 5. Filter by tag if specified
  if (tagFilter) {
    filteredTasks = filteredTasks.filter(task => 
      task.tags && task.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
    );
  }

  // 4. Sort tasks
  const tasksCopy = [...filteredTasks];
  switch (sortOption) {
    case 'newest':
      return tasksCopy.sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    case 'oldest':
      return tasksCopy.sort((a: Task, b: Task) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    case 'priority-high':
      return tasksCopy.sort((a: Task, b: Task) => {
        const priorityOrder: Record<TaskPriority, number> = {
          'high': 3,
          'medium': 2,
          'low': 1
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    
    case 'priority-low':
      return tasksCopy.sort((a: Task, b: Task) => {
        const priorityOrder: Record<TaskPriority, number> = {
          'high': 3,
          'medium': 2,
          'low': 1
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    case 'alphabetical':
      return tasksCopy.sort((a: Task, b: Task) => a.title.localeCompare(b.title));
    
    default:
      return tasksCopy;
  }
};
