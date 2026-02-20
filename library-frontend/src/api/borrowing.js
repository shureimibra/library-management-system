import apiClient from './client';

export const borrowingAPI = {
  getAll: async (params = {}) => {
    const response = await apiClient.get('/borrowing/', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/borrowing/${id}/`);
    return response.data;
  },

  borrow: async (data) => {
    const response = await apiClient.post('/borrowing/borrow/', data);
    return response.data;
  },

  returnBook: async (id) => {
    const response = await apiClient.post(`/borrowing/${id}/return/`);
    return response.data;
  },

  getMyBooks: async () => {
    const response = await apiClient.get('/borrowing/my-books/');
    return response.data;
  },

  getMyActive: async () => {
    const response = await apiClient.get('/borrowing/my-active/');
    return response.data;
  },
};
