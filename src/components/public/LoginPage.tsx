import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  GraduationCap, 
  Building2, 
  Wrench, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Sparkles,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithDemoRole, authError, clearAuthError, isLoading } = useAuth();
  const { navigate, showToast } = useApp();

  // Form states
  const [email, setEmail] = useState('ayesha.khan@seecs.edu.pk');
  const [password, setPassword] = useState('Student@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case 'student':
        navigate('student', 'dashboard');
        break;
      case 'institution_admin':
        navigate('admin', 'dashboard');
        break;
      case 'department_staff':
        navigate('staff', 'dashboard');
        break;
      case 'super_admin':
        navigate('superadmin', 'dashboard');
        break;
      default:
        navigate('public', 'home');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!validateForm()) return;

    const res = await login(email, password, rememberMe);
    if (res.success && res.user) {
      showToast(`Welcome back, ${res.user.name}! Accessing portal...`, 'success');
      redirectByRole(res.user.role);
    }
  };

  // Quick fill demo credentials
  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setValidationErrors({});
    clearAuthError();
    showToast(`Form populated with credentials for ${demoEmail}`, 'info');
  };

  // Instant 1-click Demo Login
  const handleInstantDemoLogin = async (role: UserRole) => {
    clearAuthError();
    const user = await loginWithDemoRole(role);
    showToast(`Signed in as ${user.name} (${role.replace('_', ' ').toUpperCase()})`, 'success');
    redirectByRole(user.role);
  };

  return (
    <div className="bg-slate-50 min-h-[85vh] py-10 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 flex items-center justify-center text-white font-extrabold text-xl mx-auto mb-3 shadow-md shadow-emerald-700/20">
            SC
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Sign In to SCMS Portal</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            National Smart Complaint Management System • Islamic Republic of Pakistan
          </p>
        </div>

        {/* Demo Persona Card with Instant 1-Click Login & Quick-Fill */}
        <div className="mb-6 bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-5 rounded-2xl border border-emerald-800 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                Demo Accounts for Testing
              </span>
            </div>
            <span className="text-[10px] bg-emerald-800/60 text-emerald-200 px-2 py-0.5 rounded font-mono">
              Role-Based Authentication
            </span>
          </div>

          <p className="text-xs text-emerald-200/90 mb-3">
            Click <strong>"Sign In"</strong> for 1-click instant login, or <strong>"Fill"</strong> to test form validation & submission:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {DEMO_ACCOUNTS.map((acc) => {
              const Icon = acc.role === 'student' ? GraduationCap : acc.role === 'institution_admin' ? Building2 : acc.role === 'department_staff' ? Wrench : ShieldCheck;
              return (
                <div
                  key={acc.role}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-emerald-700/40 hover:border-emerald-500 transition-colors flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-900 text-emerald-300 shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-xs truncate">{acc.roleLabel}</p>
                      <p className="text-[10px] text-emerald-300 truncate font-mono">{acc.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Pass: {acc.password}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                    <button
                      type="button"
                      id={`fill-demo-${acc.role}`}
                      onClick={() => handleQuickFill(acc.email, acc.password)}
                      className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-medium transition-colors"
                    >
                      Fill Form
                    </button>
                    <button
                      type="button"
                      id={`instant-login-${acc.role}`}
                      onClick={() => handleInstantDemoLogin(acc.role)}
                      className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Standard Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Authentication Error</p>
                <p className="text-[11px] text-rose-700 mt-0.5">{authError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional / Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  id="login-email-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationErrors.email) setValidationErrors({ ...validationErrors, email: undefined });
                  }}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
                    validationErrors.email ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                  }`}
                  placeholder="e.g. ayesha.khan@seecs.edu.pk"
                />
              </div>
              {validationErrors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  id="forgot-password-link"
                  onClick={() => navigate('public', 'forgot-password')}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="login-password-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (validationErrors.password) setValidationErrors({ ...validationErrors, password: undefined });
                  }}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
                    validationErrors.password ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  id="toggle-password-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{validationErrors.password}</p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember-me-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <span className="text-xs text-slate-600 select-none">Remember this device</span>
              </label>

              <span className="text-[11px] text-slate-400">
                SSL 256-bit Encrypted
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to SCMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an educational account?{' '}
            <button
              type="button"
              id="go-to-register-btn"
              onClick={() => navigate('public', 'register')}
              className="text-emerald-700 font-bold hover:underline"
            >
              Register as Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
