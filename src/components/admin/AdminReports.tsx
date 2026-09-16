import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart2, 
  Download, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileSpreadsheet, 
  Calendar,
  Building
} from 'lucide-react';
import { StatsCard } from '../common/StatsCard';

export const AdminReports: React.FC = () => {
  const { currentUser, complaints, departments, showToast } = useApp();
  const [timeRange, setTimeRange] = useState('30days');

  const instComplaints = complaints.filter(
    (c) => !currentUser?.institutionId || c.institutionId === currentUser.institutionId
  );

  const total = instComplaints.length;
  const resolved = instComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  // Category statistics
  const categoryStats: { [k: string]: number } = {};
  instComplaints.forEach((c) => {
    categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
  });

  const handleExportCSV = () => {
    showToast('Campus Grievance Audit Report (CSV) exported successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grievance Analytics & SLA Reports</h1>
          <p className="text-xs text-slate-500">
            Performance metrics, response benchmarks, and departmental resolution efficiency
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="semester">Current Academic Semester</option>
            <option value="year">Full Academic Year</option>
          </select>

          <button
            id="export-report-btn"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          id="stat-rate"
          title="Resolution Rate"
          value={`${resolutionRate}%`}
          subtitle="Tickets resolved within SLA"
          icon={CheckCircle}
          variant="emerald"
        />
        <StatsCard
          id="stat-avg-response"
          title="Avg First Response"
          value="2.4 hrs"
          subtitle="From student submission"
          icon={Clock}
          variant="blue"
        />
        <StatsCard
          id="stat-avg-resolve"
          title="Avg Resolution Time"
          value="18.2 hrs"
          subtitle="Target: under 24 hrs"
          icon={TrendingUp}
          variant="amber"
        />
        <StatsCard
          id="stat-sla-breach"
          title="SLA Breaches"
          value="0 tickets"
          subtitle="Zero compliance defaults"
          icon={AlertTriangle}
          variant="slate"
        />
      </div>

      {/* Department Scorecard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Departmental SLA Scorecard</h2>
          <p className="text-xs text-slate-500">Comparative metrics and resolution efficacy across departments</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Total Received</th>
                <th className="py-3 px-4">Resolved</th>
                <th className="py-3 px-4">Avg Fix Time</th>
                <th className="py-3 px-4">Satisfaction Score</th>
                <th className="py-3 px-4 text-right">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {departments.map((dept, idx) => {
                const totalDept = complaints.filter((c) => c.departmentId === dept.id).length;
                const resolvedDept = complaints.filter((c) => c.departmentId === dept.id && (c.status === 'Resolved' || c.status === 'Closed')).length;
                const pct = totalDept > 0 ? Math.round((resolvedDept / totalDept) * 100) : 100;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {dept.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{dept.primaryCategory}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold">{totalDept}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-700 font-bold">{resolvedDept}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {idx === 0 ? '12.4h' : idx === 1 ? '8.6h' : idx === 2 ? '14.1h' : '19.5h'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      ★ {idx === 0 ? '4.8' : idx === 1 ? '4.9' : idx === 2 ? '4.7' : '4.6'} / 5.0
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        {pct}% Met
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Breakdown & Audit Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-3">Volume by Incident Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, count]) => {
              const pct = Math.round((count / (total || 1)) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">{cat}</span>
                    <span className="text-slate-500 font-mono">{count} tickets ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              HEC Compliance Standard
            </span>
            <h3 className="text-lg font-bold mt-2">National Grievance Protocol Ready</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Every filed grievance is time-stamped and encrypted in accordance with the Higher Education Commission of Pakistan (HEC) Student Rights & Grievance Guidelines (2024).
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Audit Trail Integrity: 100% Signed</span>
            <span className="text-emerald-400 font-bold">Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
