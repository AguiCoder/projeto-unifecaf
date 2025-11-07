import { Box } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Package2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { QUALITY_CRITERIA } from '../../constants/qualityCriteria';

interface BoxCardProps {
  box: Box;
  onClick?: () => void;
}

export const BoxCard = ({ box, onClick }: BoxCardProps) => {
  const isOpen = box.status === 'open';

  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-lg border-2 bg-card transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg hover:border-primary/50' : ''
      } ${isOpen ? 'border-secondary' : 'border-border'}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package2 className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl text-foreground">Box #{box.id}</span>
        </div>
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${
            isOpen
              ? 'bg-secondary/10 text-secondary border border-secondary/20'
              : 'bg-muted text-muted-foreground border border-border'
          }`}
        >
          {isOpen ? '🔓 Aberta' : '🔒 Fechada'}
        </span>
      </div>

      <div className="space-y-4">
        <ProgressBar
          current={box.piece_count}
          max={QUALITY_CRITERIA.BOX_CAPACITY}
          label="Capacidade"
        />

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Aberta em:</span>
            <span className="text-foreground font-medium">
              {format(new Date(box.opened_at), 'dd/MM HH:mm')}
            </span>
          </div>

          {box.closed_at && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Fechada em:</span>
              <span className="text-foreground font-medium">
                {format(new Date(box.closed_at), 'dd/MM HH:mm')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
