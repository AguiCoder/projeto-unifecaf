import { useBoxes } from '../../hooks/useBoxes';
import { BoxCard } from './BoxCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const BoxList = () => {
  const { data, isLoading, error } = useBoxes();

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
        <p className="text-danger font-medium">Erro ao carregar caixas</p>
        <p className="text-muted-foreground text-sm mt-2">{(error as Error).message}</p>
      </div>
    );
  }

  const boxes = data?.items || [];

  return (
    <div className="space-y-6">
      {boxes.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Nenhuma caixa encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {boxes.map((box) => (
            <BoxCard key={box.id} box={box} />
          ))}
        </div>
      )}
    </div>
  );
};
