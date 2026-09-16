import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'amber' | 'blue' | 'purple' | 'red' | 'slate';
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend,
  onClick
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-50/60 text-emerald-700 border-emerald-100',
      iconBg: 'bg-emerald-500 text-white',
      accent: 'border-l-emerald-500'
    },
    amber: {
      bg: 'bg-amber-50/60 text-amber-700 border-amber-100',
      iconBg: 'bg-amber-500 text-white',
      accent: 'border-l-amber-500'
    },
    blue: {
      bg: 'bg-sky-50/60 text-sky-700 border-sky-100',
      iconBg: 'bg-sky-600 text-white',
      accent: 'border-l-sky-600'
    },
    purple: {
      bg: 'bg-indigo-50/60 text-indigo-700 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white',
      accent: 'border-l-indigo-600'
    },
    red: {
      bg: 'bg-rose-50/60 text-rose-700 border-rose-100',
      iconBg: 'bg-rose-600 text-white',
      accent: 'border-l-rose-600'
    },
    slate: {
      bg: 'bg-slate-50/80 text-slate-700 border-slate-200',
      iconBg: 'bg-slate-700 text-white',
      accent: 'border-l-slate-700'
    }
  }[variant];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</span>
            {trend && (
              <span
                className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                  trend.isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl shadow-xs shrink-0 ${variantStyles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
