import { Box, BoxDetail, BoxListResponse, BoxStatus } from '../types';
import { apiClient } from './api';
import { endpoints } from '../constants/endpoints';

export const boxesService = {
  list: async (status?: BoxStatus): Promise<BoxListResponse> => {
    // Constrói query string com parâmetro opcional
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${endpoints.boxes.list}?${queryString}`
      : endpoints.boxes.list;
    
    return apiClient.get<BoxListResponse>(endpoint);
  },

  getById: async (id: number): Promise<BoxDetail> => {
    return apiClient.get<BoxDetail>(endpoints.boxes.detail(id));
  },
};
