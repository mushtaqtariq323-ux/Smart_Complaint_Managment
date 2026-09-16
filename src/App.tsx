import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

// Public views
import { LandingPage } from './components/public/LandingPage';
import { AboutPage } from './components/public/AboutPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage } from './components/public/LoginPage';
import { RegisterPage } from './components/public/RegisterPage';
import { ForgotPasswordPage } from './components/public/ForgotPasswordPage';
import { EmailVerificationPage } from './components/public/EmailVerificationPage';
import { Footer } from './components/public/Footer';

// Student views
import { StudentDashboard } from './components/student/StudentDashboard';
import { SubmitComplaint } from './components/student/SubmitComplaint';
import { MyComplaints } from './components/student/MyComplaints';
import { StudentComplaintDetails } from './components/student/ComplaintDetails';
import { StudentNotifications } from './components/student/StudentNotifications';
import { StudentProfile } from './components/student/StudentProfile';

// Institution Admin views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminComplaints } from './components/admin/AdminComplaints';
import { AdminComplaintDetails } from './components/admin/AdminComplaintDetails';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminDepartments } from './components/admin/AdminDepartments';
import { AdminStaff } from './components/admin/AdminStaff';
import { AdminReports } from './components/admin/AdminReports';
import { AdminNotifications } from './components/admin/AdminNotifications';
import { AdminProfile } from './components/admin/AdminProfile';
import { AdminSettings } from './components/admin/AdminSettings';

// Super Admin views
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { SuperAdminInstitutions } from './components/superadmin/SuperAdminInstitutions';
import { SuperAdminRequests } from './components/superadmin/SuperAdminRequests';
import { SuperAdminComplaints } from './components/superadmin/SuperAdminComplaints';
import { SuperAdminAnalytics } from './components/superadmin/SuperAdminAnalytics';
import { SuperAdminSettings } from './components/superadmin/SuperAdminSettings';

// Staff views
import { StaffDashboard } from './components/staff/StaffDashboard';
import { StaffSubmitComplaint } from './components/staff/StaffSubmitComplaint';
import { StaffMyComplaints } from './components/staff/StaffMyComplaints';
import { StaffComplaintDetails } from './components/staff/StaffComplaintDetails';
import { StaffNotifications } from './components/staff/StaffNotifications';
import { StaffProfile } from './components/staff/StaffProfile';

import { X, CheckCircle2, AlertTriangle, Info, Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentAppPage, toasts, dismissToast, currentUser } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPublic = currentAppPage.view === 'public';

  // Render content based on current view & page
  const renderViewContent = () => {
    switch (currentAppPage.view) {
      case 'public':
        switch (currentAppPage.page) {
          case 'home':
            return <LandingPage />;
          case 'about':
            return <AboutPage />;
          case 'features':
            return <FeaturesPage />;
          case 'how-it-works':
            return <HowItWorksPage />;
          case 'contact':
            return <ContactPage />;
          case 'login':
            return <LoginPage />;
          case 'register':
            return <RegisterPage />;
          case 'forgot-password':
            return <ForgotPasswordPage />;
          case 'verify-email':
            return <EmailVerificationPage />;
          default:
            return <LandingPage />;
        }

      case 'student':
        return (
          <RoleProtectedRoute allowedRoles="student">
            {(() => {
              switch (currentAppPage.page) {
                case 'dashboard':
                  return <StudentDashboard />;
                case 'submit':
                  return <SubmitComplaint />;
                case 'complaints':
                  return <MyComplaints />;
                case 'complaint-details':
                  return <StudentComplaintDetails complaintId={currentAppPage.detailId} />;
                case 'notifications':
                  return <StudentNotifications />;
                case 'profile':
                  return <StudentProfile />;
                default:
                  return <StudentDashboard />;
              }
            })()}
          </RoleProtectedRoute>
        );

      case 'admin':
        return (
          <RoleProtectedRoute allowedRoles="institution_admin">
            {(() => {
              switch (currentAppPage.page) {
                case 'dashboard':
                  return <AdminDashboard />;
                case 'complaints':
                  return <AdminComplaints />;
                case 'complaint-details':
                  return <AdminComplaintDetails complaintId={currentAppPage.detailId} />;
                case 'users':
                  return <AdminUsers />;
                case 'categories':
                  return <AdminCategories />;
                case 'students':
                  return <AdminUsers />;
                case 'departments':
                  return <AdminDepartments />;
                case 'staff':
                  return <AdminStaff />;
                case 'reports':
                  return <AdminReports />;
                case 'notifications':
                  return <AdminNotifications />;
                case 'profile':
                  return <AdminProfile />;
                case 'settings':
                  return <AdminSettings />;
                default:
                  return <AdminDashboard />;
              }
            })()}
          </RoleProtectedRoute>
        );

      case 'superadmin':
        return (
          <RoleProtectedRoute allowedRoles="super_admin">
            {(() => {
              switch (currentAppPage.page) {
                case 'dashboard':
                  return <SuperAdminDashboard />;
                case 'institutions':
                  return <SuperAdminInstitutions />;
                case 'requests':
                  return <SuperAdminRequests />;
                case 'complaints':
                  return <SuperAdminComplaints />;
                case 'users':
                  return <SuperAdminInstitutions />;
                case 'reports':
                  return <SuperAdminAnalytics />;
                case 'settings':
                  return <SuperAdminSettings />;
                default:
                  return <SuperAdminDashboard />;
              }
            })()}
          </RoleProtectedRoute>
        );

      case 'staff':
        return (
          <RoleProtectedRoute allowedRoles="department_staff">
            {(() => {
              switch (currentAppPage.page) {
                case 'dashboard':
                  return <StaffDashboard />;
                case 'submit':
                  return <StaffSubmitComplaint />;
                case 'complaints':
                  return <StaffMyComplaints />;
                case 'complaint-details':
                  return <StaffComplaintDetails complaintId={currentAppPage.detailId} />;
                case 'notifications':
                  return <StaffNotifications />;
                case 'profile':
                  return <StaffProfile />;
                default:
                  return <StaffDashboard />;
              }
            })()}
          </RoleProtectedRoute>
        );

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification Container */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-start gap-3 animate-in slide-in-from-top-2 duration-200 ${
              t.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : t.type === 'error'
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : t.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-300 hover:text-white shrink-0 -mt-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top Navigation */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />

      {/* Main App Body */}
      {isPublic ? (
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            {renderViewContent()}
          </main>
          <Footer />
        </div>
      ) : (
        <div className="flex-1 flex">
          {/* Authenticated Left Navigation */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Dashboard Screen Area */}
          <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {renderViewContent()}
            </main>

            <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
              <p>
                Smart Complaint Management System (SCMS) • Authorized for higher educational campuses across Pakistan
              </p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
