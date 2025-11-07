import { useState } from 'react';
import { Piece, PieceStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Package, Scale, Ruler, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useDeletePiece } from '../../hooks/usePieces';
import { useToast } from '../../hooks/use-toast';

interface PieceCardProps {
  piece: Piece;
  onClick?: () => void;
}

export const PieceCard = ({ piece, onClick }: PieceCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deletePiece = useDeletePiece();
  const { toast } = useToast();

  const colorMap: Record<string, string> = {
    azul: 'Azul',
    verde: 'Verde',
  };

  const handleDelete = async () => {
    try {
      await deletePiece.mutateAsync(piece.id);
      toast({
        title: 'Peça removida',
        description: `A peça ${piece.id} foi removida com sucesso.`,
      });
      setShowDeleteDialog(false);
    } catch (error) {
      toast({
        title: 'Erro ao remover peça',
        description: (error as Error).message || 'Ocorreu um erro ao tentar remover a peça.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
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
          <div className="flex items-center gap-2">
            <StatusBadge status={piece.status} size="sm" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDeleteClick}
              disabled={deletePiece.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover a peça <strong>{piece.id}</strong>? Esta ação não pode ser desfeita.
            {piece.status === PieceStatus.APPROVED && piece.box_id && (
              <span className="block mt-2 text-sm">
                A peça será removida da caixa {piece.box_id}.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deletePiece.isPending}
          >
            {deletePiece.isPending ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
