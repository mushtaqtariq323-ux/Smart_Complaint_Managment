import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Check,
  X
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';

export const SuperAdminDashboard: React.FC = () => {
  const { 
    institutions, 
    complaints, 
    institutionRequests, 
    approveInstitutionRequest, 
    rejectInstitutionRequest, 
    navigate 
  } = useApp();

  const totalInstitutions = institutions.filter((i) => i.status === 'Active').length;
  const totalComplaints = complaints.length;
  const pendingRequests = institutionRequests.filter((r) => r.status === 'pending').length;
  const resolvedTotal = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const nationalSlaRate = Math.round((resolvedTotal / (totalComplaints || 1)) * 100);

  // Provincial count
  const provincialStats: { [k: string]: number } = {};
  institutions.forEach((inst) => {
    provincialStats[inst.province] = (provincialStats[inst.province] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 border border-purple-800/40 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Federal Higher Education Regulatory Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              SCMS National Grievance Directorate
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-2xl">
              Cross-provincial monitoring authority supervising academic complaint resolution in Pakistan's primary, secondary, and higher education sectors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="superadmin-requests-btn"
              onClick={() => navigate('superadmin', 'requests')}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <span>Onboarding Requests</span>
              {pendingRequests > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-purple-900 font-black text-[10px]">
                  {pendingRequests}
                </span>
              )}
            </button>
            <button
              id="superadmin-audit-btn"
              onClick={() => navigate('superadmin', 'complaints')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors"
            >
              Audit All Tickets
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="stat-institutions"
          title="Active Institutions"
          value={totalInstitutions}
          subtitle="Universities, colleges & schools"
          icon={Building2}
          variant="purple"
        />
        <StatsCard
          id="stat-all-complaints"
          title="National Tickets"
          value={totalComplaints}
          subtitle="Cumulative logged complaints"
          icon={FileText}
          variant="slate"
        />
        <StatsCard
          id="stat-pending-requests"
          title="Pending Approvals"
          value={pendingRequests}
          subtitle="Awaiting HEC charter check"
          icon={Clock}
          variant="amber"
        />
        <StatsCard
          id="stat-national-sla"
          title="National SLA Compliance"
          value={`${nationalSlaRate}%`}
          subtitle="Target threshold: > 85%"
          icon={CheckCircle2}
          variant="emerald"
        />
      </div>

      {/* Two Columns: Pending Onboarding Queue + Provincial Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approval Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institution Onboarding Approvals</h2>
              <p className="text-xs text-slate-500">
                New university, college, or school requests submitted via registration portal
              </p>
            </div>
            <button
              onClick={() => navigate('superadmin', 'requests')}
              className="text-xs font-bold text-purple-700 hover:underline"
            >
              View Full Queue →
            </button>
          </div>

          <div className="space-y-3">
            {institutionRequests.filter((r) => r.status === 'pending').length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                <p className="font-semibold text-slate-700">All institutional applications reviewed</p>
                <p className="text-slate-400">No pending verification requests at this time.</p>
              </div>
            ) : (
              institutionRequests
                .filter((r) => r.status === 'pending')
                .slice(0, 3)
                .map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-purple-100 bg-purple-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{req.institutionName}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-800">
                          {req.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {req.city}, {req.province} • Admin: <strong>{req.adminName}</strong> ({req.adminEmail})
                      </p>
                      {req.notes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                          "{req.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approveInstitutionRequest(req.id)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectInstitutionRequest(req.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Provincial Distribution (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-1">Regional Adoption</h2>
          <p className="text-xs text-slate-500 mb-4">Onboarded institutions by province</p>

          <div className="space-y-3 text-xs">
            {Object.entries(provincialStats).map(([province, count]) => {
              const pct = Math.round((count / (institutions.length || 1)) * 100);
              return (
                <div key={province} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 truncate max-w-[170px]">
                      {province}
                    </span>
                    <span className="font-mono text-slate-500">{count} campuses</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-700"
                      style={{ width: `${Math.max(pct, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('superadmin', 'institutions')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-purple-900 text-xs font-bold rounded-xl border border-slate-200 text-center transition-colors"
            >
              Explore All Institutions Directory →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
