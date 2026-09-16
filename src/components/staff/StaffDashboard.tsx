import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlusCircle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Building2, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

export const StaffDashboard: React.FC = () => {
  const { currentUser, complaints, navigate } = useApp();

  // Filter complaints submitted by this faculty/staff user
  const myComplaints = complaints.filter(
    (c) => c.studentId === currentUser?.id || c.userId === currentUser?.id || c.studentEmail === currentUser?.email
  );

  const totalCount = myComplaints.length;
  const pendingCount = myComplaints.filter((c) => c.status === 'Submitted' || c.status === 'Pending').length;
  const inProgressCount = myComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedCount = myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const rejectedCount = myComplaints.filter((c) => c.status === 'Rejected').length;

  // Recent 5 complaints
  const recentComplaints = [...myComplaints]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const resolveRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div 
        id="staff-welcome-card"
        className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 border border-blue-900/40 shadow-xs"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{currentUser?.institutionName || 'Campus Faculty Portal'}</span>
              <span className="text-blue-400">•</span>
              <span>{currentUser?.departmentName || 'Academic Department'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome back, {currentUser?.name || 'Faculty Member'}
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-200/90 leading-relaxed">
              Report equipment issues, office infrastructure faults, classroom facilities, or lab service disruptions directly to campus administration. Track resolution progress in real-time.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              id="staff-dash-submit-btn"
              onClick={() => navigate('staff', 'submit')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit New Complaint</span>
            </button>
            <button
              id="staff-dash-view-all-btn"
              onClick={() => navigate('staff', 'complaints')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>View My Complaints</span>
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          id="stat-staff-total"
          title="Total Complaints"
          value={totalCount}
          subtitle="All submitted by you"
          icon={FileText}
          variant="blue"
        />
        <StatsCard
          id="stat-staff-pending"
          title="Pending"
          value={pendingCount}
          subtitle="Awaiting review/dispatch"
          icon={Clock}
          variant="amber"
        />
        <StatsCard
          id="stat-staff-in-progress"
          title="In Progress"
          value={inProgressCount}
          subtitle="Work actively underway"
          icon={AlertTriangle}
          variant="slate"
        />
        <StatsCard
          id="stat-staff-resolved"
          title="Resolved"
          value={resolvedCount}
          subtitle="Completed & verified"
          icon={CheckCircle2}
          variant="emerald"
        />
        <StatsCard
          id="stat-staff-rejected"
          title="Rejected"
          value={rejectedCount}
          subtitle="Declined by admin"
          icon={XCircle}
          variant="rose"
        />
      </div>

      {/* Status Breakdown & Resolution Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Resolution Progress</h2>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {resolveRate}% Resolved
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-3">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div 
                  className="bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (resolvedCount / totalCount) * 100 : 0}%` }} 
                  title={`Resolved: ${resolvedCount}`}
                />
                <div 
                  className="bg-blue-500 transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (inProgressCount / totalCount) * 100 : 0}%` }} 
                  title={`In Progress: ${inProgressCount}`}
                />
                <div 
                  className="bg-amber-400 transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (pendingCount / totalCount) * 100 : 0}%` }} 
                  title={`Pending: ${pendingCount}`}
                />
                <div 
                  className="bg-rose-400 transition-all duration-500" 
                  style={{ width: `${totalCount > 0 ? (rejectedCount / totalCount) * 100 : 0}%` }} 
                  title={`Rejected: ${rejectedCount}`}
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span>Resolved ({resolvedCount})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
                  <span>In Progress ({inProgressCount})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 shrink-0" />
                  <span>Pending ({pendingCount})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 shrink-0" />
                  <span>Rejected ({rejectedCount})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need urgent maintenance assistance?</span>
            <button
              onClick={() => navigate('staff', 'submit')}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Submit Ticket</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Helpful Faculty Guidelines Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-50/70 via-slate-50 to-indigo-50/50 rounded-2xl border border-blue-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Faculty & Staff Maintenance SLA Guidelines</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              All faculty submissions are automatically assigned high routing priority by the institutional registrar and department maintenance heads.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Urgent</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">&lt; 4 Hours Response</span>
                <span className="text-[11px] text-slate-500">Safety hazards, power outage, water flooding</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">High Priority</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">&lt; 24 Hours Response</span>
                <span className="text-[11px] text-slate-500">Classroom A/V, lab switches, faculty AC</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-blue-100/80 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Standard</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">2 - 3 Working Days</span>
                <span className="text-[11px] text-slate-500">Routine carpentry, lighting, sanitation</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-blue-100/70 flex items-center justify-between text-xs text-slate-600">
            <span>Current Assigned Campus: <strong className="text-slate-800">{currentUser?.institutionName}</strong></span>
            <span className="font-mono text-[11px] text-slate-500">SCMS v2.4</span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">
              Latest grievances submitted from your faculty account
            </p>
          </div>

          <button
            id="staff-dash-view-all-recent-btn"
            onClick={() => navigate('staff', 'complaints')}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All ({totalCount})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">No complaints submitted yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You have not submitted any complaints yet. Submit a new maintenance or IT complaint to start tracking.
            </p>
            <button
              onClick={() => navigate('staff', 'submit')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Complaint</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {recentComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`staff-view-btn-${c.id}`}
                        onClick={() => navigate('staff', 'complaint-details', c.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
