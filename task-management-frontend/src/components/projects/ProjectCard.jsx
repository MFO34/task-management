import { Link } from 'react-router-dom';
import { FiFolder, FiUsers, FiCalendar, FiMoreVertical } from 'react-icons/fi';

const ProjectCard = ({ project }) => {
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border-2 border-transparent hover:border-blue-500"
    >
      <div className="flex items-start justify-between">
        {/* Project Icon & Info */}
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFolder className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Project Name */}
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>

            {/* Description */}
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {project.description || 'No description'}
            </p>

            {/* Metadata */}
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              {/* Owner */}
              <div className="flex items-center">
                <FiUsers className="mr-1 w-4 h-4" />
                <span>{project.ownerName}</span>
              </div>

              {/* Member Count */}
              <div className="flex items-center">
                <span className="font-medium">{project.memberCount}</span>
                <span className="ml-1">members</span>
              </div>

              {/* Created Date */}
              <div className="flex items-center">
                <FiCalendar className="mr-1 w-4 h-4" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Button (Optional) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            // Handle menu click
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <FiMoreVertical className="w-5 h-5" />
        </button>
      </div>
    </Link>
  );
};

export default ProjectCard;