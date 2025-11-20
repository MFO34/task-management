import api from './api';

const taskService = {
  /**
   * Get all tasks for a project
   * @param {number} projectId 
   * @returns {Promise} Array of tasks
   */
  getProjectTasks: async (projectId) => {
    const response = await api.get(`/api/projects/${projectId}/tasks`);
    return response.data;
  },

  /**
   * Get user's all tasks
   * @returns {Promise} Array of tasks
   */
  getMyTasks: async () => {
    const response = await api.get('/api/tasks/my-tasks');
    return response.data;
  },

  /**
   * Get task by ID
   * @param {number} taskId 
   * @returns {Promise} Task details
   */
  getTaskById: async (taskId) => {
    const response = await api.get(`/api/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Create new task
   * @param {number} projectId 
   * @param {Object} taskData 
   * @returns {Promise} Created task
   */
  createTask: async (projectId, taskData) => {
    const response = await api.post(`/api/projects/${projectId}/tasks`, taskData);
    return response.data;
  },

  /**
   * Update task
   * @param {number} taskId 
   * @param {Object} taskData 
   * @returns {Promise} Updated task
   */
  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/api/tasks/${taskId}`, taskData);
    return response.data;
  },

  /**
   * Delete task
   * @param {number} taskId 
   * @returns {Promise}
   */
  deleteTask: async (taskId) => {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Assign task to user
   * @param {number} taskId 
   * @param {number} assigneeId 
   * @returns {Promise} Updated task
   */
  assignTask: async (taskId, assigneeId) => {
    const response = await api.put(`/api/tasks/${taskId}/assign/${assigneeId}`);
    return response.data;
  },

  /**
   * Search tasks with filters
   * @param {Object} filters 
   * @returns {Promise} Array of tasks
   */
  searchTasks: async (filters) => {
    const params = new URLSearchParams();
    
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.assigneeId) params.append('assigneeId', filters.assigneeId);
    if (filters.projectId) params.append('projectId', filters.projectId);
    if (filters.page !== undefined) params.append('page', filters.page);
    if (filters.size) params.append('size', filters.size);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDir) params.append('sortDir', filters.sortDir);

    const response = await api.get(`/api/tasks/search?${params.toString()}`);
    return response.data;
  },
};

export default taskService;