import apiClient from './client';

export const authorsAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/catalog/authors/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/catalog/authors/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/catalog/authors/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/catalog/authors/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/catalog/authors/${id}/`);
    return response.data;
  },
};
