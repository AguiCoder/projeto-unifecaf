import { useState } from 'react';
import { usePieces } from '../../hooks/usePieces';
import { PieceStatus } from '../../types';
import { PieceCard } from './PieceCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { Button } from '../ui/button';
import { Filter } from 'lucide-react';

export const PieceList = () => {
  const [statusFilter, setStatusFilter] = useState<PieceStatus | undefined>(undefined);
  const { data, isLoading, error } = usePieces(statusFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger font-medium">Erro ao carregar peças</p>
        <p className="text-muted-foreground text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  const pieces = data?.items || [];

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Filtrar por status:</span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === undefined ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(undefined)}
            >
              Todas ({data?.total || 0})
            </Button>
            <Button
              variant={statusFilter === PieceStatus.APPROVED ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(PieceStatus.APPROVED)}
              className={statusFilter === PieceStatus.APPROVED ? 'bg-success hover:bg-success/90' : ''}
            >
              ✅ Aprovadas
            </Button>
            <Button
              variant={statusFilter === PieceStatus.REJECTED ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(PieceStatus.REJECTED)}
              className={statusFilter === PieceStatus.REJECTED ? 'bg-danger hover:bg-danger/90' : ''}
            >
              ❌ Reprovadas
            </Button>
          </div>
        </div>
      </div>

      {/* Pieces Grid */}
      {pieces.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Nenhuma peça encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pieces.map((piece) => (
            <PieceCard key={piece.id} piece={piece} />
          ))}
        </div>
      )}
    </div>
  );
};
