import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BoxStatus } from '../types';
import { boxesService } from '../services/boxesService';
import { pieceKeys } from './usePieces';

export const boxKeys = {
  all: ['boxes'] as const,
  lists: () => [...boxKeys.all, 'list'] as const,
  list: (status?: BoxStatus) => [...boxKeys.lists(), status] as const,
  details: () => [...boxKeys.all, 'detail'] as const,
  detail: (id: number) => [...boxKeys.details(), id] as const,
};

export const useBoxes = (status?: BoxStatus) => {
  return useQuery({
    queryKey: boxKeys.list(status),
    queryFn: () => boxesService.list(status),
  });
};

export const useBox = (id: number) => {
  return useQuery({
    queryKey: boxKeys.detail(id),
    queryFn: () => boxesService.getById(id),
    enabled: !!id,
  });
};

// Hook para deletar caixa
export const useDeleteBox = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => boxesService.delete(id),
    onSuccess: () => {
      // Invalida queries de caixas
      queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
      // Invalida queries de peças (pois peças podem ter sido realocadas)
      queryClient.invalidateQueries({ queryKey: pieceKeys.lists() });
    },
  });
};
