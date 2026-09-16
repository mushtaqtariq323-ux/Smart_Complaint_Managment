import React from 'react';
import { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldX, ArrowRight, UserCheck, LogOut } from 'lucide-react';

interface RoleProtectedRouteProps {
  allowedRoles: UserRole | UserRole[];
  children: React.ReactNode;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ 
  allowedRoles, 
  children 
}) => {
  const { currentUser, isAuthenticated, isLoading, logout } = useAuth();
  const { navigate, showToast } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Checking portal permissions...</p>
      </div>
    );
  }

  // If not authenticated at all, redirect to login
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
          <ShieldX className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          Please sign in to access this portal.
        </p>
        <button
          onClick={() => navigate('public', 'login')}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const allowedList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasPermission = allowedList.includes(currentUser.role);

  if (!hasPermission) {
    const roleFormat = (r: string) => r.replace('_', ' ').toUpperCase();
    const userDashboardMap: Record<UserRole, { view: any; page: string }> = {
      student: { view: 'student', page: 'dashboard' },
      institution_admin: { view: 'admin', page: 'dashboard' },
      department_staff: { view: 'staff', page: 'dashboard' },
      super_admin: { view: 'superadmin', page: 'dashboard' }
    };

    const targetRoute = userDashboardMap[currentUser.role];

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4 border border-rose-200 shadow-xs">
          <ShieldX className="w-8 h-8" />
        </div>
        
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold uppercase tracking-wider mb-2">
          HTTP 403 Forbidden
        </span>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Role Access Denied</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed max-w-sm">
          Your account role (<strong className="text-slate-900">{roleFormat(currentUser.role)}</strong>) does not have authorization to view this protected view. This section requires <strong className="text-emerald-800">{allowedList.map(roleFormat).join(' or ')}</strong> privileges.
        </p>

        <div className="bg-slate-100 p-4 rounded-xl text-left w-full mb-6 text-xs space-y-1.5 border border-slate-200">
          <p className="text-slate-500">Current Session:</p>
          <p className="font-bold text-slate-900 flex items-center justify-between">
            <span>{currentUser.name}</span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-[10px] uppercase font-mono">{currentUser.role}</span>
          </p>
          <p className="text-slate-600 text-[11px]">{currentUser.email}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <button
            onClick={() => {
              navigate(targetRoute.view, targetRoute.page);
              showToast(`Redirected to your ${roleFormat(currentUser.role)} dashboard`, 'info');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Return to My Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={async () => {
              await logout();
              navigate('public', 'login');
              showToast('Signed out. Please select another account to sign in.', 'info');
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
