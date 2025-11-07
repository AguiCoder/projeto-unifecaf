import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'danger' | 'muted';
}

export const MetricCard = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
}: MetricCardProps) => {
  const colorClasses = {
    primary: 'bg-primary/5 border-primary/20',
    success: 'bg-success/5 border-success/20',
    danger: 'bg-danger/5 border-danger/20',
    muted: 'bg-muted border-border',
  };
  
  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 font-medium ${trend.isPositive ? 'text-success' : 'text-danger'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-4xl opacity-50 ml-4">{icon}</div>}
      </div>
    </div>
  );
};
