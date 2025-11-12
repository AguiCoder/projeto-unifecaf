import { Piece, PieceCreate, PieceListResponse, PieceDeleteResponse, PieceStatus } from '../types';
import { apiClient } from './api';
import { endpoints } from '../constants/endpoints';

export const piecesService = {
  list: async (
    status?: PieceStatus,
    limit = 100,
    offset = 0
  ): Promise<PieceListResponse> => {
    // Constrói query string com parâmetros opcionais
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    
    const queryString = params.toString();
    const endpoint = queryString 
      ? `${endpoints.pieces.list}?${queryString}`
      : endpoints.pieces.list;
    
    return apiClient.get<PieceListResponse>(endpoint);
  },

  getById: async (id: string): Promise<Piece> => {
    return apiClient.get<Piece>(endpoints.pieces.detail(id));
  },

  create: async (data: PieceCreate): Promise<Piece> => {
    return apiClient.post<Piece>(endpoints.pieces.create, data);
  },

  delete: async (id: string): Promise<PieceDeleteResponse> => {
    return apiClient.delete<PieceDeleteResponse>(endpoints.pieces.delete(id));
  },
};
