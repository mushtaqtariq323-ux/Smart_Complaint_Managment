import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  Building2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  BellRing, 
  Smartphone,
  Save,
  Calendar
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { showToast } = useApp();
  const { currentUser, updateUserProfile } = useAuth();

  const [phone, setPhone] = useState(currentUser?.phone || '+92 301 2345678');
  const [altEmail, setAltEmail] = useState('ayesha.personal@gmail.com');
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({
        phone: phone.trim()
      });
      showToast('Student contact information and notification preferences updated.', 'success');
    } catch (err) {
      showToast('Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Profile & Settings</h1>
        <p className="text-xs text-slate-500">
          Manage your verified university enrollment details, contact preferences, and grievance alerts
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-xs flex items-center justify-center text-2xl sm:text-3xl font-black text-emerald-300 shrink-0">
            {currentUser?.name?.charAt(0) || 'S'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{currentUser?.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Student</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
              {currentUser?.institutionName || 'National University of Sciences & Technology (NUST)'}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-emerald-200/80 pt-1">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">Roll: {currentUser?.rollNumber || '2023-CS-184'}</span>
              <span>•</span>
              <span>{currentUser?.departmentName || 'Computer Science & Software Engineering'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
          {/* Institutional Enrollment Details (Read-only / Security Locked) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Institutional Academic Enrollment (Registrar Verified)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Locked against unauthorized student modification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Full Student Name
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.name}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  CMS / Student Roll Number
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.rollNumber || '2023-CS-184'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-mono font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Assigned Institution
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.institutionName || 'National University of Sciences & Technology (NUST)'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-semibold cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Institutional Eduroam / LMS Email
                </label>
                <input
                  type="text"
                  disabled
                  value={currentUser?.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-mono font-semibold cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contact & Grievance Alert Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="student-profile-phone" className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  SMS Alert Mobile Number (Pakistan)
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="student-profile-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 301 2345678"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Used for SMS alerts when a technician arrives at the venue</p>
              </div>

              <div>
                <label htmlFor="student-profile-alt-email" className="block text-[11px] font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Alternate Personal Recovery Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="student-profile-alt-email"
                    type="email"
                    value={altEmail}
                    onChange={(e) => setAltEmail(e.target.value)}
                    placeholder="student.backup@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Backup notification channel for grievance reports</p>
              </div>
            </div>

            {/* Notification Checkboxes */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifySms}
                  onChange={(e) => setNotifySms(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Send instant SMS broadcast when ticket status changes to <strong>In Progress</strong> or <strong>Resolved</strong>
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Email administrative resolution sign-offs and technician closing remarks
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              id="save-profile-btn"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
