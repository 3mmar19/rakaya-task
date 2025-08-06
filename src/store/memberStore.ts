import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Member } from '../types/member';

//---------------------------------------------------------------- Member Store State ------------------------------------------------------//
interface MemberState {
  members: Member[];
  addMember: (name: string, role: string) => void;
  updateMember: (id: string, name: string, role: string) => void;
  deleteMember: (id: string) => void;
}

//---------------------------------------------------------------- Create Member Store ------------------------------------------------------//
const useMemberStore = create<MemberState>()(
  persist(
    (set) => ({
      members: [
        {
          id: 'member-1',
          name: 'Ammar Hussain',
          role: 'Frontend Developer',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ammar Hussain',
        },
        {
          id: 'member-2',
          name: 'Ahmed Ali',
          role: 'UI/UX Designer',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ahmed Ali',
        },
        {
          id: 'member-3',
          name: 'Sami Mohamed',
          role: 'Project Manager',
          avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Sami Mohamed',
        },
      ],
      addMember: (name, role) =>
        set((state) => ({
          members: [
            ...state.members,
            {
              id: `member-${Date.now()}`,
              name,
              role,
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
              },
          ],
        })),
      updateMember: (id, name, role) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.id === id ? { ...member, name, role } : member
          ),
        })),
      deleteMember: (id) =>
        set((state) => ({
          members: state.members.filter((member) => member.id !== id),
        })),
    }),
    {
      name: 'member-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useMemberStore;
