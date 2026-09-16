import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Check, 
  Zap, 
  FileText, 
  Bell, 
  BarChart3, 
  Lock, 
  Layers, 
  Smartphone 
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { navigate, loginAsUser } = useApp();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Core Capabilities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Features Tailored For Educational Excellence
          </h1>
          <p className="mt-4 text-base text-slate-600">
            A comprehensive, multi-role suite engineered specifically for Pakistani schools, colleges, and university campuses.
          </p>
        </div>

        {/* Feature Grid by Role */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Suite */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Student Portal</h2>
                <p className="text-xs text-slate-500">Fast, friction-free grievance submission</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 flex-1">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Multi-category submission:</strong> Electricity, Wi-Fi, Water, Labs, Classrooms, Transport & Security.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Real-time status timeline:</strong> Visual step-by-step progress tracking from submission to sign-off.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Direct photo attachments:</strong> Capture and upload evidence of physical defects or network pings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Automated alerts:</strong> Receive updates when department staff are dispatched.</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                id="feat-student-cta"
                onClick={() => {
                  loginAsUser('student');
                  navigate('student', 'dashboard');
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                Launch Student Portal Demo →
              </button>
            </div>
          </div>

          {/* Institution Admin Suite */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Institution Admin Portal</h2>
                <p className="text-xs text-slate-500">Campus-wide supervision & routing</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 flex-1">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Centralized grievance queue:</strong> Filter by urgency, building location, status, and department.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Intelligent staff assignment:</strong> Assign technicians or supervisors with one click.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Department Directory:</strong> Manage campus units (Electrical, IT, Sanitation, Facilities, Security).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <span><strong>Analytics & Resolution Reports:</strong> Track turnaround times and department backlogs.</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                id="feat-admin-cta"
                onClick={() => {
                  loginAsUser('institution_admin');
                  navigate('admin', 'dashboard');
                }}
                className="text-xs font-bold text-blue-700 hover:text-blue-800"
              >
                Launch Admin Portal Demo →
              </button>
            </div>
          </div>

          {/* Department Staff Suite */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Department Staff Portal</h2>
                <p className="text-xs text-slate-500">On-ground technician task manager</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 flex-1">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Dedicated task queue:</strong> View tickets assigned specifically to you or your department.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>On-site status updates:</strong> Mark tasks In Progress, append repair logs, and mark Resolved.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Resolution notes:</strong> Document hardware parts replaced, cable runs, or corrective actions taken.</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                id="feat-staff-cta"
                onClick={() => {
                  loginAsUser('department_staff');
                  navigate('staff', 'dashboard');
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                Launch Staff Portal Demo →
              </button>
            </div>
          </div>

          {/* Super Admin Suite */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-xs flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Super Admin Portal (HEC)</h2>
                <p className="text-xs text-slate-500">National governance & onboarding</p>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-slate-700 flex-1">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>Institution Onboarding:</strong> Review, approve, or reject new institution registrations.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>Cross-Campus Audit:</strong> Search and audit complaints across all Pakistani universities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>National Analytics:</strong> Province-wise complaint breakdowns, category distributions, and SLA metrics.</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                id="feat-super-cta"
                onClick={() => {
                  loginAsUser('super_admin');
                  navigate('superadmin', 'dashboard');
                }}
                className="text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                Launch Super Admin Portal Demo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
