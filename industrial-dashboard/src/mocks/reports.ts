import { FinalReport, RejectionReasonCount } from '../types';
import { mockPieces } from './pieces';
import { mockBoxes } from './boxes';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getFinalReport = async (): Promise<FinalReport> => {
  await delay(500);
  
  const total_aprovadas = mockPieces.filter(p => p.status === 'approved').length;
  const total_reprovadas = mockPieces.filter(p => p.status === 'rejected').length;
  
  // Conta motivos de reprovação
  const motivoMap = new Map<string, number>();
  mockPieces
    .filter(p => p.status === 'rejected')
    .forEach(p => {
      p.rejection_reasons.forEach(reason => {
        motivoMap.set(reason, (motivoMap.get(reason) || 0) + 1);
      });
    });
  
  const motivo_contagem: RejectionReasonCount[] = Array.from(motivoMap.entries()).map(
    ([motivo, quantidade]) => ({ motivo, quantidade })
  );
  
  const total_caixas = mockBoxes.filter(b => b.status === 'closed').length;
  
  return {
    total_aprovadas,
    total_reprovadas,
    motivo_contagem,
    total_caixas,
  };
};
