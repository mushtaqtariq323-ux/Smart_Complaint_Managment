import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  Bell, 
  Menu, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Wrench,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    currentUser, 
    currentAppPage, 
    notifications, 
    navigate, 
    switchRole, 
    logoutToPublic, 
    markNotificationAsRead 
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rolesList: { role: UserRole; title: string; subtitle: string; icon: any }[] = [
    {
      role: 'student',
      title: 'Student (Ayesha Khan)',
      subtitle: 'NUST Islamabad - BSCS',
      icon: GraduationCap
    },
    {
      role: 'institution_admin',
      title: 'Institution Admin',
      subtitle: 'Prof. Dr. Farooq Ahmed (NUST)',
      icon: Building2
    },
    {
      role: 'department_staff',
      title: 'Department Staff',
      subtitle: 'Engr. Bilal Tariq (IT & Networks)',
      icon: Wrench
    },
    {
      role: 'super_admin',
      title: 'Super Admin',
      subtitle: 'Dr. Tariq Mushtaq (HEC SCMS)',
      icon: ShieldCheck
    }
  ];

  const isPublic = currentAppPage.view === 'public';

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
      {/* Top Pakistan National Education Affiliation strip */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1 px-4 sm:px-8 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="truncate">
            Islamic Republic of Pakistan • National Educational Smart Complaint Management System (SCMS)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-emerald-200 text-[11px]">
          <span>Helpline: 111-SCMS-PK (7267)</span>
          <span>HEC Accredited</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {!isPublic && onToggleSidebar && (
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div 
            id="brand-logo"
            onClick={() => navigate(isPublic ? 'public' : (currentUser ? (currentUser.role === 'super_admin' ? 'superadmin' : currentUser.role === 'institution_admin' ? 'admin' : currentUser.role === 'department_staff' ? 'staff' : 'student') : 'public'), isPublic ? 'home' : 'dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-lg shadow-xs shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">S</span>
              <span className="text-emerald-200 text-xs font-bold">C</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">SCMS</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 text-[10px] font-bold rounded uppercase bg-emerald-100 text-emerald-800">
                  Pakistan
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-1">
                Smart Complaint Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links for Public View */}
        {isPublic && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-600">
            <button
              id="nav-home-btn"
              onClick={() => navigate('public', 'home')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentAppPage.page === 'home' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              id="nav-about-btn"
              onClick={() => navigate('public', 'about')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentAppPage.page === 'about' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              About SCMS
            </button>
            <button
              id="nav-features-btn"
              onClick={() => navigate('public', 'features')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentAppPage.page === 'features' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Features
            </button>
            <button
              id="nav-how-it-works-btn"
              onClick={() => navigate('public', 'how-it-works')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentAppPage.page === 'how-it-works' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => navigate('public', 'contact')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentAppPage.page === 'contact' ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Contact
            </button>
          </nav>
        )}

        {/* Right side items: Role Persona Switcher + Auth / Portal links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Persona Switcher (Allows testing all 4 roles + public guest directly from anywhere) */}
          <div className="relative" ref={roleMenuRef}>
            <button
              id="role-switcher-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold border border-slate-300/80 transition-colors"
              title="Switch demo persona to test any user role"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline text-slate-600">Persona:</span>
              <span className="text-emerald-950 font-bold capitalize">
                {currentUser ? currentUser.role.replace('_', ' ') : 'Guest / Public'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div 
                id="role-switcher-dropdown"
                className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch User Persona</p>
                  <p className="text-xs text-slate-600 mt-0.5">Test the complete end-to-end portal flows</p>
                </div>

                <div className="py-1">
                  {rolesList.map((item) => {
                    const Icon = item.icon;
                    const isCurrent = currentUser?.role === item.role;
                    return (
                      <button
                        key={item.role}
                        id={`switch-to-${item.role}`}
                        onClick={() => {
                          switchRole(item.role);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-3 transition-colors ${
                          isCurrent ? 'bg-emerald-50 text-emerald-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 truncate">
                          <p className="font-semibold truncate">{item.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                        </div>
                        {isCurrent && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    id="switch-to-public-btn"
                    onClick={() => {
                      logoutToPublic();
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View as Public Visitor (Log out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* If internal user: Notifications Bell */}
          {currentUser && (
            <div className="relative" ref={notifMenuRef}>
              <button
                id="notif-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifMenu && (
                <div 
                  id="notif-dropdown"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      <p className="text-xs text-slate-500">{unreadCount} unread updates</p>
                    </div>
                    <button
                      id="view-all-notifs-btn"
                      onClick={() => {
                        setShowNotifMenu(false);
                        const role = currentUser.role;
                        if (role === 'student') navigate('student', 'notifications');
                        else if (role === 'institution_admin') navigate('admin', 'notifications');
                        else if (role === 'department_staff') navigate('staff', 'notifications');
                        else navigate('superadmin', 'dashboard');
                      }}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      View All
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        id={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.complaintId) {
                            const role = currentUser.role;
                            if (role === 'student') navigate('student', 'complaint-details', n.complaintId);
                            else if (role === 'institution_admin') navigate('admin', 'complaint-details', n.complaintId);
                            else if (role === 'department_staff') navigate('staff', 'complaint-details', n.complaintId);
                          }
                          setShowNotifMenu(false);
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Public Portal Auth Buttons */}
          {isPublic ? (
            <div className="flex items-center gap-2">
              <button
                id="public-login-btn"
                onClick={() => navigate('public', 'login')}
                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </button>
              <button
                id="public-register-btn"
                onClick={() => navigate('public', 'register')}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
              >
                Register
              </button>
            </div>
          ) : (
            /* Logged in User chip */
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-500 capitalize leading-tight">
                  {currentUser?.role.replace('_', ' ')}
                </p>
              </div>
              <button
                id="logout-btn"
                onClick={logoutToPublic}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav for public view */}
      {isPublic && (
        <div className="md:hidden border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-around text-xs font-semibold text-slate-600">
          <button 
            id="mobile-nav-home" 
            onClick={() => navigate('public', 'home')}
            className={`py-1 ${currentAppPage.page === 'home' ? 'text-emerald-700' : ''}`}
          >
            Home
          </button>
          <button 
            id="mobile-nav-about" 
            onClick={() => navigate('public', 'about')}
            className={`py-1 ${currentAppPage.page === 'about' ? 'text-emerald-700' : ''}`}
          >
            About
          </button>
          <button 
            id="mobile-nav-features" 
            onClick={() => navigate('public', 'features')}
            className={`py-1 ${currentAppPage.page === 'features' ? 'text-emerald-700' : ''}`}
          >
            Features
          </button>
          <button 
            id="mobile-nav-how-it-works" 
            onClick={() => navigate('public', 'how-it-works')}
            className={`py-1 ${currentAppPage.page === 'how-it-works' ? 'text-emerald-700' : ''}`}
          >
            How It Works
          </button>
          <button 
            id="mobile-nav-contact" 
            onClick={() => navigate('public', 'contact')}
            className={`py-1 ${currentAppPage.page === 'contact' ? 'text-emerald-700' : ''}`}
          >
            Contact
          </button>
        </div>
      )}
    </header>
  );
};
