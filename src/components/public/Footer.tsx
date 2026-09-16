import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, GraduationCap, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/40 py-4 px-4 sm:px-8 text-emerald-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇵🇰</span>
            <span className="font-semibold text-xs sm:text-sm text-white">
              National Smart Complaint Management System (SCMS)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>Chartered by Higher Education Commission (HEC)</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Universal Student Grievance Redressal</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Overview (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-base shadow-xs">
                S
              </div>
              <span className="font-extrabold text-white text-lg tracking-tight">SCMS Pakistan</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering students, faculty, and academic administration across Pakistan with transparent, SLA-backed resolution of campus facility, electrical, academic, and IT grievances.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>HEC H-9 Headquarters, Islamabad, Pakistan</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Toll-Free Helpline: 0800-7267-PK (0800-SCMS)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500" />
                <span>support@scms.gov.pk</span>
              </p>
            </div>
          </div>

          {/* Col 2: Public Navigation */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Portal Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('public', 'home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('public', 'about')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  About SCMS
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('public', 'features')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  System Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('public', 'how-it-works')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('public', 'contact')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Role Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">User Portals</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('student', 'dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Student Portal</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('admin', 'dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Institution Admin</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('staff', 'dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Department Staff</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('superadmin', 'dashboard')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Super Admin Console</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('public', 'register')}
                  className="hover:text-emerald-400 transition-colors text-emerald-400 font-semibold"
                >
                  Register New Campus →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Provincial Coverage */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Provincial Coverage</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>Punjab Higher Education</li>
              <li>Sindh HEC Directorate</li>
              <li>Khyber Pakhtunkhwa (KPK)</li>
              <li>Islamabad Capital Territory</li>
              <li>Balochistan Education Dept</li>
              <li>Azad Jammu & Kashmir (AJK)</li>
              <li>Gilgit-Baltistan (GB)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>© 2026 Smart Complaint Management System (SCMS). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for schools, colleges & universities in Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
