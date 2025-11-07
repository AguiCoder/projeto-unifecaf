import { FinalReport } from '../types';
import { apiClient } from './api';
import { endpoints } from '../constants/endpoints';

export const reportsService = {
  getFinal: async (): Promise<FinalReport> => {
    return apiClient.get<FinalReport>(endpoints.reports.final);
  },
};
