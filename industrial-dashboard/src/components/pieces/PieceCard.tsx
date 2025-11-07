import { Piece } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Package, Scale, Ruler } from 'lucide-react';
import { format } from 'date-fns';

interface PieceCardProps {
  piece: Piece;
  onClick?: () => void;
}

export const PieceCard = ({ piece, onClick }: PieceCardProps) => {
  const colorMap: Record<string, string> = {
    azul: 'Azul',
    verde: 'Verde',
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 border-border bg-card hover:shadow-lg transition-all cursor-pointer ${
        onClick ? 'hover:border-primary/50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg text-foreground">{piece.id}</span>
        </div>
        <StatusBadge status={piece.status} size="sm" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Scale className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Peso:</span>
          <span className="font-medium text-foreground">{piece.peso}g</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Ruler className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Comprimento:</span>
          <span className="font-medium text-foreground">{piece.comprimento}cm</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <div className={`w-4 h-4 rounded-full ${piece.cor === 'azul' ? 'bg-blue-500' : 'bg-green-500'}`} />
          <span className="text-muted-foreground">Cor:</span>
          <span className="font-medium text-foreground">{colorMap[piece.cor] || piece.cor}</span>
        </div>

        {piece.rejection_reasons.length > 0 && (
          <div className="mt-3 p-2 bg-danger/10 rounded border border-danger/20">
            <p className="text-xs font-medium text-danger mb-1">Motivos de Rejeição:</p>
            <ul className="text-xs text-danger space-y-0.5">
              {piece.rejection_reasons.map((reason, idx) => (
                <li key={idx}>• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          {format(new Date(piece.created_at), 'MMM dd, yyyy HH:mm')}
        </div>
      </div>
    </div>
  );
};
