interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({
  current,
  max,
  label,
  showPercentage = true,
}: ProgressBarProps) => {
  const percentage = Math.min((current / max) * 100, 100);
  const isFull = current >= max;
  
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-muted-foreground">
              {current}/{max} ({Math.round(percentage)}%)
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-300 ${
            isFull ? 'bg-success' : 'bg-secondary'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
