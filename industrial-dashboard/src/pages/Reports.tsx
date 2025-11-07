import { useFinalReport } from '../hooks/useReports';
import { MetricCard } from '../components/common/MetricCard';
import { RejectionChart } from '../components/reports/RejectionChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { BarChart3, Package, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

const Reports = () => {
  const { data: report, isLoading, error } = useFinalReport();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-danger/10 border-2 border-danger/20 rounded-lg p-8 text-center">
            <p className="text-danger font-medium text-lg">Erro ao carregar relatório</p>
            <p className="text-muted-foreground text-sm mt-2">{(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  const totalPieces = (report?.total_aprovadas || 0) + (report?.total_reprovadas || 0);
  const approvalRate = totalPieces > 0
    ? ((report!.total_aprovadas / totalPieces) * 100).toFixed(1)
    : '0';
  const rejectionRate = totalPieces > 0
    ? ((report!.total_reprovadas / totalPieces) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-lg shadow-lg">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Relatórios de Produção
              </h1>
              <p className="text-primary-foreground/80 mt-1">
                Análise completa da qualidade da produção
              </p>
            </div>
          </div>
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
            title="Caixas Utilizadas"
            value={report?.total_caixas || 0}
            icon={<Package />}
            color="muted"
          />
        </div>

        {/* Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MetricCard
            title="Taxa de Aprovação"
            value={`${approvalRate}%`}
            icon={<TrendingUp />}
            color="success"
          />
          <MetricCard
            title="Taxa de Rejeição"
            value={`${rejectionRate}%`}
            icon={<TrendingUp />}
            color="danger"
          />
        </div>

        {/* Rejection Analysis */}
        <RejectionChart data={report?.motivo_contagem || []} />
      </div>
    </div>
  );
};

export default Reports;
