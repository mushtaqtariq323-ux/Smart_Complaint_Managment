import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { InstitutionType } from '../../types';
import { 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building, 
  IdCard, 
  BookOpen, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '../../data/mockData';

export const RegisterPage: React.FC = () => {
  const { registerStudent, authError, clearAuthError, isLoading } = useAuth();
  const { institutions, submitInstitutionRequest, navigate, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'student' | 'institution'>('student');

  // Student form state - ROLE IS STRICTLY 'student'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    institutionId: institutions[0]?.id || 'inst-1',
    rollNumber: '',
    department: 'Computer Science & Engineering',
    phone: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Institution onboarding request form state (for University registrars/VCEs)
  const [instData, setInstData] = useState({
    institutionName: '',
    type: 'university' as InstitutionType,
    city: 'Islamabad',
    province: 'Federal Capital (Islamabad)',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    website: '',
    notes: ''
  });
  const [instSubmitted, setInstSubmitted] = useState(false);

  // Departments list for quick selection
  const popularDepartments = [
    'Computer Science & Engineering',
    'Electrical & Power Engineering',
    'Mechanical Engineering',
    'Civil & Environmental Engineering',
    'Business Administration & Management',
    'Software Engineering',
    'Medicine & Health Sciences',
    'Pharmacy & Pharmaceutical Sciences',
    'Social Sciences & Humanities',
    'Natural Sciences & Mathematics'
  ];

  const validateStudentForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = 'Full Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.rollNumber.trim()) {
      errors.rollNumber = 'Student ID / Roll Number is required';
    }

    if (!formData.department.trim()) {
      errors.department = 'Department name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Mobile contact number is required';
    } else if (formData.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid Pakistani phone number (e.g., +92 300 1234567)';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must accept the terms and conditions to register';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    if (!validateStudentForm()) return;

    const selectedInst = institutions.find((i) => i.id === formData.institutionId) || institutions[0];

    const res = await registerStudent({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      institutionId: selectedInst?.id || 'inst-1',
      institutionName: selectedInst?.name || 'Academic Institution',
      rollNumber: formData.rollNumber,
      department: formData.department,
      phone: formData.phone,
      agreeTerms: formData.agreeTerms
    });

    if (res.success) {
      showToast('Student account created! Please verify your institutional email address.', 'success');
      navigate('public', 'verify-email');
    }
  };

  const handleInstitutionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitInstitutionRequest({
      institutionName: instData.institutionName,
      type: instData.type,
      city: instData.city,
      province: instData.province,
      adminName: instData.adminName,
      adminEmail: instData.adminEmail,
      adminPhone: instData.adminPhone,
      website: instData.website,
      notes: instData.notes
    });
    setInstSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            Higher Education Commission (HEC) SCMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Create an SCMS Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Register your verified student profile to lodge and track campus grievances
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-slate-200/80 rounded-2xl mb-6">
          <button
            type="button"
            id="tab-register-student"
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span>Student Registration</span>
          </button>
          <button
            type="button"
            id="tab-register-institution"
            onClick={() => setActiveTab('institution')}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'institution'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Campus Onboarding Request</span>
          </button>
        </div>

        {/* Tab 1: Student Registration (ROLE STRICTLY LOCKED TO STUDENT) */}
        {activeTab === 'student' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Student Account Application</h2>
                <p className="text-xs text-slate-500">Authorized for currently enrolled students</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Role: Student</span>
              </div>
            </div>

            {authError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Registration Error</p>
                  <p className="text-[11px] text-rose-700 mt-0.5">{authError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    id="register-name-input"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: '' });
                    }}
                    placeholder="e.g. Ayesha Khan"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                      formErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                </div>
                {formErrors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              {/* Institution Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Enrolled Educational Institution <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="register-institution-select"
                    value={formData.institutionId}
                    onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} — {inst.city} ({inst.province})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student ID / Roll Number & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Student ID / Roll Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      id="register-roll-input"
                      value={formData.rollNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, rollNumber: e.target.value });
                        if (formErrors.rollNumber) setFormErrors({ ...formErrors, rollNumber: '' });
                      }}
                      placeholder="e.g. 2023-CS-184"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.rollNumber ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.rollNumber && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.rollNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department / Discipline <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      list="departments-list"
                      id="register-dept-input"
                      value={formData.department}
                      onChange={(e) => {
                        setFormData({ ...formData, department: e.target.value });
                        if (formErrors.department) setFormErrors({ ...formErrors, department: '' });
                      }}
                      placeholder="Select or enter department"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.department ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <datalist id="departments-list">
                      {popularDepartments.map((d) => (
                        <option key={d} value={d} />
                      ))}
                    </datalist>
                  </div>
                  {formErrors.department && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.department}</p>
                  )}
                </div>
              </div>

              {/* Email & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Student Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      id="register-email-input"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      placeholder="student@institution.edu.pk"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Contact Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      id="register-phone-input"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      placeholder="+92 300 1234567"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password (min. 6 characters) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      id="register-password-input"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      id="register-confirm-password-input"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        if (formErrors.confirmPassword) setFormErrors({ ...formErrors, confirmPassword: '' });
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-10 py-2 rounded-xl border text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                        formErrors.confirmPassword ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id="register-terms-checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => {
                      setFormData({ ...formData, agreeTerms: e.target.checked });
                      if (formErrors.agreeTerms) setFormErrors({ ...formErrors, agreeTerms: '' });
                    }}
                    className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 select-none leading-relaxed">
                    I confirm that I am an actively enrolled student, and I agree to abide by the{' '}
                    <span className="text-emerald-800 font-semibold underline">
                      Higher Education Commission (HEC) SCMS Ethics & Grievance Guidelines
                    </span>.
                  </span>
                </label>
                {formErrors.agreeTerms && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.agreeTerms}</p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                id="register-student-submit-btn"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <span>Register as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have an SCMS student account?{' '}
              <button
                type="button"
                id="go-to-login-btn"
                onClick={() => navigate('public', 'login')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Sign In here
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Institution Onboarding Request */}
        {activeTab === 'institution' && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            {instSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Campus Onboarding Application Received</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you! Your institutional onboarding request for <strong>{instData.institutionName}</strong> has been routed to the Higher Education Commission (HEC) SCMS Directorate for charter and domain validation.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setInstSubmitted(false);
                      setActiveTab('student');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
                  >
                    Back to Registration
                  </button>
                  <button
                    onClick={() => navigate('public', 'home')}
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInstitutionSubmit} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-2">
                  <p className="font-semibold text-slate-800 mb-0.5">Notice for Campus Authorities</p>
                  <p className="text-[11px] text-slate-500">
                    This form is exclusively for Vice Chancellors, Registrars, and IT Directors looking to onboard their university, college, or school into Pakistan's centralized grievance redressal network.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    value={instData.institutionName}
                    onChange={(e) => setInstData({ ...instData, institutionName: e.target.value })}
                    placeholder="e.g. University of the Punjab, New Campus"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Type</label>
                    <select
                      value={instData.type}
                      onChange={(e) => setInstData({ ...instData, type: e.target.value as InstitutionType })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="university">Chartered University</option>
                      <option value="college">Degree College</option>
                      <option value="school">Higher Secondary School</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <select
                      value={instData.city}
                      onChange={(e) => setInstData({ ...instData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Province</label>
                    <select
                      value={instData.province}
                      onChange={(e) => setInstData({ ...instData, province: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {PAKISTAN_PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Designated Admin / Registrar Name
                    </label>
                    <input
                      type="text"
                      required
                      value={instData.adminName}
                      onChange={(e) => setInstData({ ...instData, adminName: e.target.value })}
                      placeholder="Prof. Dr. Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Registrar Email
                    </label>
                    <input
                      type="email"
                      required
                      value={instData.adminEmail}
                      onChange={(e) => setInstData({ ...instData, adminEmail: e.target.value })}
                      placeholder="registrar@campus.edu.pk"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Office Phone</label>
                    <input
                      type="tel"
                      required
                      value={instData.adminPhone}
                      onChange={(e) => setInstData({ ...instData, adminPhone: e.target.value })}
                      placeholder="+92 51 9085 1000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Website URL</label>
                    <input
                      type="url"
                      value={instData.website}
                      onChange={(e) => setInstData({ ...instData, website: e.target.value })}
                      placeholder="https://www.campus.edu.pk"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-institution-request-btn"
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
                >
                  <span>Submit Institutional Onboarding Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
