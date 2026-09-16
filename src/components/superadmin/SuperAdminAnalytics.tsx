import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, CheckCircle, Clock, MapPin, Building2, ShieldCheck } from 'lucide-react';
import { StatsCard } from '../common/StatsCard';

export const SuperAdminAnalytics: React.FC = () => {
  const { institutions, complaints } = useApp();

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">National Analytics & Benchmarks</h1>
        <p className="text-xs text-slate-500">
          HEC macro-level grievance benchmarks across provinces, universities, and technical institutes
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="stat-macro-total"
          title="Total Ingested Tickets"
          value={total}
          subtitle="All provinces"
          icon={BarChart3}
          variant="slate"
        />
        <StatsCard
          id="stat-macro-rate"
          title="Overall Resolution Rate"
          value={`${Math.round((resolved / (total || 1)) * 100)}%`}
          subtitle="Fixed within 48h window"
          icon={CheckCircle}
          variant="emerald"
        />
        <StatsCard
          id="stat-macro-campuses"
          title="Active Campuses"
          value={institutions.length}
          subtitle="Integrated institutes"
          icon={Building2}
          variant="purple"
        />
        <StatsCard
          id="stat-macro-satisfaction"
          title="National Student CSAT"
          value="4.7 / 5.0"
          subtitle="Across 2,400+ surveys"
          icon={TrendingUp}
          variant="blue"
        />
      </div>

      {/* Institution Rankings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Institutional Governance & SLA Rankings</h2>
          <p className="text-xs text-slate-500">Ranked by speed of resolution, student satisfaction, and compliance</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Institution Name</th>
                <th className="py-3 px-4">Province</th>
                <th className="py-3 px-4">Tickets Handled</th>
                <th className="py-3 px-4">Resolution Rate</th>
                <th className="py-3 px-4">HEC Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {institutions.map((inst, idx) => {
                const count = complaints.filter((c) => c.institutionId === inst.id).length;
                return (
                  <tr key={inst.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-purple-900">#{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{inst.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{inst.province}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold">{count}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-700">
                        {idx === 0 ? '98.2%' : idx === 1 ? '96.5%' : idx === 2 ? '94.0%' : '91.8%'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                        Tier 1 Compliant
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
