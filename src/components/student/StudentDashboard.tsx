import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FilePlus2, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Search, 
  ChevronRight,
  ArrowRight,
  Archive,
  Send,
  HelpCircle,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { ComplaintStatus } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { currentUser, complaints, navigate } = useApp();
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('ALL');

  // Security & Role Isolation: Student must strictly only see their own complaints
  const studentComplaints = complaints.filter(
    (c) => c.studentId === currentUser?.id || c.studentEmail === currentUser?.email || c.userId === currentUser?.id
  );

  // Status Metrics
  const total = studentComplaints.length;
  const countSubmitted = studentComplaints.filter((c) => c.status === 'Submitted').length;
  const countPending = studentComplaints.filter((c) => c.status === 'Pending').length;
  const countInProgress = studentComplaints.filter((c) => c.status === 'In Progress').length;
  const countResolved = studentComplaints.filter((c) => c.status === 'Resolved').length;
  const countClosed = studentComplaints.filter((c) => c.status === 'Closed').length;

  // The 4 requested headline stats cards
  const pendingStat = countPending + countSubmitted; // Pending action / awaiting dispatch
  const inProgressStat = countInProgress;
  const resolvedStat = countResolved;

  // Status breakdown configuration
  const breakdownStages: {
    status: ComplaintStatus;
    count: number;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    description: string;
  }[] = [
    {
      status: 'Submitted',
      count: countSubmitted,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      description: 'Logged and waiting for admin assignment'
    },
    {
      status: 'Pending',
      count: countPending,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50/70',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      description: 'Assessed by grievance desk'
    },
    {
      status: 'In Progress',
      count: countInProgress,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      description: 'Department technician assigned and active'
    },
    {
      status: 'Resolved',
      count: countResolved,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50/70',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800',
      description: 'Work signed-off and verified'
    },
    {
      status: 'Closed',
      count: countClosed,
      color: 'bg-slate-400',
      bgColor: 'bg-slate-50',
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'Final institutional case archiving'
    }
  ];

  // Filtered recent list
  const recentComplaints = studentComplaints
    .filter((c) => {
      if (selectedStatusTab === 'ALL') return true;
      return c.status === selectedStatusTab;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Section */}
      <div 
        id="student-welcome-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xs border border-emerald-800/60"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Grievance Redressal Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              {currentUser?.institutionName || 'National University of Sciences & Technology (NUST)'}
              {currentUser?.rollNumber ? ` • Roll No: ${currentUser.rollNumber}` : ''}
            </p>
            <p className="text-xs text-emerald-200/70 max-w-xl leading-relaxed pt-1">
              Submit, track, and monitor real-time maintenance and academic grievances. Your tickets are routed directly to authorized university departments for verified resolution.
            </p>
          </div>

          {/* 3. Quick Actions (Header Placed for Easy Reach) */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              id="student-dash-submit-btn"
              onClick={() => navigate('student', 'submit')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>Submit New Complaint</span>
            </button>
            <button
              id="student-dash-view-all-btn"
              onClick={() => navigate('student', 'complaints')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View My Complaints</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          id="stat-total-complaints"
          title="Total Complaints"
          value={total}
          subtitle="All grievances registered"
          icon={FileText}
          variant="slate"
        />
        <StatsCard
          id="stat-pending-complaints"
          title="Pending"
          value={pendingStat}
          subtitle={`${countSubmitted} submitted, ${countPending} in review`}
          icon={Clock}
          variant="amber"
        />
        <StatsCard
          id="stat-inprogress-complaints"
          title="In Progress"
          value={inProgressStat}
          subtitle="Technicians currently on-site"
          icon={RefreshCw}
          variant="blue"
        />
        <StatsCard
          id="stat-resolved-complaints"
          title="Resolved"
          value={resolvedStat}
          subtitle="Completed and verified"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* 3. Quick Actions Panel (Visual Shortcuts) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div 
          onClick={() => navigate('student', 'submit')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Lodge a New Grievance
              </h3>
              <p className="text-xs text-slate-500">
                Report electricity, water, lab, Wi-Fi or classroom facility issues
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </div>

        <div 
          onClick={() => navigate('student', 'complaints')}
          className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                Manage All My Complaints ({total})
              </h3>
              <p className="text-xs text-slate-500">
                Filter by priority, category, inspect audit trail & staff logs
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>

      {/* 5. Complaint Status Visualization (Chart / Visual Breakdown) */}
      <div 
        id="complaint-status-visualization"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Complaint Pipeline & Resolution Status</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live lifecycle distribution across the 5 official resolution stages
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 self-start sm:self-auto">
            {total} Active Grievances Logged
          </span>
        </div>

        {/* Stacked Proportional Bar Chart */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
            {total === 0 ? (
              <div className="w-full h-full bg-slate-200" />
            ) : (
              breakdownStages.map((stage) => {
                const pct = total > 0 ? (stage.count / total) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div
                    key={stage.status}
                    title={`${stage.status}: ${stage.count} (${pct.toFixed(0)}%)`}
                    style={{ width: `${pct}%` }}
                    className={`h-full ${stage.color} transition-all duration-500 relative group`}
                  />
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
            <span>Submitted (New)</span>
            <span>Closed (Archived)</span>
          </div>
        </div>

        {/* Breakdown Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {breakdownStages.map((stage) => {
            const percentage = total > 0 ? Math.round((stage.count / total) * 100) : 0;
            const isSelected = selectedStatusTab === stage.status;
            return (
              <button
                key={stage.status}
                onClick={() => setSelectedStatusTab(isSelected ? 'ALL' : stage.status)}
                className={`p-3.5 rounded-xl border text-left transition-all ${stage.bgColor} ${stage.borderColor} ${
                  isSelected ? 'ring-2 ring-slate-900 shadow-xs' : 'hover:opacity-90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                  <span className="text-[11px] font-bold text-slate-500">{percentage}%</span>
                </div>
                <div className="mt-2">
                  <div className="text-xl font-black text-slate-900">{stage.count}</div>
                  <p className="text-xs font-bold text-slate-800">{stage.status}</p>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{stage.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Recent Complaints Table / List */}
      <div 
        id="recent-complaints-section"
        className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
      >
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
              {selectedStatusTab !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Filtered: {selectedStatusTab}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Showing your latest registered grievances and maintenance dispatches
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedStatusTab !== 'ALL' && (
              <button
                onClick={() => setSelectedStatusTab('ALL')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-2 py-1"
              >
                Reset Filter
              </button>
            )}
            <button
              onClick={() => navigate('student', 'complaints')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
            >
              <span>View All ({total})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        {recentComplaints.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No complaints in this category</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {total === 0 
                ? 'You have not submitted any complaints yet. Click below to submit your first grievance.'
                : 'No complaints match the selected filter. Try selecting "All" above.'}
            </p>
            {total === 0 && (
              <button
                onClick={() => navigate('student', 'submit')}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Submit First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentComplaints.map((c) => (
                  <tr
                    key={c.id}
                    id={`dash-row-${c.id}`}
                    onClick={() => navigate('student', 'complaint-details', c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        id={`dash-view-btn-${c.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('student', 'complaint-details', c.id);
                        }}
                        className="px-3 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200/60"
                      >
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
