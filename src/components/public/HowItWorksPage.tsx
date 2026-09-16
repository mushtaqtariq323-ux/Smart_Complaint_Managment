import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileEdit, 
  Building, 
  UserCheck, 
  Network, 
  Wrench, 
  RefreshCw, 
  Eye, 
  CheckCircle2, 
  ArrowDown, 
  ChevronRight 
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { navigate, loginAsUser } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Student Submits Complaint',
      icon: FileEdit,
      color: 'bg-emerald-600',
      description: 'The student selects a complaint category (e.g. Internet, Electricity, Water), specifies the exact campus location (building, floor, room), sets priority, and optionally attaches photo evidence.'
    },
    {
      num: '02',
      title: "Associated with Student's Institution",
      icon: Building,
      color: 'bg-teal-600',
      description: 'The ticket is automatically tethered to the verified institution (e.g., NUST Islamabad, LUMS Lahore, GCU) with verified student credentials (roll number and campus email).'
    },
    {
      num: '03',
      title: 'Institution Admin Receives It',
      icon: UserCheck,
      color: 'bg-sky-600',
      description: 'Campus administration receives instant dashboard notification and reviews ticket validity and SLA urgency classification.'
    },
    {
      num: '04',
      title: 'Routed to Relevant Department',
      icon: Network,
      color: 'bg-indigo-600',
      description: 'Based on the category, the complaint is routed to the designated departmental head (Electrical, IT & Networks, Sanitation, Transport, Campus Security).'
    },
    {
      num: '05',
      title: 'Staff Handles the Complaint',
      icon: Wrench,
      color: 'bg-amber-600',
      description: 'An on-ground technician or departmental staff member is officially assigned with clear ownership and dispatched to inspect the issue.'
    },
    {
      num: '06',
      title: 'Status is Updated in Real-Time',
      icon: RefreshCw,
      color: 'bg-orange-600',
      description: 'Technician updates ticket status to "In Progress" with diagnostic notes and required spare parts or repair milestones.'
    },
    {
      num: '07',
      title: 'Student Tracks the Complaint',
      icon: Eye,
      color: 'bg-purple-600',
      description: 'Student monitors live stage progress on their personal dashboard, receives timeline activity logs, and can add supplemental comments.'
    },
    {
      num: '08',
      title: 'Complaint is Resolved and Closed',
      icon: CheckCircle2,
      color: 'bg-emerald-700',
      description: 'After verified physical remediation, the staff submits resolution notes. The ticket moves to Resolved and is archived with full audit history.'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            Grievance Lifecycle
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How SCMS Resolves Campus Issues
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            From initial student submission to physical on-ground repair and verified closure.
          </p>
        </div>

        {/* Step-by-step vertical visual timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-slate-200 before:hidden md:before:block">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start gap-5 relative group hover:border-slate-300 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center font-black text-base shadow-sm shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400">STEP {step.num}</span>
                    <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-12 bg-emerald-950 text-white p-8 rounded-2xl text-center">
          <h3 className="text-xl font-bold">Ready to Experience SCMS?</h3>
          <p className="text-xs sm:text-sm text-emerald-200 mt-2 max-w-md mx-auto">
            Test the live submission workflow as a student, or log in as an administrator to dispatch complaints.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              id="try-submit-btn"
              onClick={() => {
                loginAsUser('student');
                navigate('student', 'submit');
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Submit Test Complaint
            </button>
            <button
              id="try-admin-btn"
              onClick={() => {
                loginAsUser('institution_admin');
                navigate('admin', 'complaints');
              }}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
            >
              View Admin Routing Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
