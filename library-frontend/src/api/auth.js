import apiClient from './client';

export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register/', data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/token/', credentials);
    return response.data;
  },

  refreshToken: async (refresh) => {
    const response = await apiClient.post('/auth/token/refresh/', { refresh });
    return response.data;
  },

  logout: async (refresh) => {
    const response = await apiClient.post('/auth/logout/', { refresh });
    return response.data;
  },
};
