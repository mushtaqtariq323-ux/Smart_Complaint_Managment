import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, LogIn, ArrowRight } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { navigate, showToast } = useApp();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showToast('Authentication required. Please sign in to proceed.', 'error');
      navigate('public', 'login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500">Verifying session credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Authentication Required</h2>
        <p className="text-xs text-slate-600 mb-6 leading-relaxed">
          You must be signed in to an authorized academic account to access this section of the Smart Complaint Management System.
        </p>
        <button
          onClick={() => navigate('public', 'login')}
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Go to Sign In Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
