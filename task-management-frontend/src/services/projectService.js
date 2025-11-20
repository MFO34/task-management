import api from './api';

const projectService = {
  /**
   * Get all user's projects
   * @returns {Promise} Array of projects
   */
  getAllProjects: async () => {
    const response = await api.get('/api/projects');
    return response.data;
  },

  /**
   * Get project by ID
   * @param {number} projectId 
   * @returns {Promise} Project details
   */
  getProjectById: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}`);
    return response.data;
  },

  /**
   * Create new project
   * @param {Object} projectData - { name, description }
   * @returns {Promise} Created project
   */
  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },

  /**
   * Update project
   * @param {number} projectId 
   * @param {Object} projectData - { name, description }
   * @returns {Promise} Updated project
   */
  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/api/projects/${projectId}`, projectData);
    return response.data;
  },

  /**
   * Delete project
   * @param {number} projectId 
   * @returns {Promise}
   */
  deleteProject: async (projectId) => {
    const response = await api.delete(`/api/projects/${projectId}`);
    return response.data;
  },

  /**
   * Get project members
   * @param {number} projectId 
   * @returns {Promise} Array of members
   */
  getProjectMembers: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/members`);
    return response.data;
  },

  /**
   * Add member to project
   * @param {number} projectId 
   * @param {number} userId 
   * @returns {Promise} Updated project
   */
  addMember: async (projectId, userId) => {
    const response = await api.post(`/api/projects/${projectId}/members`, { userId });
    return response.data;
  },

  /**
   * Remove member from project
   * @param {number} projectId 
   * @param {number} userId 
   * @returns {Promise}
   */
  removeMember: async (projectId, userId) => {
    const response = await api.delete(`/api/projects/${projectId}/members/${userId}`);
    return response.data;
  },
};

export default projectService;