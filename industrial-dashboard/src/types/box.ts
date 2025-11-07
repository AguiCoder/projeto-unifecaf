import { Piece } from './piece';

export enum BoxStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

export interface Box {
  id: number;
  status: BoxStatus;
  opened_at: string;      // ISO 8601 datetime
  closed_at: string | null;
  piece_count: number;    // Quantidade de peças na caixa
}

export interface BoxDetail extends Box {
  pieces: Piece[];        // Lista de peças na caixa
}

export interface BoxListResponse {
  items: Box[];
  total: number;
}
