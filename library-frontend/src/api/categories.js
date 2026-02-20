import apiClient from './client';

export const categoriesAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/catalog/categories/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/catalog/categories/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/catalog/categories/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/catalog/categories/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/catalog/categories/${id}/`);
    return response.data;
  },
};
