import { useState } from 'react';
import { useCreatePiece } from '../../hooks/usePieces';
import { Color } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { QUALITY_CRITERIA } from '../../constants/qualityCriteria';

export const PieceForm = () => {
  const [id, setId] = useState('');
  const [peso, setPeso] = useState('');
  const [cor, setCor] = useState<Color>(Color.AZUL);
  const [comprimento, setComprimento] = useState('');

  const { mutate: createPiece, isPending } = useCreatePiece();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!id.trim()) {
      toast.error('ID é obrigatório');
      return;
    }

    const pesoNum = parseFloat(peso);
    const comprimentoNum = parseFloat(comprimento);

    if (isNaN(pesoNum) || pesoNum <= 0) {
      toast.error('Peso deve ser um número positivo');
      return;
    }

    if (isNaN(comprimentoNum) || comprimentoNum <= 0) {
      toast.error('Comprimento deve ser um número positivo');
      return;
    }

    createPiece(
      {
        id: id.trim(),
        peso: pesoNum,
        cor,
        comprimento: comprimentoNum,
      },
      {
        onSuccess: (piece) => {
          toast.success(`Peça ${piece.id} criada com sucesso!`, {
            description: piece.status === 'approved' ? '✅ Aprovada' : '❌ Reprovada',
          });
          // Reset form
          setId('');
          setPeso('');
          setComprimento('');
          setCor(Color.AZUL);
        },
        onError: (error: Error) => {
          toast.error('Erro ao criar peça', {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border-2 border-border">
      <div>
        <Label htmlFor="id" className="text-base font-semibold">
          ID da Peça *
        </Label>
        <Input
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="ex: P013"
          className="mt-2"
          disabled={isPending}
        />
      </div>

      <div>
        <Label htmlFor="peso" className="text-base font-semibold">
          Peso (g) *
        </Label>
        <Input
          id="peso"
          type="number"
          step="0.1"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder={`${QUALITY_CRITERIA.PESO_MIN} - ${QUALITY_CRITERIA.PESO_MAX}g`}
          className="mt-2"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Intervalo válido: {QUALITY_CRITERIA.PESO_MIN}g - {QUALITY_CRITERIA.PESO_MAX}g
        </p>
      </div>

      <div>
        <Label htmlFor="comprimento" className="text-base font-semibold">
          Comprimento (cm) *
        </Label>
        <Input
          id="comprimento"
          type="number"
          step="0.1"
          value={comprimento}
          onChange={(e) => setComprimento(e.target.value)}
          placeholder={`${QUALITY_CRITERIA.COMPRIMENTO_MIN} - ${QUALITY_CRITERIA.COMPRIMENTO_MAX}cm`}
          className="mt-2"
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Intervalo válido: {QUALITY_CRITERIA.COMPRIMENTO_MIN}cm - {QUALITY_CRITERIA.COMPRIMENTO_MAX}cm
        </p>
      </div>

      <div>
        <Label htmlFor="cor" className="text-base font-semibold">
          Cor *
        </Label>
        <Select value={cor} onValueChange={(value) => setCor(value as Color)} disabled={isPending}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecione uma cor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Color.AZUL}>Azul</SelectItem>
            <SelectItem value={Color.VERDE}>Verde</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full font-semibold" disabled={isPending} size="lg">
        {isPending ? 'Criando...' : 'Criar Peça'}
      </Button>
    </form>
  );
};
