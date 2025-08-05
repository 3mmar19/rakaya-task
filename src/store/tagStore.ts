import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//---------------------------------------------------------------- Tag Store State ------------------------------------------------------//
interface TagState {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
}

//---------------------------------------------------------------- Create Tag Store ------------------------------------------------------//
const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: ['Mobile App Design', 'Redesign', 'To do app'],
      
      addTag: (tag) =>
        set((state) => {
          // Check if tag already exists
          if (state.tags.includes(tag)) {
            return state;
          }
          return { tags: [...state.tags, tag] };
        }),
      
      removeTag: (tagToRemove) =>
        set((state) => ({
          tags: state.tags.filter(tag => tag !== tagToRemove)
        })),
      
      setTags: (tags) => set({ tags }),
    }),
    {
      name: 'rakaya-tags-storage',
    }
  )
);

export default useTagStore;
