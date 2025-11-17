import api from '../../../shared/utils/axiosConfig';

export const ingredientesApi = {
  getAll: async () => {
    const response = await api.get('/ingredientes');
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/ingredientes/search?q=${query}`);
    return response.data;
  },

  seedIngredientes: async () => {
    const response = await api.post('/ingredientes/seed');
    return response.data;
  },
};