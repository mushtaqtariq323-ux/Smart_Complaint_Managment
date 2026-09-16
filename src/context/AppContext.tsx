import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  Complaint, 
  ComplaintStatus, 
  Institution, 
  InstitutionRegistrationRequest, 
  Department, 
  Staff, 
  Notification,
  AppPage,
  CategoryItem
} from '../types';
import { 
  DEMO_USERS, 
  INITIAL_COMPLAINTS, 
  INITIAL_INSTITUTIONS, 
  INITIAL_REQUESTS, 
  INITIAL_DEPARTMENTS, 
  INITIAL_STAFF, 
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_CATEGORIES
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { buildComplaintTimeline } from '../utils/complaintUtils';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  activeRole: UserRole | 'guest';
  currentAppPage: AppPage;
  complaints: Complaint[];
  users: User[];
  categories: CategoryItem[];
  institutions: Institution[];
  registrationRequests: InstitutionRegistrationRequest[];
  institutionRequests: InstitutionRegistrationRequest[];
  departments: Department[];
  staffList: Staff[];
  staff: Staff[];
  notifications: Notification[];
  toasts: ToastItem[];
  
  // Navigation & Role actions
  navigate: (view: AppPage['view'], page: any, detailId?: string) => void;
  switchRole: (role: UserRole) => void;
  loginAsUser: (role: UserRole) => void;
  logoutToPublic: () => void;
  
  // Complaint actions
  submitComplaint: (data: Partial<Complaint>) => Complaint;
  updateComplaintStatus: (id: string, newStatus: ComplaintStatus, resolutionNote?: string) => void;
  assignStaff: (complaintId: string, staffId: string, staffName: string) => void;
  assignComplaint: (complaintId: string, departmentId: string, departmentName: string, staffId?: string, staffName?: string, notes?: string) => void;
  addActivityComment: (complaintId: string, comment: string) => void;
  
  // User Management
  toggleUserStatus: (userId: string) => void;
  updateUserProfileAdmin: (updates: Partial<User>) => void;

  // Category Management
  addCategory: (cat: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<CategoryItem>) => void;
  toggleCategoryStatus: (id: string) => void;

  // Institution & Admin actions
  submitInstitutionRequest: (req: Omit<InstitutionRegistrationRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveInstitutionRequest: (id: string) => void;
  rejectInstitutionRequest: (id: string, reason?: string) => void;
  addInstitution: (inst: any) => void;
  toggleInstitutionStatus: (id: string) => void;
  addDepartment: (dept: Omit<Department, 'id' | 'activeComplaintsCount'>) => void;
  addStaffMember: (staff: Omit<Staff, 'id' | 'activeAssignedCount'>) => void;
  addStaff: (staff: Omit<Staff, 'id' | 'activeAssignedCount'>) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Toasts
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loginWithDemoRole, logout } = useAuth();
  
  const [currentAppPage, setCurrentAppPage] = useState<AppPage>({
    view: 'student',
    page: 'dashboard'
  });

  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [registrationRequests, setRegistrationRequests] = useState<InstitutionRegistrationRequest[]>(INITIAL_REQUESTS);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigate = (view: AppPage['view'], page: any, detailId?: string) => {
    setCurrentAppPage({ view, page, detailId } as AppPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchRole = async (role: UserRole) => {
    await loginWithDemoRole(role);

    if (role === 'student') {
      navigate('student', 'dashboard');
    } else if (role === 'institution_admin') {
      navigate('admin', 'dashboard');
    } else if (role === 'super_admin') {
      navigate('superadmin', 'dashboard');
    } else if (role === 'department_staff') {
      navigate('staff', 'dashboard');
    }

    const targetUser = DEMO_USERS[role];
    showToast(`Switched persona to ${targetUser.name} (${role.replace('_', ' ').toUpperCase()})`, 'info');
  };

  const loginAsUser = (role: UserRole) => {
    switchRole(role);
  };

  const logoutToPublic = async () => {
    await logout();
    navigate('public', 'home');
    showToast('Logged out to Public Portal', 'info');
  };

  const submitComplaint = (data: Partial<Complaint>): Complaint => {
    const currentComplainant = currentUser || DEMO_USERS.student;
    const userInDb = users.find((u) => u.id === currentComplainant.id) || currentComplainant;
    
    if (userInDb.status === 'inactive') {
      showToast('Your account is currently deactivated by the administration. You cannot submit complaints.', 'error');
      throw new Error('Account deactivated by administration');
    }

    const nextNum = complaints.length + 1 + 820;
    const newId = `CMP-2026-0${nextNum}`;
    const timestamp = new Date().toISOString();

    const isStaff = currentComplainant.role === 'department_staff';
    
    // Find department if matched or specified
    const matchedDept = departments.find((d) => d.id === data.departmentId || d.name === data.departmentName || d.primaryCategory === data.category) 
      || departments[0];

    const newComplaint: Complaint = {
      id: newId,
      title: data.title || 'Untitled Issue',
      description: data.description || '',
      category: data.category || 'Other',
      priority: data.priority || 'Medium',
      status: 'Submitted',
      location: data.location || (isStaff ? `${currentComplainant.departmentName || 'Faculty'} Block / Office` : 'Campus Main Block'),
      studentId: currentComplainant.id,
      userId: currentComplainant.id,
      studentName: currentComplainant.name,
      studentRollNumber: currentComplainant.rollNumber || (isStaff ? 'EMP-FACULTY' : '2023-CS-184'),
      studentEmail: currentComplainant.email,
      institutionId: currentComplainant.institutionId || 'inst-1',
      institutionName: currentComplainant.institutionName || 'National University of Sciences & Technology (NUST)',
      departmentId: matchedDept.id,
      departmentName: matchedDept.name,
      assignedDepartment: matchedDept.name,
      assignedStaff: undefined,
      adminResponse: undefined,
      attachmentName: data.attachmentName,
      attachmentSize: data.attachmentSize,
      attachmentUrl: data.attachmentUrl || (data.attachmentName ? '/mock-attachment.png' : undefined),
      createdAt: timestamp,
      updatedAt: timestamp,
      activityLogs: [
        {
          id: 'log-' + Math.random().toString(36).substring(2, 7),
          timestamp,
          authorName: currentComplainant.name,
          authorRole: currentComplainant.role,
          action: 'Complaint Submitted',
          note: isStaff ? 'Complaint registered by Faculty/Staff member.' : 'Logged via Smart Complaint Management Portal.'
        }
      ]
    };

    newComplaint.timeline = buildComplaintTimeline(newComplaint);

    setComplaints((prev) => [newComplaint, ...prev]);

    // Create notifications for Institution Admin and Student/Staff
    const newNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substring(2, 7),
      userId: currentComplainant.id,
      title: `Complaint Submitted: ${newComplaint.id}`,
      message: `Your complaint "${newComplaint.title}" has been registered and routed to ${matchedDept.name}.`,
      type: 'status_change',
      read: false,
      timestamp,
      complaintId: newComplaint.id
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Complaint ${newComplaint.id} submitted successfully!`, 'success');
    return newComplaint;
  };

  const updateComplaintStatus = (id: string, newStatus: ComplaintStatus, resolutionNote?: string) => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'System Administrator';
    const actorRole = currentUser?.role || 'institution_admin';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updatedLogs = [
          ...c.activityLogs,
          {
            id: 'log-' + Math.random().toString(36).substring(2, 7),
            timestamp,
            authorName: actorName,
            authorRole: actorRole,
            action: `Status changed to ${newStatus}`,
            note: resolutionNote || undefined
          }
        ];

        const updatedItem: Complaint = {
          ...c,
          status: newStatus,
          updatedAt: timestamp,
          resolutionNotes: resolutionNote || c.resolutionNotes,
          adminResponse: resolutionNote || c.adminResponse || c.resolutionNotes,
          activityLogs: updatedLogs
        };
        updatedItem.timeline = buildComplaintTimeline(updatedItem);
        return updatedItem;
      })
    );

    // Notify the student
    const targetComplaint = complaints.find((c) => c.id === id);
    if (targetComplaint) {
      const notif: Notification = {
        id: 'notif-' + Math.random().toString(36).substring(2, 7),
        userId: targetComplaint.studentId,
        title: `Complaint ${id} Updated`,
        message: `Status updated to "${newStatus}" by ${actorName}.${resolutionNote ? ` Note: ${resolutionNote}` : ''}`,
        type: 'status_change',
        read: false,
        timestamp,
        complaintId: id
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast(`Complaint ${id} marked as "${newStatus}"`, 'success');
  };

  const assignStaff = (complaintId: string, staffId: string, staffName: string) => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Institution Administrator';
    const actorRole = currentUser?.role || 'institution_admin';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const updatedItem: Complaint = {
          ...c,
          assignedStaffId: staffId,
          assignedStaffName: staffName,
          assignedStaff: staffName,
          status: c.status === 'Submitted' || c.status === 'Pending' ? 'In Progress' : c.status,
          updatedAt: timestamp,
          activityLogs: [
            ...c.activityLogs,
            {
              id: 'log-' + Math.random().toString(36).substring(2, 7),
              timestamp,
              authorName: actorName,
              authorRole: actorRole,
              action: `Assigned to ${staffName}`,
              note: `Department staff ${staffName} assigned to handle investigation and remediation.`
            }
          ]
        };
        updatedItem.timeline = buildComplaintTimeline(updatedItem);
        return updatedItem;
      })
    );

    // Update staff active count
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, activeAssignedCount: s.activeAssignedCount + 1 } : s))
    );

    // Add notification to assigned staff
    const staffNotif: Notification = {
      id: 'notif-' + Math.random().toString(36).substring(2, 7),
      userId: staffId,
      title: `Assigned to Complaint ${complaintId}`,
      message: `You were assigned complaint ${complaintId} by ${actorName}.`,
      type: 'assigned',
      read: false,
      timestamp,
      complaintId
    };
    setNotifications((prev) => [staffNotif, ...prev]);

    showToast(`Assigned ${staffName} to ${complaintId}`, 'success');
  };

  const assignComplaint = (
    complaintId: string, 
    departmentId: string, 
    departmentName: string, 
    staffId?: string, 
    staffName?: string, 
    notes?: string
  ) => {
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'Institution Administrator';
    const actorRole = currentUser?.role || 'institution_admin';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const updatedItem: Complaint = {
          ...c,
          departmentId,
          departmentName,
          assignedDepartment: departmentName,
          assignedStaffId: staffId || c.assignedStaffId,
          assignedStaffName: staffName || c.assignedStaffName,
          assignedStaff: staffName || c.assignedStaff,
          status: c.status === 'Submitted' || c.status === 'Pending' ? 'In Progress' : c.status,
          updatedAt: timestamp,
          activityLogs: [
            ...c.activityLogs,
            {
              id: 'log-' + Math.random().toString(36).substring(2, 7),
              timestamp,
              authorName: actorName,
              authorRole: actorRole,
              action: staffName ? `Assigned to ${staffName} (${departmentName})` : `Routed to ${departmentName}`,
              note: notes || (staffName ? `Dispatched for investigative remediation.` : `Department routing updated.`)
            }
          ]
        };
        updatedItem.timeline = buildComplaintTimeline(updatedItem);
        return updatedItem;
      })
    );

    if (staffId && staffName) {
      setStaffList((prev) =>
        prev.map((s) => (s.id === staffId ? { ...s, activeAssignedCount: s.activeAssignedCount + 1 } : s))
      );

      const staffNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substring(2, 7),
        userId: staffId,
        title: `Assigned Ticket: ${complaintId}`,
        message: `You were assigned ticket ${complaintId} by ${actorName}.${notes ? ` Instructions: ${notes}` : ''}`,
        type: 'assigned',
        read: false,
        timestamp,
        complaintId
      };
      setNotifications((prev) => [staffNotif, ...prev]);
    }

    // Notify submitter as well
    const target = complaints.find((c) => c.id === complaintId);
    if (target) {
      const userNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substring(2, 7),
        userId: target.studentId,
        title: `Complaint ${complaintId} Assigned`,
        message: `Your complaint has been assigned to ${staffName ? `${staffName} (${departmentName})` : departmentName}.`,
        type: 'assigned',
        read: false,
        timestamp,
        complaintId
      };
      setNotifications((prev) => [userNotif, ...prev]);
    }

    showToast(staffName ? `Assigned ${staffName} to ${complaintId}` : `Routed to ${departmentName}`, 'success');
  };

  // User Management
  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        showToast(`User "${u.name}" account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`, newStatus === 'active' ? 'success' : 'info');
        return { ...u, status: newStatus };
      })
    );
  };

  const updateUserProfileAdmin = (updates: Partial<User>) => {
    if (!currentUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
    );
    showToast('Admin profile details updated successfully.', 'success');
  };

  // Category Management
  const addCategory = (cat: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...cat,
      id: 'cat-' + Math.random().toString(36).substring(2, 7),
      enabled: cat.enabled !== undefined ? cat.enabled : true,
      complaintsCount: 0
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Category "${newCat.name}" added successfully.`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Category updated successfully.', 'success');
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newStatus = !c.enabled;
        showToast(`Category "${c.name}" ${newStatus ? 'enabled' : 'disabled'}.`, 'info');
        return { ...c, enabled: newStatus };
      })
    );
  };

  const addActivityComment = (complaintId: string, comment: string) => {
    if (!comment.trim()) return;
    const timestamp = new Date().toISOString();
    const actorName = currentUser?.name || 'User';
    const actorRole = currentUser?.role || 'student';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        return {
          ...c,
          updatedAt: timestamp,
          activityLogs: [
            ...c.activityLogs,
            {
              id: 'log-' + Math.random().toString(36).substring(2, 7),
              timestamp,
              authorName: actorName,
              authorRole: actorRole,
              action: 'Note Added',
              note: comment.trim()
            }
          ]
        };
      })
    );

    showToast('Activity note posted', 'info');
  };

  const submitInstitutionRequest = (req: Omit<InstitutionRegistrationRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: InstitutionRegistrationRequest = {
      ...req,
      id: 'req-' + Math.random().toString(36).substring(2, 7),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setRegistrationRequests((prev) => [newReq, ...prev]);
    showToast(`Registration request submitted for ${req.institutionName}! HEC Super Admin will review within 24-48 hours.`, 'success');
  };

  const approveInstitutionRequest = (id: string) => {
    const target = registrationRequests.find((r) => r.id === id);
    if (!target) return;

    // Create institution
    const newInst: Institution = {
      id: 'inst-' + Math.random().toString(36).substring(2, 7),
      name: target.institutionName,
      type: target.type,
      city: target.city,
      province: target.province,
      code: target.institutionName.split(' ').map((w) => w[0]).join('').substring(0, 6).toUpperCase(),
      studentsCount: 1500,
      staffCount: 120,
      status: 'active',
      contactEmail: target.adminEmail,
      phone: target.adminPhone,
      address: `${target.city}, ${target.province}`,
      joinedDate: new Date().toISOString().split('T')[0],
      logo: target.type === 'university' ? '🏛️' : target.type === 'college' ? '🏫' : '📚'
    };

    setInstitutions((prev) => [newInst, ...prev]);
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
    );

    showToast(`Approved ${target.institutionName} as verified institution!`, 'success');
  };

  const rejectInstitutionRequest = (id: string, reason?: string) => {
    setRegistrationRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected', notes: reason || 'Application criteria incomplete.' } : r))
    );
    showToast(`Application rejected`, 'info');
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'activeComplaintsCount'>) => {
    const newDept: Department = {
      ...dept,
      id: 'dept-' + Math.random().toString(36).substring(2, 7),
      activeComplaintsCount: 0
    };
    setDepartments((prev) => [...prev, newDept]);
    showToast(`Department "${newDept.name}" created`, 'success');
  };

  const addStaffMember = (staff: Omit<Staff, 'id' | 'activeAssignedCount'>) => {
    const newStaff: Staff = {
      ...staff,
      id: 'staff-' + Math.random().toString(36).substring(2, 7),
      activeAssignedCount: 0
    };
    setStaffList((prev) => [...prev, newStaff]);
    showToast(`Staff member "${newStaff.name}" added to ${newStaff.departmentName}`, 'success');
  };

  const addInstitution = (inst: any) => {
    const newInst: Institution = {
      id: 'inst-' + Math.random().toString(36).substring(2, 7),
      name: inst.name,
      type: inst.type || 'university',
      city: inst.city,
      province: inst.province,
      code: inst.name.split(' ').map((w: string) => w[0]).join('').substring(0, 6).toUpperCase(),
      studentsCount: 1200,
      staffCount: 80,
      status: 'active',
      contactEmail: inst.adminEmail || inst.contactEmail,
      phone: inst.adminPhone || inst.phone,
      address: `${inst.city}, ${inst.province}`,
      joinedDate: new Date().toISOString().split('T')[0],
      logo: inst.type === 'university' ? '🏛️' : '🏫'
    };
    setInstitutions((prev) => [newInst, ...prev]);
    showToast(`Institution "${inst.name}" onboarded successfully!`, 'success');
  };

  const toggleInstitutionStatus = (id: string) => {
    setInstitutions((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const newStatus = i.status === 'active' ? 'suspended' : 'active';
        showToast(`Campus status set to ${newStatus}`, 'info');
        return { ...i, status: newStatus };
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        activeRole: currentUser ? currentUser.role : 'guest',
        currentAppPage,
        complaints,
        users,
        categories,
        institutions,
        registrationRequests,
        institutionRequests: registrationRequests,
        departments,
        staffList,
        staff: staffList,
        notifications,
        toasts,
        navigate,
        switchRole,
        loginAsUser,
        logoutToPublic,
        submitComplaint,
        updateComplaintStatus,
        assignStaff,
        assignComplaint,
        addActivityComment,
        toggleUserStatus,
        updateUserProfileAdmin,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        submitInstitutionRequest,
        approveInstitutionRequest,
        rejectInstitutionRequest,
        addInstitution,
        toggleInstitutionStatus,
        addDepartment,
        addStaffMember,
        addStaff: addStaffMember,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        showToast,
        dismissToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
