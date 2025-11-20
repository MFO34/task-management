import { FiClock, FiAlertCircle, FiUser } from 'react-icons/fi';

const TaskCard = ({ task, onClick }) => {
  // Status color mapping
  const statusColors = {
    TODO: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    REVIEW: 'bg-purple-100 text-purple-800',
    DONE: 'bg-green-100 text-green-800',
  };

  // Priority color mapping
  const priorityColors = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    CRITICAL: 'bg-red-100 text-red-800',
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onClick && onClick(task)}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-900 flex-1">
          {task.title}
        </h3>
        
        {/* Overdue Badge */}
        {task.isOverdue && (
          <span className="flex-shrink-0 ml-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            <FiAlertCircle className="w-3 h-3 mr-1" />
            Overdue
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex items-center space-x-2 mb-3">
        {/* Status */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>

        {/* Priority */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        {/* Assignee */}
        <div className="flex items-center">
          <FiUser className="w-4 h-4 mr-1" />
          <span>{task.assigneeName || 'Unassigned'}</span>
        </div>

        {/* Deadline */}
        {task.deadline && (
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-1" />
            <span>{formatDate(task.deadline)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;