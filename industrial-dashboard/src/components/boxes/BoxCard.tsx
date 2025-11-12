import { useState } from 'react';
import { Box } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Package2, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { QUALITY_CRITERIA } from '../../constants/qualityCriteria';
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
import { useDeleteBox } from '../../hooks/useBoxes';
import { useToast } from '../../hooks/use-toast';

interface BoxCardProps {
  box: Box;
  onClick?: () => void;
}

export const BoxCard = ({ box, onClick }: BoxCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteBox = useDeleteBox();
  const { toast } = useToast();
  const isOpen = box.status === 'open';

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteBox.mutateAsync(box.id);
      setShowDeleteDialog(false);
      
      // Verifica se houve peças realocadas
      if (response.reallocated_pieces && response.reallocated_pieces.length > 0) {
        const pieceCount = response.reallocated_pieces.length;
        const boxesCreated = response.boxes_created;
        
        toast({
          title: 'Caixa excluída',
          description: (
            <div>
              <p className="mb-2">A caixa #{box.id} foi excluída com sucesso.</p>
              <p className="font-semibold mb-2">
                {pieceCount} peça(s) foram realocadas:
              </p>
              <div className="space-y-1 mb-2">
                {response.reallocated_pieces.slice(0, 5).map((info, idx) => (
                  <p key={idx} className="text-sm">
                    • {info.piece_id} → Caixa {info.to_box_id}
                  </p>
                ))}
                {response.reallocated_pieces.length > 5 && (
                  <p className="text-sm text-muted-foreground">
                    ... e mais {response.reallocated_pieces.length - 5} peça(s)
                  </p>
                )}
              </div>
              {boxesCreated > 0 && (
                <p className="text-sm mt-2 text-muted-foreground">
                  {boxesCreated} nova(s) caixa(s) criada(s)
                </p>
              )}
            </div>
          ),
        });
      } else {
        toast({
          title: 'Caixa excluída',
          description: `A caixa #${box.id} foi excluída com sucesso.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro ao excluir caixa',
        description: (error as Error).message || 'Ocorreu um erro ao tentar excluir a caixa.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
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
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-xs font-medium ${
                isOpen
                  ? 'bg-secondary/10 text-secondary border border-secondary/20'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {isOpen ? '🔓 Aberta' : '🔒 Fechada'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={deleteBox.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a caixa <strong>#{box.id}</strong>? Esta ação não pode ser desfeita.
              {box.piece_count > 0 && (
                <span className="block mt-2 text-sm">
                  {box.piece_count} peça(s) serão realocadas automaticamente para outras caixas.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteBox.isPending}
            >
              {deleteBox.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
