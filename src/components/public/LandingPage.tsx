import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  Building2, 
  Users, 
  Sparkles, 
  Search, 
  Clock, 
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
  ChevronRight,
  School,
  Flame
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../common/Badge';

export const LandingPage: React.FC = () => {
  const { navigate, complaints, institutions, loginAsUser } = useApp();
  const [trackQuery, setTrackQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    const found = complaints.find(
      (c) => c.id.toLowerCase() === trackQuery.trim().toLowerCase()
    );
    setSearchResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-950 text-white overflow-hidden py-16 sm:py-24">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Empowering 80+ Universities, Colleges & Schools Across Pakistan
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Smart Complaint Management for Modern Pakistan
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              A unified digital grievance portal connecting students, departmental staff, campus administrators, and educational authorities with transparent, real-time tracking and automated SLA routing.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                id="hero-submit-complaint-btn"
                onClick={() => {
                  loginAsUser('student');
                  navigate('student', 'submit');
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Submit a Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-demo-login-btn"
                onClick={() => navigate('public', 'login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>Portal Login</span>
              </button>

              <button
                id="hero-register-institute-btn"
                onClick={() => navigate('public', 'register')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all"
              >
                <span>Register Institution</span>
              </button>
            </div>
          </div>

          {/* Quick Tracking Widget */}
          <div className="mt-12 max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-white/15 shadow-2xl">
            <h3 className="text-sm font-bold text-white text-center mb-1">
              Quick Public Complaint Tracker
            </h3>
            <p className="text-xs text-slate-300 text-center mb-4">
              Enter any Complaint ID (e.g. <span className="text-emerald-300 font-mono font-bold">CMP-2026-0814</span> or <span className="text-emerald-300 font-mono font-bold">CMP-2026-0815</span>) to check live status:
            </p>

            <form onSubmit={handleTrack} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Enter Complaint ID (e.g., CMP-2026-0814)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                id="track-submit-btn"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
              >
                Track
              </button>
            </form>

            {hasSearched && (
              <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-left animate-in fade-in">
                {searchResult ? (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div>
                        <span className="font-mono text-xs font-bold text-emerald-400">{searchResult.id}</span>
                        <h4 className="text-sm font-bold text-white mt-0.5">{searchResult.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={searchResult.status} />
                        <PriorityBadge priority={searchResult.priority} />
                      </div>
                    </div>
                    <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-400">Department:</span> {searchResult.departmentName}
                      </div>
                      <div>
                        <span className="text-slate-400">Institution:</span> {searchResult.institutionName.split('(')[0]}
                      </div>
                      <div>
                        <span className="text-slate-400">Location:</span> {searchResult.location}
                      </div>
                      <div>
                        <span className="text-slate-400">Last Update:</span> {new Date(searchResult.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        id="view-tracked-details-btn"
                        onClick={() => {
                          loginAsUser('student');
                          navigate('student', 'complaint-details', searchResult.id);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                      >
                        <span>View Complete Timeline & Logs</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-rose-300 text-center py-2">
                    No complaint found matching "{trackQuery}". Try checking the ID or sign in to your dashboard.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Metric Cards Banner */}
      <section className="bg-white border-y border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">85+</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">Partner Institutions</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">HEC & Provincial Boards</p>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">140,000+</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">Registered Students</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Active Campus Grievance Loggers</p>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">94.8%</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">Resolution Rate</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Verified Completion SLA</p>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">&lt; 24 Hrs</div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-500">Average Response Time</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">Direct Department Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Graphic */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              The Transparent 8-Step Resolution Cycle
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              How SCMS transforms campus maintenance and administrative response from unrecorded paper complaints to real-time accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Student Logs Issue</h3>
              <p className="text-xs text-slate-600 mt-1">
                Student files complaint with photo proof, exact campus room/wing, and category urgency.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Institution Verification</h3>
              <p className="text-xs text-slate-600 mt-1">
                Campus Admin reviews, validates student identity, and routes directly to the assigned department.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Staff Dispatch & Action</h3>
              <p className="text-xs text-slate-600 mt-1">
                Designated technician or officer updates status from Pending to In Progress with repair logs.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Resolved & Closed</h3>
              <p className="text-xs text-slate-600 mt-1">
                Student receives instant SMS/in-app alert, reviews work quality, and ticket closes automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Institutions Showcase */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Participating Campuses</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Top Universities, Colleges & Schools in Pakistan
              </h2>
            </div>
            <button
              id="view-institutes-btn"
              onClick={() => navigate('public', 'about')}
              className="mt-3 md:mt-0 text-sm font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Explore Accreditation Standards</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.slice(0, 6).map((inst) => (
              <div
                key={inst.id}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{inst.logo || '🏛️'}</span>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase bg-slate-200 text-slate-700 mb-1">
                      {inst.type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {inst.city}, {inst.province}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Students</span>
                    <span className="font-bold text-slate-800">{inst.studentsCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Departments</span>
                    <span className="font-bold text-slate-800">12+ Functional</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Test Demo Bar for Evaluators */}
      <section className="bg-emerald-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-950/60 rounded-2xl p-6 sm:p-8 border border-emerald-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                ⚡ Evaluator Quick Access
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Experience all 4 user roles with 1-click
              </h3>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
                Test the exact dashboard experiences for Student, Institution Admin, Department Staff, and Higher Education Super Admin without passwords.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
              <button
                id="demo-student-btn"
                onClick={() => loginAsUser('student')}
                className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-xl hover:bg-emerald-100 transition-colors shadow-sm"
              >
                🎓 Student Portal
              </button>
              <button
                id="demo-admin-btn"
                onClick={() => loginAsUser('institution_admin')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors"
              >
                🏛️ Institution Admin
              </button>
              <button
                id="demo-staff-btn"
                onClick={() => loginAsUser('department_staff')}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-emerald-600 transition-colors"
              >
                🔧 Staff Member
              </button>
              <button
                id="demo-superadmin-btn"
                onClick={() => loginAsUser('super_admin')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
              >
                🇵🇰 Super Admin
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-extrabold text-base mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm">
                S
              </div>
              <span>SCMS Pakistan</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              National Smart Complaint Management System developed for schools, colleges, and universities across Pakistan.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('public', 'about')} className="hover:text-white">About SCMS</button></li>
              <li><button onClick={() => navigate('public', 'features')} className="hover:text-white">Features Overview</button></li>
              <li><button onClick={() => navigate('public', 'how-it-works')} className="hover:text-white">8-Step Workflow</button></li>
              <li><button onClick={() => navigate('public', 'contact')} className="hover:text-white">Support & Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Accredited Provinces</h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• Federal Capital Islamabad</li>
              <li>• Punjab (Lahore, Rawalpindi, Multan)</li>
              <li>• Sindh (Karachi, Hyderabad, Sukkur)</li>
              <li>• Khyber Pakhtunkhwa (Peshawar, Abbottabad)</li>
              <li>• Balochistan & AJK Regions</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Help Desk & Emergency</h4>
            <p className="text-slate-300 font-mono text-xs">Toll-Free: 111-7267-75</p>
            <p className="text-slate-400 text-[11px] mt-1">support@scms.gov.pk</p>
            <p className="text-slate-500 text-[11px] mt-3">
              HEC Pakistan Building, H-9 Islamabad
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-800 text-center text-slate-500 text-[11px]">
          © 2026 Smart Complaint Management System (SCMS). All rights reserved. Islamic Republic of Pakistan.
        </div>
      </footer>
    </div>
  );
};
