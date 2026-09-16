import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  XCircle,
  AlertTriangle, 
  Users, 
  GraduationCap,
  Briefcase,
  Layers,
  Search, 
  ChevronRight,
  ShieldCheck,
  Eye,
  Calendar,
  Filter
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    complaints, 
    users, 
    categories, 
    departments, 
    navigate 
  } = useApp();

  const [recentFilter, setRecentFilter] = useState<'all' | 'pending' | 'urgent'>('all');

  // Filter complaints for current institution
  const instComplaints = complaints.filter(
    (c) => !currentUser?.institutionId || c.institutionId === currentUser.institutionId
  );

  // Institution users
  const instUsers = users.filter(
    (u) => !currentUser?.institutionId || u.institutionId === currentUser.institutionId
  );

  const totalUsers = instUsers.length;
  const totalStudents = instUsers.filter((u) => u.role === 'student').length;
  const totalFacultyStaff = instUsers.filter((u) => u.role === 'department_staff').length;

  const totalComplaints = instComplaints.length;
  const pendingComplaints = instComplaints.filter((c) => c.status === 'Pending' || c.status === 'Submitted').length;
  const underReviewComplaints = instComplaints.filter((c) => c.status === 'Under Review').length;
  const inProgressComplaints = instComplaints.filter((c) => c.status === 'In Progress').length;
  const resolvedComplaints = instComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const rejectedComplaints = instComplaints.filter((c) => c.status === 'Rejected').length;

  // Priority counts
  const urgentCount = instComplaints.filter((c) => c.priority === 'Urgent').length;
  const highCount = instComplaints.filter((c) => c.priority === 'High').length;
  const mediumCount = instComplaints.filter((c) => c.priority === 'Medium').length;
  const lowCount = instComplaints.filter((c) => c.priority === 'Low').length;

  // Category counts
  const categoryCounts: Record<string, number> = {};
  instComplaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Recent complaints
  const filteredRecent = instComplaints
    .filter((c) => {
      if (recentFilter === 'pending') return c.status === 'Pending' || c.status === 'Submitted' || c.status === 'Under Review';
      if (recentFilter === 'urgent') return c.priority === 'Urgent';
      return true;
    })
    .slice(0, 6);

  // Recent activity logs gathered from all complaints
  const recentLogs = instComplaints
    .flatMap((c) => (c.activityLogs || []).map((l) => ({ ...l, complaintId: c.id, complaintTitle: c.title })))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Institution Admin Console
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-300 text-xs font-medium">{currentUser?.institutionName || 'NUST Central Campus'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Campus Grievance & Complaint Operations
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl">
              Complete administrative oversight over campus incident lifecycles, user access control, departmental SLAs, and automated status dispatching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="admin-btn-manage-complaints"
              onClick={() => navigate('admin', 'complaints')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>All Complaints ({totalComplaints})</span>
            </button>
            <button
              id="admin-btn-manage-users"
              onClick={() => navigate('admin', 'users')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Manage Users ({totalUsers})</span>
            </button>
            <button
              id="admin-btn-categories"
              onClick={() => navigate('admin', 'categories')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>
          </div>
        </div>
      </div>

      {/* Section 1: User Statistics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Community Accounts</span>
          </h2>
          <button
            onClick={() => navigate('admin', 'users')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            Manage User Directory →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            id="admin-stat-total-users"
            title="Total Users"
            value={totalUsers}
            subtitle="Enrolled on portal"
            icon={Users}
            variant="slate"
            onClick={() => navigate('admin', 'users')}
          />
          <StatsCard
            id="admin-stat-total-students"
            title="Total Students"
            value={totalStudents}
            subtitle="Undergraduate & Postgrad"
            icon={GraduationCap}
            variant="blue"
            onClick={() => navigate('admin', 'users')}
          />
          <StatsCard
            id="admin-stat-total-staff"
            title="Total Faculty / Staff"
            value={totalFacultyStaff}
            subtitle="Academic & Operations"
            icon={Briefcase}
            variant="emerald"
            onClick={() => navigate('admin', 'users')}
          />
        </div>
      </div>

      {/* Section 2: Complaint Status Metrics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Complaint Workflow Statuses</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Real-time status breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatsCard
            id="admin-stat-total-complaints"
            title="Total Complaints"
            value={totalComplaints}
            subtitle="All logged tickets"
            icon={FileText}
            variant="slate"
            onClick={() => navigate('admin', 'complaints')}
          />
          <StatsCard
            id="admin-stat-pending"
            title="Pending"
            value={pendingComplaints}
            subtitle="Awaiting triage"
            icon={Clock}
            variant="amber"
            onClick={() => navigate('admin', 'complaints')}
          />
          <StatsCard
            id="admin-stat-under-review"
            title="Under Review"
            value={underReviewComplaints}
            subtitle="Assessment phase"
            icon={Eye}
            variant="purple"
            onClick={() => navigate('admin', 'complaints')}
          />
          <StatsCard
            id="admin-stat-in-progress"
            title="In Progress"
            value={inProgressComplaints}
            subtitle="Assigned & active"
            icon={RefreshCw}
            variant="blue"
            onClick={() => navigate('admin', 'complaints')}
          />
          <StatsCard
            id="admin-stat-resolved"
            title="Resolved"
            value={resolvedComplaints}
            subtitle="Work completed"
            icon={CheckCircle2}
            variant="emerald"
            onClick={() => navigate('admin', 'complaints')}
          />
          <StatsCard
            id="admin-stat-rejected"
            title="Rejected"
            value={rejectedComplaints}
            subtitle="Closed or out-of-scope"
            icon={XCircle}
            variant="red"
            onClick={() => navigate('admin', 'complaints')}
          />
        </div>
      </div>

      {/* Section 3: Analytics Section (Status, Category, Priority) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints by Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Status</h3>
              <p className="text-xs text-slate-500">Distribution across lifecycle stages</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {totalComplaints} Total
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Pending', count: pendingComplaints, color: 'bg-amber-500', text: 'text-amber-700' },
              { label: 'Under Review', count: underReviewComplaints, color: 'bg-indigo-500', text: 'text-indigo-700' },
              { label: 'In Progress', count: inProgressComplaints, color: 'bg-sky-500', text: 'text-sky-700' },
              { label: 'Resolved', count: resolvedComplaints, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { label: 'Rejected', count: rejectedComplaints, color: 'bg-rose-500', text: 'text-rose-700' },
            ].map((st) => {
              const pct = totalComplaints > 0 ? Math.round((st.count / totalComplaints) * 100) : 0;
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{st.label}</span>
                    <span className="font-mono text-slate-500">
                      {st.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${st.color} transition-all duration-500`}
                      style={{ width: `${Math.max(pct, st.count > 0 ? 6 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaints by Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
              <p className="text-xs text-slate-500">Campus service domain volume</p>
            </div>
            <button
              onClick={() => navigate('admin', 'categories')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Categories
            </button>
          </div>

          <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
            {Object.entries(categoryCounts).length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No category data recorded yet</p>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">{cat}</span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Complaints by Priority */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Complaints by Priority</h3>
                <p className="text-xs text-slate-500">Urgency level classification</p>
              </div>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                {urgentCount} Critical
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-center">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide block">Urgent</span>
                <span className="text-2xl font-black text-rose-700 mt-1 block">{urgentCount}</span>
                <span className="text-[10px] text-rose-600 font-medium">SLA: &lt; 4 Hours</span>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-center">
                <span className="text-[11px] font-bold text-orange-800 uppercase tracking-wide block">High</span>
                <span className="text-2xl font-black text-orange-700 mt-1 block">{highCount}</span>
                <span className="text-[10px] text-orange-600 font-medium">SLA: &lt; 12 Hours</span>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-center">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide block">Medium</span>
                <span className="text-2xl font-black text-blue-700 mt-1 block">{mediumCount}</span>
                <span className="text-[10px] text-blue-600 font-medium">SLA: &lt; 24 Hours</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">Low</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">{lowCount}</span>
                <span className="text-[10px] text-slate-500 font-medium">SLA: &lt; 48 Hours</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Urgent & High Triage:</span>
            <span className="font-bold text-slate-900">
              {urgentCount + highCount} tickets ({totalComplaints > 0 ? Math.round(((urgentCount + highCount) / totalComplaints) * 100) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Section 4: Recent Activity & Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Complaints</h3>
              <p className="text-xs text-slate-500">Live operational queue awaiting triage and action</p>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setRecentFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  recentFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRecentFilter('pending')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  recentFilter === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setRecentFilter('urgent')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  recentFilter === 'urgent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Urgent
              </button>
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100">
            {filteredRecent.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No complaints found matching filter
              </div>
            ) : (
              filteredRecent.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate('admin', 'complaint-details', c.id)}
                  className="p-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {c.id}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                      <PriorityBadge priority={c.priority} size="sm" />
                      <CategoryBadge category={c.category} size="sm" />
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {c.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      Submitted by <span className="font-medium text-slate-700">{c.studentName}</span> • {c.location}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={() => navigate('admin', 'complaints')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              View Full Incident Queue ({instComplaints.length} tickets) →
            </button>
          </div>
        </div>

        {/* Audit Log / Activity Trail (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Activity Log</h3>
              <span className="text-[11px] text-slate-400 font-mono">Live Audit</span>
            </div>

            <div className="space-y-3.5">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No recent actions logged</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="text-xs space-y-1 border-l-2 border-emerald-500 pl-3 py-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate">
                      <span className="font-semibold text-emerald-800">{log.complaintId}:</span> {log.note || log.complaintTitle}
                    </p>
                    <p className="text-[10px] text-slate-400">By {log.authorName} ({log.authorRole.replace('_', ' ')})</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => navigate('admin', 'notifications')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              View System Alerts
            </button>
            <button
              onClick={() => navigate('admin', 'reports')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Export SLA Audit Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
