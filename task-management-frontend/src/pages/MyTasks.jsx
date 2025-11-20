import { useState, useEffect } from 'react';
import { FiCheckSquare, FiFilter } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import TaskCard from '../components/tasks/TaskCard';
import EditTaskModal from '../components/tasks/EditTaskModal';
import taskService from '../services/taskService';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getMyTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await taskService.updateTask(selectedTask.id, taskData);
      await loadTasks();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDeleteTask = async () => {
    try {
      await taskService.deleteTask(selectedTask.id);
      await loadTasks();
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to delete task');
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="mt-2 text-sm text-gray-600">
              All tasks assigned to you across all projects
            </p>
          </div>

          {/* Filters */}
          <div className="px-4 py-4 sm:px-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-4">
                <FiFilter className="text-gray-500" />
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">In Review</option>
                  <option value="DONE">Done</option>
                </select>

                {/* Priority Filter */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Priority</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>

                <div className="flex-1 text-right text-sm text-gray-600">
                  Showing {filteredTasks.length} of {tasks.length} tasks
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-4 sm:px-0">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="px-4 py-6 sm:px-0">
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiCheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {tasks.length === 0
                    ? "You don't have any assigned tasks yet."
                    : 'No tasks match the selected filters.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
              </div>
            )}
          </div>

          {/* Stats Summary */}
          {tasks.length > 0 && (
            <div className="px-4 py-6 sm:px-0">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To Do</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {tasks.filter((t) => t.status === 'TODO').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Done</p>
                    <p className="text-2xl font-bold text-green-600">
                      {tasks.filter((t) => t.status === 'DONE').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateTask}
        onDelete={handleDeleteTask}
        task={selectedTask}
        projectMembers={[]}
      />
    </>
  );
};

export default MyTasks;