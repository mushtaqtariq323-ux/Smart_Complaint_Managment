import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building, Sliders, Bell, Shield, Clock, Save, CheckCircle } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { currentUser, showToast } = useApp();

  const [slaHoursUrgent, setSlaHoursUrgent] = useState(4);
  const [slaHoursHigh, setSlaHoursHigh] = useState(12);
  const [slaHoursMedium, setSlaHoursMedium] = useState(24);
  const [slaHoursLow, setSlaHoursLow] = useState(48);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Campus configuration and SLA parameters updated successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Campus Portal Configuration</h1>
        <p className="text-xs text-slate-500">
          Tune institutional policies, SLA response thresholds, and notification gateways for {currentUser?.institutionName}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SLA Escalation Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Service Level Agreement (SLA) Targets</h2>
              <p className="text-xs text-slate-500">Maximum allowed hours before unaddressed complaints trigger escalation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
              <label className="block text-xs font-bold text-rose-900 mb-1">Urgent Priority</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={slaHoursUrgent}
                  onChange={(e) => setSlaHoursUrgent(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-rose-300 text-xs font-bold bg-white"
                />
                <span className="text-xs text-rose-800 font-semibold">Hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/40">
              <label className="block text-xs font-bold text-orange-900 mb-1">High Priority</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={48}
                  value={slaHoursHigh}
                  onChange={(e) => setSlaHoursHigh(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-orange-300 text-xs font-bold bg-white"
                />
                <span className="text-xs text-orange-800 font-semibold">Hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
              <label className="block text-xs font-bold text-blue-900 mb-1">Medium Priority</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={4}
                  max={72}
                  value={slaHoursMedium}
                  onChange={(e) => setSlaHoursMedium(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-300 text-xs font-bold bg-white"
                />
                <span className="text-xs text-blue-800 font-semibold">Hours</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50">
              <label className="block text-xs font-bold text-slate-800 mb-1">Low Priority</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={12}
                  max={120}
                  value={slaHoursLow}
                  onChange={(e) => setSlaHoursLow(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                />
                <span className="text-xs text-slate-600 font-semibold">Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Automated Triggers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Communication & Notification Gateways</h2>
              <p className="text-xs text-slate-500">Automated alerts for students, heads of departments, and technicians</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Instant Email Notifications</span>
                <span className="text-[11px] text-slate-500">Send status update receipts to student and staff email addresses</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">SMS Urgent Alert Broadcast</span>
                <span className="text-[11px] text-slate-500">Trigger cellular SMS to on-call duty technician for 'Urgent' safety tickets</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Automated Super Admin / HEC Escalation</span>
                <span className="text-[11px] text-slate-500">Flag tickets unresolved past 72 hours on the national regulatory oversight queue</span>
              </div>
              <input
                type="checkbox"
                checked={autoEscalate}
                onChange={(e) => setAutoEscalate(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="save-settings-btn"
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
