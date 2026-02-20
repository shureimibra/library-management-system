import apiClient from './client';

export const booksAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/catalog/books/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/catalog/books/${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/catalog/books/', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/catalog/books/${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/catalog/books/${id}/`);
    return response.data;
  },

  getAvailable: async () => {
    const response = await apiClient.get('/catalog/books/available/');
    return response.data;
  },
};
