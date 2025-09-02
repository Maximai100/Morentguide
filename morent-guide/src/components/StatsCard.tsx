import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {title}
            </p>
            <p className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100 mt-1">
              {value}
            </p>
            {trend && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <svg 
                  className={`w-4 h-4 ml-1 ${
                    trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {trend.isPositive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
