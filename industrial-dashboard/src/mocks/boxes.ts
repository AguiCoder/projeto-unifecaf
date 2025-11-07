import { Box, BoxDetail, BoxListResponse, BoxStatus } from '../types';

export const mockBoxes: Box[] = [
  {
    id: 1,
    status: BoxStatus.CLOSED,
    opened_at: '2024-01-15T10:00:00Z',
    closed_at: '2024-01-15T10:50:00Z',
    piece_count: 10,
  },
  {
    id: 2,
    status: BoxStatus.OPEN,
    opened_at: '2024-01-15T10:50:00Z',
    closed_at: null,
    piece_count: 1,
  },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const listBoxes = async (status?: BoxStatus): Promise<BoxListResponse> => {
  await delay(400);
  let filtered = [...mockBoxes];
  
  if (status) {
    filtered = filtered.filter(b => b.status === status);
  }
  
  return {
    items: filtered,
    total: filtered.length,
  };
};

export const getBoxById = async (id: number): Promise<BoxDetail> => {
  await delay(300);
  const box = mockBoxes.find(b => b.id === id);
  if (!box) {
    throw new Error(`Caixa com ID '${id}' não encontrada`);
  }
  
  // Import mockPieces dynamically to avoid circular dependency
  const { mockPieces } = await import('./pieces');
  const pieces = mockPieces.filter(p => p.box_id === id && p.status === 'approved');
  
  return {
    ...box,
    pieces,
  };
};
