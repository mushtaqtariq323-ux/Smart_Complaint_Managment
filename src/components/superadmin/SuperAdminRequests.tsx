import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Check, 
  X, 
  MapPin, 
  Globe, 
  Mail, 
  Phone 
} from 'lucide-react';

export const SuperAdminRequests: React.FC = () => {
  const { institutionRequests, approveInstitutionRequest, rejectInstitutionRequest } = useApp();

  const pending = institutionRequests.filter((r) => r.status === 'pending');
  const processed = institutionRequests.filter((r) => r.status !== 'pending');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Institution Onboarding Applications</h1>
        <p className="text-xs text-slate-500">
          Review credentials submitted by universities, colleges, and schools across Pakistan requesting SCMS integration
        </p>
      </div>

      {/* Pending Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <span>Pending HEC Verification</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              {pending.length}
            </span>
          </h2>
        </div>

        {pending.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">All onboarding applications processed</p>
            <p className="text-slate-400 mt-1">No new institutions awaiting HEC vetting.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                        {req.type}
                      </span>
                      <span className="text-[11px] text-slate-400">Submitted: {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{req.institutionName}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.city}, {req.province}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      onClick={() => approveInstitutionRequest(req.id)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Provision</span>
                    </button>
                    <button
                      onClick={() => rejectInstitutionRequest(req.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Focal Person</span>
                    <strong className="text-slate-800">{req.adminName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official Contact</span>
                    <p className="font-mono text-[11px]">{req.adminEmail}</p>
                    <p className="font-mono text-[11px] text-slate-400">{req.adminPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official Web</span>
                    <span className="text-purple-700 font-mono text-[11px] truncate block">
                      {req.website || 'N/A'}
                    </span>
                  </div>
                </div>

                {req.notes && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                    <strong className="text-slate-700">Campus Notes:</strong> {req.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Applications */}
      {processed.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-slate-200">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Historical Applications ({processed.length})
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-xs">
            {processed.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{r.institutionName}</h4>
                  <p className="text-[11px] text-slate-400">{r.city}, {r.province} • Admin: {r.adminName}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    r.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
