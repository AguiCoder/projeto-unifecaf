// Base URL (será usado quando conectar com API real)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Endpoints
export const endpoints = {
  // Peças
  pieces: {
    list: '/api/v1/pieces',
    detail: (id: string) => `/api/v1/pieces/${id}`,
    create: '/api/v1/pieces',
    delete: (id: string) => `/api/v1/pieces/${id}`,
  },
  
  // Caixas
  boxes: {
    list: '/api/v1/boxes',
    detail: (id: number) => `/api/v1/boxes/${id}`,
    delete: (id: number) => `/api/v1/boxes/${id}`,
  },
  
  // Relatórios
  reports: {
    final: '/api/v1/reports/final',
  },
  
  // Geral
  health: '/health',
  root: '/',
};
