import { RejectionReasonCount } from '../../types';
import { AlertCircle } from 'lucide-react';

interface RejectionChartProps {
  data: RejectionReasonCount[];
}

export const RejectionChart = ({ data }: RejectionChartProps) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">Nenhum dado de rejeição disponível</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((item) => item.quantidade));

  return (
    <div className="bg-card p-6 rounded-lg border-2 border-border space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-danger" />
        <h3 className="text-lg font-bold text-foreground">Motivos de Rejeição</h3>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.quantidade / maxCount) * 100;
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground capitalize">
                  {item.motivo}
                </span>
                <span className="text-sm font-bold text-danger">{item.quantidade}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-danger rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
