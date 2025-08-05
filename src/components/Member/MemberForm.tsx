import React, { useState } from 'react';
import Modal from '../UI/Modal';
import useMemberStore from '../../store/memberStore';
import { Member } from '../../types/member';

interface MemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member;
}

const MemberForm: React.FC<MemberFormProps> = ({ isOpen, onClose, member }) => {
  const { addMember, updateMember } = useMemberStore();
  const [name, setName] = useState(member?.name || '');
  const [role, setRole] = useState(member?.role || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (member) {
      updateMember(member.id, name, role);
    } else {
      addMember(name, role);
    }
    
    onClose();
    setName('');
    setRole('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Member' : 'Add Member'}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-3 py-1.5 bg-white/90 dark:bg-gray-700/90 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white text-sm transition-all duration-200"
            placeholder="Enter member name"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-xs font-medium text-gray-700 dark:text-white mb-1">
            Role
          </label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full px-3 py-1.5 bg-white/90 dark:bg-gray-700/90 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-white text-sm transition-all duration-200"
            placeholder="Enter member role"
          />
        </div>
        <div className="flex justify-end space-x-2 pt-4 border-t border-white/20 dark:border-gray-700/20">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-1.5 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/60 text-xs font-medium transition-all duration-200 border border-white/20 dark:border-gray-700/20"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-1.5 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 text-xs font-medium shadow-sm hover:shadow transition-all duration-200 backdrop-blur-sm"
          >
            {member ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberForm;
