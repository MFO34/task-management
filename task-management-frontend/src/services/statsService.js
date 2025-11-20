import api from './api';

const statsService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard stats
   */
  getDashboardStats: async () => {
    const response = await api.get('/api/stats/dashboard');
    return response.data;
  },

  /**
   * Get all projects statistics
   * @returns {Promise} Array of project stats
   */
  getAllProjectsStats: async () => {
    const response = await api.get('/api/stats/projects');
    return response.data;
  },

  /**
   * Get specific project statistics
   * @param {number} projectId 
   * @returns {Promise} Project stats
   */
  getProjectStats: async (projectId) => {
    const response = await api.get(`/api/stats/projects/${projectId}`);
    return response.data;
  },

  /**
   * Get user statistics
   * @param {number} userId 
   * @returns {Promise} User stats
   */
  getUserStats: async (userId) => {
    const response = await api.get(`/api/stats/users/${userId}`);
    return response.data;
  },
};

export default statsService;