import { useFinalReport } from '../hooks/useReports';
import { useBoxes } from '../hooks/useBoxes';
import { usePieces } from '../hooks/usePieces';
import { MetricCard } from '../components/common/MetricCard';
import { BoxCard } from '../components/boxes/BoxCard';
import { RejectionChart } from '../components/reports/RejectionChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PieceCard } from '../components/pieces/PieceCard';
import { Package, CheckCircle2, XCircle, TrendingUp, PackageOpen } from 'lucide-react';

const Dashboard = () => {
  const { data: report, isLoading: reportLoading } = useFinalReport();
  const { data: boxes, isLoading: boxesLoading } = useBoxes();
  const { data: recentPieces, isLoading: piecesLoading } = usePieces(undefined, 6, 0);
  
  const isLoading = reportLoading || boxesLoading || piecesLoading;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  const totalPieces = (report?.total_aprovadas || 0) + (report?.total_reprovadas || 0);
  const approvalRate = totalPieces > 0
    ? ((report!.total_aprovadas / totalPieces) * 100).toFixed(1)
    : '0';
  
  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
            Painel de Produção
          </h1>
          <p className="text-primary-foreground/80">
            Monitoramento e controle de qualidade em tempo real
          </p>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total de Peças"
            value={totalPieces}
            icon={<Package />}
            color="primary"
          />
          <MetricCard
            title="Aprovadas"
            value={report?.total_aprovadas || 0}
            icon={<CheckCircle2 />}
            color="success"
          />
          <MetricCard
            title="Reprovadas"
            value={report?.total_reprovadas || 0}
            icon={<XCircle />}
            color="danger"
          />
          <MetricCard
            title="Taxa de Aprovação"
            value={`${approvalRate}%`}
            icon={<TrendingUp />}
            color="primary"
          />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Boxes Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PackageOpen className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Status das Caixas</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {boxes?.items.map((box) => (
                <BoxCard key={box.id} box={box} />
              ))}
            </div>
          </div>

          {/* Rejection Chart */}
          <div>
            <RejectionChart data={report?.motivo_contagem || []} />
            
            {/* Total Boxes Card */}
            <div className="mt-6">
              <MetricCard
                title="Caixas Utilizadas"
                value={report?.total_caixas || 0}
                icon={<Package />}
                color="muted"
              />
            </div>
          </div>
        </div>

        {/* Recent Pieces */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Peças Recentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPieces?.items.slice(0, 6).map((piece) => (
              <PieceCard key={piece.id} piece={piece} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
