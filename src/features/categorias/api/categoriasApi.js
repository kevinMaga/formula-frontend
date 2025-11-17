import api from '../../../shared/utils/axiosConfig'; // Ajusta esta ruta

export const categoriasApi = {
  getAll: async () => {
    const response = await api.get('/categorias');
    return response.data;
  },
};