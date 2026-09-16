import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  FilePlus2, 
  FileText, 
  Bell, 
  UserCircle, 
  Building, 
  Users, 
  Network, 
  BarChart3, 
  Settings, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet,
  CheckSquare,
  Wrench,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    currentAppPage, 
    navigate, 
    complaints, 
    registrationRequests, 
    notifications 
  } = useApp();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Compute live badges
  const pendingRequestsCount = registrationRequests.filter((r) => r.status === 'pending').length;
  const urgentComplaintsCount = complaints.filter((c) => c.priority === 'Urgent' && c.status !== 'Closed').length;
  const myStudentComplaintsCount = complaints.filter(
    (c) => c.studentId === currentUser.id || c.studentEmail === currentUser.email || c.userId === currentUser.id
  ).length;
  const myStaffComplaintsCount = complaints.filter((c) => c.assignedStaffId === currentUser.id || c.departmentId === currentUser.departmentId).length;
  const myStaffSubmittedCount = complaints.filter((c) => c.studentId === currentUser.id || c.userId === currentUser.id || c.studentEmail === currentUser.email).length;
  const unreadNotifCount = notifications.filter((n) => !n.read && (!n.userId || n.userId === currentUser.id)).length;

  const getMenuItems = () => {
    switch (role) {
      case 'student':
        return [
          {
            id: 'sidebar-student-dashboard',
            label: 'Student Dashboard',
            icon: LayoutDashboard,
            view: 'student' as const,
            page: 'dashboard'
          },
          {
            id: 'sidebar-student-submit',
            label: 'Submit Complaint',
            icon: FilePlus2,
            view: 'student' as const,
            page: 'submit'
          },
          {
            id: 'sidebar-student-complaints',
            label: 'My Complaints',
            icon: FileText,
            view: 'student' as const,
            page: 'complaints',
            badge: myStudentComplaintsCount > 0 ? myStudentComplaintsCount : undefined
          },
          {
            id: 'sidebar-student-notifications',
            label: 'Notifications',
            icon: Bell,
            view: 'student' as const,
            page: 'notifications',
            badge: unreadNotifCount > 0 ? unreadNotifCount : undefined
          },
          {
            id: 'sidebar-student-profile',
            label: 'Student Profile',
            icon: UserCircle,
            view: 'student' as const,
            page: 'profile'
          }
        ];

      case 'institution_admin':
        return [
          {
            id: 'sidebar-admin-dashboard',
            label: 'Admin Dashboard',
            icon: LayoutDashboard,
            view: 'admin' as const,
            page: 'dashboard'
          },
          {
            id: 'sidebar-admin-complaints',
            label: 'Complaints',
            icon: FileText,
            view: 'admin' as const,
            page: 'complaints',
            badge: urgentComplaintsCount > 0 ? `${urgentComplaintsCount} Urgent` : complaints.length
          },
          {
            id: 'sidebar-admin-users',
            label: 'Users Management',
            icon: Users,
            view: 'admin' as const,
            page: 'users'
          },
          {
            id: 'sidebar-admin-categories',
            label: 'Categories',
            icon: Layers,
            view: 'admin' as const,
            page: 'categories'
          },
          {
            id: 'sidebar-admin-departments',
            label: 'Departments',
            icon: Network,
            view: 'admin' as const,
            page: 'departments'
          },
          {
            id: 'sidebar-admin-staff',
            label: 'Staff Members',
            icon: Wrench,
            view: 'admin' as const,
            page: 'staff'
          },
          {
            id: 'sidebar-admin-reports',
            label: 'Analytics & Reports',
            icon: BarChart3,
            view: 'admin' as const,
            page: 'reports'
          },
          {
            id: 'sidebar-admin-notifications',
            label: 'Notifications',
            icon: Bell,
            view: 'admin' as const,
            page: 'notifications',
            badge: unreadNotifCount > 0 ? unreadNotifCount : undefined
          },
          {
            id: 'sidebar-admin-profile',
            label: 'Admin Profile',
            icon: UserCircle,
            view: 'admin' as const,
            page: 'profile'
          },
          {
            id: 'sidebar-admin-settings',
            label: 'Institution Settings',
            icon: Settings,
            view: 'admin' as const,
            page: 'settings'
          }
        ];

      case 'super_admin':
        return [
          {
            id: 'sidebar-super-dashboard',
            label: 'Super Admin Dashboard',
            icon: LayoutDashboard,
            view: 'superadmin' as const,
            page: 'dashboard'
          },
          {
            id: 'sidebar-super-institutions',
            label: 'Institutions',
            icon: Building,
            view: 'superadmin' as const,
            page: 'institutions'
          },
          {
            id: 'sidebar-super-requests',
            label: 'Registration Requests',
            icon: Clock,
            view: 'superadmin' as const,
            page: 'requests',
            badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Pending` : undefined,
            badgeVariant: 'amber'
          },
          {
            id: 'sidebar-super-complaints',
            label: 'All Complaints',
            icon: FileText,
            view: 'superadmin' as const,
            page: 'complaints'
          },
          {
            id: 'sidebar-super-users',
            label: 'Users Directory',
            icon: Users,
            view: 'superadmin' as const,
            page: 'users'
          },
          {
            id: 'sidebar-super-reports',
            label: 'Platform Reports',
            icon: FileSpreadsheet,
            view: 'superadmin' as const,
            page: 'reports'
          },
          {
            id: 'sidebar-super-settings',
            label: 'Global Settings',
            icon: Settings,
            view: 'superadmin' as const,
            page: 'settings'
          }
        ];

      case 'department_staff':
        return [
          {
            id: 'sidebar-staff-dashboard',
            label: 'Faculty Dashboard',
            icon: LayoutDashboard,
            view: 'staff' as const,
            page: 'dashboard'
          },
          {
            id: 'sidebar-staff-submit',
            label: 'Submit Complaint',
            icon: FilePlus2,
            view: 'staff' as const,
            page: 'submit'
          },
          {
            id: 'sidebar-staff-complaints',
            label: 'My Complaints',
            icon: FileText,
            view: 'staff' as const,
            page: 'complaints',
            badge: myStaffSubmittedCount > 0 ? myStaffSubmittedCount : undefined
          },
          {
            id: 'sidebar-staff-notifications',
            label: 'Notifications',
            icon: Bell,
            view: 'staff' as const,
            page: 'notifications',
            badge: unreadNotifCount > 0 ? unreadNotifCount : undefined
          },
          {
            id: 'sidebar-staff-profile',
            label: 'Faculty Profile',
            icon: UserCircle,
            view: 'staff' as const,
            page: 'profile'
          }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Institutional Context banner */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {role === 'super_admin' ? '🇵🇰' : '🏛️'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {role === 'super_admin'
                  ? 'National HEC Portal'
                  : currentUser.institutionName?.split('(')[0] || 'Institution'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUser.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentAppPage.view === item.view && currentAppPage.page === item.page;

            return (
              <button
                key={item.id}
                id={item.id}
                onClick={() => {
                  navigate(item.view, item.page);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-200' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeVariant === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isActive
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Institution Info / Role status footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Status:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live & Synced
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 truncate">
            SCMS v2.4 • Higher Ed Pakistan
          </div>
        </div>
      </aside>
    </>
  );
};
