import { PieceForm } from '../components/pieces/PieceForm';
import { Package, Info } from 'lucide-react';
import { QUALITY_CRITERIA } from '../constants/qualityCriteria';

const PieceRegistration = () => {
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Registrar Nova Peça
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Insira as especificações da peça para avaliação de qualidade
              </p>
            </div>
          </div>
        </div>

        {/* Quality Criteria Info */}
        <div className="bg-card p-6 rounded-lg border-2 border-border">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-secondary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-3">Critérios de Qualidade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Peso:</span>{' '}
                    {QUALITY_CRITERIA.PESO_MIN}g - {QUALITY_CRITERIA.PESO_MAX}g
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Comprimento:</span>{' '}
                    {QUALITY_CRITERIA.COMPRIMENTO_MIN}cm - {QUALITY_CRITERIA.COMPRIMENTO_MAX}cm
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Cores:</span> Azul, Verde
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Capacidade da Caixa:</span>{' '}
                    {QUALITY_CRITERIA.BOX_CAPACITY} peças
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <PieceForm />
      </div>
    </div>
  );
};

export default PieceRegistration;
