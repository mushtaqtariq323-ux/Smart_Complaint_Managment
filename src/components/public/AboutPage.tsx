import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, Target, BookOpen, Building, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            National Educational Initiative
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Smart Complaint Management System (SCMS)
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Standardizing grievance redressal, infrastructure maintenance, and student welfare across educational institutions in Pakistan.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our National Mission</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              To eliminate bureaucracy in campus administration by providing students and faculty with an effortless, auditable, and automated digital grievance channel. SCMS ensures no issue—whether a broken lab instrument in Karachi or a Wi-Fi disruption in Islamabad—goes unaddressed.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Accountability & Standards</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Equipping institutional leaders and higher education regulators with transparent service-level agreements (SLAs), automated departmental escalations, and real-time analytical reports to measure administrative responsiveness.
            </p>
          </div>
        </div>

        {/* Pillars */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Institutional Commitments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Student Anonymity & Dignity Protection</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Complaints related to sensitive topics or campus security can be submitted with protected identities to safeguard students against academic intimidation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct Departmental Escalation</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Complaints bypass manual paperwork and arrive immediately on the mobile dashboard of responsible department engineers and technicians.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Time-Bound SLAs</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Urgent safety and laboratory hazards must be inspected within 4 hours; general facility tickets carry guaranteed 48-hour closure metrics.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">HEC Pakistan Compliance</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Quarterly audits compile cross-institutional grievance benchmarks to help universities maintain their national charter and accreditation rankings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            id="about-cta-btn"
            onClick={() => navigate('public', 'register')}
            className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-colors"
          >
            Register Your Institution With SCMS
          </button>
        </div>
      </div>
    </div>
  );
};
