import { FiUser, FiUserX, FiCrown } from 'react-icons/fi';

const MemberList = ({ members, projectOwner, onRemoveMember, currentUserId }) => {
  const isOwner = projectOwner?.id === currentUserId;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Team Members ({members.length})
      </h3>

      <div className="space-y-3">
        {members.map((member) => {
          const isMemberOwner = member.role === 'OWNER';
          const isCurrentUser = member.userId === currentUserId;

          return (
            <div
              key={member.userId}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* User Info */}
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {member.fullName}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-gray-500">(You)</span>
                      )}
                    </p>
                    {isMemberOwner && (
                      <FiCrown className="w-4 h-4 text-yellow-500" title="Project Owner" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Role Badge */}
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    isMemberOwner
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {member.role}
                </span>

                {/* Remove Button (Only owner can remove, can't remove self) */}
                {isOwner && !isMemberOwner && !isCurrentUser && (
                  <button
                    onClick={() => onRemoveMember(member.userId)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove member"
                  >
                    <FiUserX className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberList;