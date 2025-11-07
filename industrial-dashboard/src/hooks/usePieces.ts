import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PieceCreate, PieceStatus } from '../types';
import { piecesService } from '../services/piecesService';

// Query keys
export const pieceKeys = {
  all: ['pieces'] as const,
  lists: () => [...pieceKeys.all, 'list'] as const,
  list: (status?: PieceStatus, limit?: number, offset?: number) =>
    [...pieceKeys.lists(), status, limit, offset] as const,
  details: () => [...pieceKeys.all, 'detail'] as const,
  detail: (id: string) => [...pieceKeys.details(), id] as const,
};

// Hook para listar peças
export const usePieces = (
  status?: PieceStatus,
  limit = 100,
  offset = 0
) => {
  return useQuery({
    queryKey: pieceKeys.list(status, limit, offset),
    queryFn: () => piecesService.list(status, limit, offset),
  });
};

// Hook para buscar peça por ID
export const usePiece = (id: string) => {
  return useQuery({
    queryKey: pieceKeys.detail(id),
    queryFn: () => piecesService.getById(id),
    enabled: !!id,
  });
};

// Hook para criar peça
export const useCreatePiece = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PieceCreate) => piecesService.create(data),
    onSuccess: () => {
      // Invalida queries de lista para atualizar
      queryClient.invalidateQueries({ queryKey: pieceKeys.lists() });
    },
  });
};

// Hook para deletar peça
export const useDeletePiece = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => piecesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pieceKeys.lists() });
    },
  });
};
