import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import statsService from '../services/statsService';
import Navbar from '../components/common/Navbar';
import StatsCard from '../components/dashboard/StatsCard';
import { 
  FiFolder, 
  FiCheckSquare, 
  FiClock, 
  FiAlertCircle, 
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiActivity
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await statsService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.fullName}! 👋
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Here's what's happening with your tasks today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Projects */}
              <StatsCard
                title="Total Projects"
                value={stats.totalProjects}
                icon={FiFolder}
                color="blue"
                subtitle={`${stats.projectsIOwn} owned, ${stats.projectsAsMember} member`}
              />

              {/* Total Tasks */}
              <StatsCard
                title="Total Tasks"
                value={stats.totalTasks}
                icon={FiCheckSquare}
                color="green"
                subtitle={`${stats.tasksAssignedToMe} assigned to you`}
              />

              {/* Overdue Tasks */}
              <StatsCard
                title="Overdue"
                value={stats.overdueTasks}
                icon={FiAlertCircle}
                color="red"
                subtitle="Need immediate attention"
              />

              {/* Completion Rate */}
              <StatsCard
                title="Completion Rate"
                value={`${stats.completionRate}%`}
                icon={FiTrendingUp}
                color="purple"
                subtitle={`${stats.doneTasks} completed`}
              />
            </div>
          </div>

          {/* Task Status Breakdown */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Task Status Breakdown
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="To Do"
                value={stats.todoTasks}
                icon={FiTarget}
                color="yellow"
              />

              <StatsCard
                title="In Progress"
                value={stats.inProgressTasks}
                icon={FiActivity}
                color="blue"
              />

              <StatsCard
                title="In Review"
                value={stats.reviewTasks}
                icon={FiUsers}
                color="indigo"
              />

              <StatsCard
                title="Completed"
                value={stats.doneTasks}
                icon={FiCheckSquare}
                color="green"
              />
            </div>
          </div>

          {/* Deadline Overview */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Deadline Overview
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Today</p>
                    <p className="mt-2 text-2xl font-bold text-yellow-600">
                      {stats.dueTodayTasks}
                    </p>
                  </div>
                  <FiClock className="h-10 w-10 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due This Week</p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">
                      {stats.dueThisWeekTasks}
                    </p>
                  </div>
                  <FiClock className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {stats.overdueTasks}
                    </p>
                  </div>
                  <FiAlertCircle className="h-10 w-10 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Priority Distribution
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Critical</p>
                    <p className="mt-2 text-2xl font-bold text-red-600">
                      {stats.criticalTasks}
                    </p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">High</p>
                    <p className="mt-2 text-2xl font-bold text-orange-600">
                      {stats.highPriorityTasks}
                    </p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Medium</p>
                    <p className="mt-2 text-2xl font-bold text-yellow-600">
                      {stats.mediumPriorityTasks}
                    </p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low</p>
                    <p className="mt-2 text-2xl font-bold text-green-600">
                      {stats.lowPriorityTasks}
                    </p>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-6 sm:px-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/projects"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
              >
                <FiFolder className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">View Projects</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your projects and teams
                </p>
              </Link>

              <Link
                to="/tasks"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-green-500"
              >
                <FiCheckSquare className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage your assigned tasks
                </p>
              </Link>

              <Link
                to="/projects/new"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-500"
              >
                <FiFolder className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900">New Project</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Create a new project
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;