import { useQuery } from '@tanstack/react-query';
import { BoxStatus } from '../types';
import { boxesService } from '../services/boxesService';

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
