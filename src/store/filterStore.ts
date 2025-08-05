import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TaskPriority, TaskStatus } from '../types/task';

//---------------------------------------------------------------- Sort Options ------------------------------------------------------//
export type SortOption = 'newest' | 'oldest' | 'priority-high' | 'priority-low' | 'alphabetical';

//---------------------------------------------------------------- Filter Store State Interface ------------------------------------------------------//
interface FilterState {
  // Search and Filter
  searchText: string;
  priorityFilter: TaskPriority | null;
  statusFilter: TaskStatus | null;
  sortOption: SortOption;
  assigneeFilter: string | null; // Member ID for filtering by assignee
  tagFilter: string | null; // Tag name for filtering by tag
  
  // Actions
  setSearchText: (text: string) => void;
  setPriorityFilter: (priority: TaskPriority | null) => void;
  setStatusFilter: (status: TaskStatus | null) => void;
  setAssigneeFilter: (memberId: string | null) => void;
  setTagFilter: (tag: string | null) => void;
  setSortOption: (option: SortOption) => void;
  resetFilters: () => void;
}

//---------------------------------------------------------------- Create Filter Store ------------------------------------------------------//
const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      searchText: '',
      priorityFilter: null,
      statusFilter: null,
      sortOption: 'newest',
      assigneeFilter: null,
      tagFilter: null,
      
      setSearchText: (text) => set({ searchText: text }),
      
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      
      setStatusFilter: (status) => set({ statusFilter: status }),
      
      setAssigneeFilter: (memberId) => set({ assigneeFilter: memberId }),
      
      setTagFilter: (tag) => set({ tagFilter: tag }),
      
      setSortOption: (option) => set({ sortOption: option }),
      
      resetFilters: () => set({
        searchText: '',
        priorityFilter: null,
        statusFilter: null,
        sortOption: 'newest',
        assigneeFilter: null,
        tagFilter: null,
      }),
    }),
    {
      name: 'filter-storage', // name of the localStorage item
      version: 1, // version number for migrations
    }
  )
);

export default useFilterStore;
