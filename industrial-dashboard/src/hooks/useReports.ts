import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reportsService';

export const reportKeys = {
  all: ['reports'] as const,
  final: () => [...reportKeys.all, 'final'] as const,
};

export const useFinalReport = () => {
  return useQuery({
    queryKey: reportKeys.final(),
    queryFn: () => reportsService.getFinal(),
  });
};
