import { PieceStatus } from '../../types';

interface StatusBadgeProps {
  status: PieceStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const isApproved = status === PieceStatus.APPROVED;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };
  
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded
        ${sizeClasses[size]}
        ${isApproved 
          ? 'bg-success/10 text-success border border-success/20' 
          : 'bg-danger/10 text-danger border border-danger/20'
        }
      `}
    >
      {isApproved ? '✅ Aprovada' : '❌ Reprovada'}
    </span>
  );
};
