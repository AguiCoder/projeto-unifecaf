// Enums
export enum Color {
  AZUL = 'azul',
  VERDE = 'verde',
}

export enum PieceStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Tipos de entrada (POST)
export interface PieceCreate {
  id: string;
  peso: number;        // > 0, em gramas
  cor: Color;          // 'azul' | 'verde'
  comprimento: number; // > 0, em centímetros
}

// Tipos de resposta (GET)
export interface Piece {
  id: string;
  peso: number;
  cor: Color;
  comprimento: number;
  status: PieceStatus;
  rejection_reasons: string[];  // Lista de motivos se reprovada
  box_id: number | null;        // ID da caixa se aprovada
  created_at: string;           // ISO 8601 datetime
}

export interface PieceListResponse {
  items: Piece[];
  total: number;
  limit: number;
  offset: number;
}
