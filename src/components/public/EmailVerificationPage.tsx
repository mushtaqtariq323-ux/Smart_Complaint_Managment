import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  MailCheck, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  GraduationCap
} from 'lucide-react';

export const EmailVerificationPage: React.FC = () => {
  const { 
    verifyEmail, 
    resendVerificationEmail, 
    pendingVerificationEmail, 
    setPendingVerificationEmail,
    isLoading 
  } = useAuth();
  const { navigate, showToast } = useApp();

  const [email] = useState(pendingVerificationEmail || 'student@institution.edu.pk');
  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(45);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    if (code.trim().length !== 6) {
      setErrorMsg('Please enter a complete 6-digit verification code.');
      return;
    }

    const res = await verifyEmail(code.trim());
    if (res.success) {
      setIsVerified(true);
      showToast('Academic email successfully verified! Welcome to SCMS.', 'success');
      setTimeout(() => {
        navigate('student', 'dashboard');
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Verification failed. Please check the code.');
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setResending(true);
    setErrorMsg(null);
    const res = await resendVerificationEmail(email);
    setResending(false);
    if (res.success) {
      showToast(`Fresh verification code sent to ${email}`, 'success');
      setResendCountdown(45);
    } else {
      setErrorMsg(res.error || 'Could not resend email. Please try again.');
    }
  };

  const fillDemoCode = () => {
    setCode('542891');
    setErrorMsg(null);
  };

  return (
    <div className="bg-slate-50 min-h-[80vh] py-12 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 mx-auto mb-3 shadow-xs border border-emerald-200">
            <MailCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Verify Your Educational Email</h1>
          <p className="text-xs text-slate-500 mt-1">
            To ensure genuine campus grievances, all student accounts must verify their institutional email address
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {isVerified ? (
            /* Success confirmation screen */
            <div className="text-center py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Email Verified Successfully!</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Your student grievance profile is now active.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Redirecting to Student Dashboard...</span>
              </div>
              <button
                id="manual-proceed-dashboard"
                onClick={() => navigate('student', 'dashboard')}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span>Go to Dashboard Immediately</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Verification Code Form */
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500">Verification code sent to:</p>
                <p className="text-xs font-mono font-bold text-slate-900 bg-slate-100 py-1.5 px-3 rounded-lg inline-block border border-slate-200 break-all">
                  {email}
                </p>
              </div>

              {/* Quick-test helper banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-emerald-900">Demo Testing Code</p>
                    <p className="text-[10px] text-emerald-700 font-mono font-bold">542891</p>
                  </div>
                </div>
                <button
                  type="button"
                  id="fill-demo-code-btn"
                  onClick={fillDemoCode}
                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold transition-colors shadow-xs"
                >
                  Quick Fill
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 text-center">
                  Enter 6-Digit Security Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    id="verification-code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="542891"
                    autoFocus
                    className="w-48 text-center text-xl font-mono tracking-widest px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center mt-1.5">
                  Check your spam/junk folder if not received within 60 seconds
                </p>
              </div>

              <button
                type="submit"
                id="verify-email-btn"
                disabled={isLoading || code.trim().length !== 6}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Activate Account</span>
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setPendingVerificationEmail(null);
                    navigate('public', 'register');
                  }}
                  className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  id="resend-verification-btn"
                  disabled={resendCountdown > 0 || resending}
                  onClick={handleResend}
                  className={`text-xs font-semibold flex items-center gap-1 ${
                    resendCountdown > 0 || resending 
                      ? 'text-slate-400 cursor-not-allowed' 
                      : 'text-emerald-700 hover:underline'
                  }`}
                >
                  {resending && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>
                    {resendCountdown > 0 ? `Resend email (${resendCountdown}s)` : 'Resend code'}
                  </span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => navigate('public', 'login')}
                  className="text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Already verified? Sign In here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
