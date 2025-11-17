import api from '../../../shared/utils/axiosConfig';

export const formulacionesApi = {
  getAll: async () => {
    const response = await api.get('/formulaciones');
    return response.data;
  },

  getOne: async (id) => {
    const response = await api.get(`/formulaciones/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/formulaciones', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/formulaciones/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/formulaciones/${id}`);
    return response.data;
  },
};