export interface RejectionReasonCount {
  motivo: string;
  quantidade: number;
}

export interface FinalReport {
  total_aprovadas: number;
  total_reprovadas: number;
  motivo_contagem: RejectionReasonCount[];
  total_caixas: number;
}
