import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Database, Save, CheckCircle, Bell, Lock } from 'lucide-react';

export const SuperAdminSettings: React.FC = () => {
  const { showToast } = useApp();

  const [requireCharter, setRequireCharter] = useState(true);
  const [nationalRetentionDays, setNationalRetentionDays] = useState(365);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Federal SCMS regulatory policies saved successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Federal SCMS System Settings</h1>
        <p className="text-xs text-slate-500">
          Higher Education Commission (HEC) national governance rules and data security policies
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-800">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Accreditation & Charter Verification</h2>
              <p className="text-xs text-slate-500">Requirements for academic institutions onboarded to SCMS</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Mandatory HEC / Provincial Charter Verification
                </span>
                <span className="text-[11px] text-slate-500">
                  Block automated activation until legal charter documents are manually reviewed
                </span>
              </div>
              <input
                type="checkbox"
                checked={requireCharter}
                onChange={(e) => setRequireCharter(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
            </label>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Audit Trail Retention Period
                </span>
                <span className="text-[11px] text-slate-500">
                  Minimum number of days student grievance activity logs are preserved
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={nationalRetentionDays}
                  onChange={(e) => setNationalRetentionDays(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs border rounded-lg bg-white"
                />
                <span className="text-xs text-slate-600 font-bold">Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            id="superadmin-save-btn"
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Federal Policies</span>
          </button>
        </div>
      </form>
    </div>
  );
};
