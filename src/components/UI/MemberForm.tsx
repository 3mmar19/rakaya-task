import React, { useState } from 'react';
import useMemberStore from '../../store/memberStore';

interface MemberFormProps {
  onClose: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ onClose }) => {
  const { addMember } = useMemberStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    addMember(name, role);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="mb-3">
        <label htmlFor="name" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full px-3 py-1.5 bg-white/90 dark:bg-gray-700/90 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-black-600 dark:text-white transition-all duration-200"
          required
        />
      </div>
            <div className="mb-3">
              <label htmlFor="role" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <input
                type="text"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="block w-full px-3 py-1.5 bg-white/90 dark:bg-gray-700/90 border border-white/20 dark:border-gray-700/20 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-black-600 dark:text-white transition-all duration-200"
                required
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t border-white/20 dark:border-gray-700/20 mt-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-1.5 bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/60 text-xs font-medium text-black-600 dark:text-white transition-all duration-200 border border-white/20 dark:border-gray-700/20"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-blue-600/90 text-white rounded-lg hover:bg-blue-700/90 text-xs font-medium shadow-sm hover:shadow transition-all duration-200 backdrop-blur-sm"
              >
                Add Member
              </button>
            </div>
          </form>
  );
};

export default MemberForm;
