import { Piece, PieceListResponse, PieceStatus, Color } from '../types';
import { mockBoxes } from './boxes';

// Peças mockadas
export const mockPieces: Piece[] = [
  {
    id: 'P001',
    peso: 100.0,
    cor: Color.AZUL,
    comprimento: 15.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'P002',
    peso: 98.5,
    cor: Color.VERDE,
    comprimento: 12.5,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:05:00Z',
  },
  {
    id: 'P003',
    peso: 90.0,
    cor: Color.AZUL,
    comprimento: 15.0,
    status: PieceStatus.REJECTED,
    rejection_reasons: ['peso fora da faixa'],
    box_id: null,
    created_at: '2024-01-15T10:10:00Z',
  },
  {
    id: 'P004',
    peso: 100.0,
    cor: Color.AZUL,
    comprimento: 25.0,
    status: PieceStatus.REJECTED,
    rejection_reasons: ['comprimento fora da faixa'],
    box_id: null,
    created_at: '2024-01-15T10:15:00Z',
  },
  {
    id: 'P005',
    peso: 102.0,
    cor: Color.VERDE,
    comprimento: 18.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:20:00Z',
  },
  {
    id: 'P006',
    peso: 100.0,
    cor: 'vermelho' as Color,
    comprimento: 15.0,
    status: PieceStatus.REJECTED,
    rejection_reasons: ['cor inválida'],
    box_id: null,
    created_at: '2024-01-15T10:25:00Z',
  },
  {
    id: 'P007',
    peso: 97.0,
    cor: Color.AZUL,
    comprimento: 11.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'P008',
    peso: 103.0,
    cor: Color.VERDE,
    comprimento: 16.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:35:00Z',
  },
  {
    id: 'P009',
    peso: 99.0,
    cor: Color.AZUL,
    comprimento: 14.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:40:00Z',
  },
  {
    id: 'P010',
    peso: 101.0,
    cor: Color.VERDE,
    comprimento: 13.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 1,
    created_at: '2024-01-15T10:45:00Z',
  },
  {
    id: 'P011',
    peso: 96.0,
    cor: Color.AZUL,
    comprimento: 17.0,
    status: PieceStatus.APPROVED,
    rejection_reasons: [],
    box_id: 2,
    created_at: '2024-01-15T10:50:00Z',
  },
  {
    id: 'P012',
    peso: 88.0,
    cor: Color.AZUL,
    comprimento: 19.0,
    status: PieceStatus.REJECTED,
    rejection_reasons: ['peso fora da faixa'],
    box_id: null,
    created_at: '2024-01-15T10:55:00Z',
  },
];

// Função para simular delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para filtrar peças
export const filterPieces = (
  pieces: Piece[],
  status?: PieceStatus,
  limit = 100,
  offset = 0
): PieceListResponse => {
  let filtered = [...pieces];
  
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }
  
  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  
  return {
    items: paginated,
    total,
    limit,
    offset,
  };
};

// Função mock para buscar peça por ID
export const getPieceById = async (id: string): Promise<Piece> => {
  await delay(300);
  const piece = mockPieces.find(p => p.id === id);
  if (!piece) {
    throw new Error(`Peça com ID '${id}' não encontrada`);
  }
  return piece;
};

// Função mock para listar peças
export const listPieces = async (
  status?: PieceStatus,
  limit = 100,
  offset = 0
): Promise<PieceListResponse> => {
  await delay(500);
  return filterPieces(mockPieces, status, limit, offset);
};

// Função mock para criar peça
export const createPiece = async (data: {
  id: string;
  peso: number;
  cor: Color;
  comprimento: number;
}): Promise<Piece> => {
  await delay(400);
  
  // Verifica se já existe
  if (mockPieces.find(p => p.id === data.id)) {
    throw new Error(`Peça com ID '${data.id}' já existe`);
  }
  
  // Avalia qualidade (lógica simplificada)
  const rejection_reasons: string[] = [];
  if (data.peso < 95 || data.peso > 105) {
    rejection_reasons.push('peso fora da faixa');
  }
  if (data.cor !== Color.AZUL && data.cor !== Color.VERDE) {
    rejection_reasons.push('cor inválida');
  }
  if (data.comprimento < 10 || data.comprimento > 20) {
    rejection_reasons.push('comprimento fora da faixa');
  }
  
  const status = rejection_reasons.length === 0 ? PieceStatus.APPROVED : PieceStatus.REJECTED;
  
  // Se aprovada, aloca em caixa (lógica simplificada)
  let box_id: number | null = null;
  if (status === PieceStatus.APPROVED) {
    // Busca caixa aberta ou cria nova (mock)
    const openBoxes = mockBoxes.filter(b => b.status === 'open');
    if (openBoxes.length > 0) {
      box_id = openBoxes[0].id;
    } else {
      box_id = mockBoxes.length + 1;
    }
  }
  
  const newPiece: Piece = {
    ...data,
    status,
    rejection_reasons,
    box_id,
    created_at: new Date().toISOString(),
  };
  
  mockPieces.unshift(newPiece); // Adiciona no início
  return newPiece;
};

// Função mock para deletar peça
export const deletePiece = async (id: string): Promise<void> => {
  await delay(300);
  const index = mockPieces.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Peça com ID '${id}' não encontrada`);
  }
  mockPieces.splice(index, 1);
};
