import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiUserPlus, 
  FiPlus,
  FiUsers,
  FiCheckSquare,
  FiClock,
  FiAlertCircle
} from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import MemberList from '../components/projects/MemberList';
import AddMemberModal from '../components/projects/AddMemberModal';
import TaskCard from '../components/tasks/TaskCard';
import { useAuth } from '../context/AuthContext';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import statsService from '../services/statsService';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Load project data
  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, membersData, tasksData, statsData] = await Promise.all([
        projectService.getProjectById(projectId),
        projectService.getProjectMembers(projectId),
        taskService.getProjectTasks(projectId),
        statsService.getProjectStats(projectId),
      ]);

      setProject(projectData);
      setMembers(membersData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await projectService.addMember(projectId, userId);
      await loadProjectData(); // Reload data
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await projectService.removeMember(projectId, userId);
      await loadProjectData(); // Reload data
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await projectService.deleteProject(projectId);
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Project not found'}</p>
            <Link
              to="/projects"
              className="text-blue-600 hover:text-blue-700"
            >
              Back to Projects
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isOwner = project.owner.id === user?.id;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <div className="flex items-center justify-between mb-6">
              {/* Back Button */}
              <Link
                to="/projects"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <FiArrowLeft className="mr-2" />
                Back to Projects
              </Link>

              {/* Action Buttons (Owner only) */}
              {isOwner && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate(`/projects/${projectId}/edit`)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    <FiEdit2 className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50"
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {project.description || 'No description'}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  <span>Owner: {project.owner.fullName}</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  <span>{project.memberCount} members</span>
                </div>
                <div className="flex items-center">
                  <FiCheckSquare className="mr-2" />
                  <span>{stats?.totalTasks || 0} tasks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="px-4 py-6 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Tasks</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
                    </div>
                    <FiCheckSquare className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{stats.completedTasks}</p>
                    </div>
                    <FiCheckSquare className="h-8 w-8 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</p>
                    </div>
                    <FiClock className="h-8 w-8 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
                    </div>
                    <FiAlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Tasks */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Tasks ({tasks.length})
                    </h2>
                    <Link
                      to={`/projects/${projectId}/tasks/new`}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <FiPlus className="mr-2" />
                      New Task
                    </Link>
                  </div>

                  {tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <FiCheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">No tasks yet</p>
                      <Link
                        to={`/projects/${projectId}/tasks/new`}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <FiPlus className="mr-2" />
                        Create First Task
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map((task) => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      
                      {tasks.length > 5 && (
                        <Link
                          to={`/projects/${projectId}/tasks`}
                          className="block text-center py-3 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all {tasks.length} tasks →
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Members */}
              <div>
                <div className="space-y-6">
                  {/* Members List */}
                  <MemberList
                    members={members}
                    projectOwner={project.owner}
                    onRemoveMember={handleRemoveMember}
                    currentUserId={user?.id}
                  />

                  {/* Add Member Button (Owner only) */}
                  {isOwner && (
                    <button
                      onClick={() => setIsAddMemberModalOpen(true)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiUserPlus className="mr-2" />
                      Add Member
                    </button>
                  )}

                  {/* Project Status */}
                  {stats && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Project Status
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Completion Rate</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {stats.completionRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${stats.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span
                            className={`text-sm font-semibold ${
                              stats.status === 'ON_TRACK'
                                ? 'text-green-600'
                                : stats.status === 'AT_RISK'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {stats.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSubmit={handleAddMember}
        existingMemberIds={members.map((m) => m.userId)}
      />
    </>
  );
};

export default ProjectDetail;