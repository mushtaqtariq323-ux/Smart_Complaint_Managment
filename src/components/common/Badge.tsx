import React from 'react';
import { ComplaintStatus, Priority, ComplaintCategory } from '../../types';

interface BadgeProps {
  variant?: 'status' | 'priority' | 'category' | 'role' | 'type';
  value: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<{ status: ComplaintStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  
  switch (status) {
    case 'Submitted':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Submitted
        </span>
      );
    case 'Pending':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Under Review
        </span>
      );
    case 'In Progress':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-sky-50 text-sky-800 border border-sky-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          In Progress
        </span>
      );
    case 'Resolved':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    case 'Closed':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
          Closed
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: Priority; size?: 'sm' | 'md' }> = ({ priority, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  switch (priority) {
    case 'Urgent':
      return (
        <span className={`inline-flex items-center font-bold tracking-tight rounded-md bg-red-50 text-red-700 border border-red-200 ${sizeClasses}`}>
          ⚡ Urgent
        </span>
      );
    case 'High':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-orange-50 text-orange-700 border border-orange-200 ${sizeClasses}`}>
          High
        </span>
      );
    case 'Medium':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
          Medium
        </span>
      );
    case 'Low':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}>
          Low
        </span>
      );
    default:
      return <span>{priority}</span>;
  }
};

export const CategoryBadge: React.FC<{ category: ComplaintCategory; size?: 'sm' | 'md' }> = ({ category, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
      {category}
    </span>
  );
};
