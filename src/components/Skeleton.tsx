import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  borderRadius 
}) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  return (
    <div 
      className={`skeleton-pulse ${className}`} 
      style={style}
    />
  );
};

export const TicketSkeleton = () => (
  <div className="ticket-card-skeleton">
    <Skeleton height="24px" width="60%" className="mb-4" />
    <div className="flex justify-between mb-2">
      <Skeleton height="16px" width="30%" />
      <Skeleton height="16px" width="20%" />
    </div>
    <Skeleton height="16px" width="40%" className="mb-4" />
    <div className="flex justify-between mt-auto">
      <Skeleton height="32px" width="80px" borderRadius="4px" />
      <Skeleton height="32px" width="80px" borderRadius="4px" />
    </div>
  </div>
);
