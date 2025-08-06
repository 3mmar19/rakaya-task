import React from 'react';
import useMemberStore from '../../store/memberStore';

//---------------------------------------------------------------- Props Interface ------------------------------------------------------//
interface TaskAssignmentsProps {
  taskId: string;
  assignedMemberIds: string[];
}

//---------------------------------------------------------------- TaskAssignments Component ------------------------------------------------------//
const TaskAssignments: React.FC<TaskAssignmentsProps> = ({ taskId, assignedMemberIds }) => {
  const allMembers = useMemberStore((state) => state.members);
  const assignedMembers = allMembers.filter(member => assignedMemberIds?.includes(member.id));

  // Only render if there are assigned members
  if (assignedMembers.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {assignedMembers.map(member => (
            <img
              key={member.id}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
              src={member.avatar}
              alt={member.name}
              title={`${member.name} (${member.role})`}
            />
          ))}
        </div>
        {assignedMembers.length > 0 && (
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            {assignedMembers.length} {assignedMembers.length === 1 ? 'member' : 'members'}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskAssignments;
