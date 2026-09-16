export type UserRole = 'super_admin' | 'institution_admin' | 'department_staff' | 'student';

export type ComplaintCategory = 
  | 'Electricity'
  | 'Water'
  | 'Internet'
  | 'Classroom'
  | 'Laboratory'
  | 'Cleaning'
  | 'Transport'
  | 'Security'
  | 'Furniture'
  | 'Other';

export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type ComplaintStatus = 'Submitted' | 'Pending' | 'Under Review' | 'In Progress' | 'Resolved' | 'Closed' | 'Rejected';

export type InstitutionType = 'university' | 'college' | 'school';

export interface CategoryItem {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  departmentName?: string;
  complaintsCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  departmentId?: string;
  departmentName?: string;
  rollNumber?: string;
  employeeId?: string;
  office?: string;
  joinedDate?: string;
  avatar?: string;
  phone?: string;
  status: 'active' | 'inactive';
}

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  city: string;
  province: string;
  code: string;
  studentsCount: number;
  staffCount: number;
  status: 'active' | 'pending' | 'suspended';
  contactEmail: string;
  phone: string;
  address: string;
  joinedDate: string;
  logo?: string;
}

export interface InstitutionRegistrationRequest {
  id: string;
  institutionName: string;
  type: InstitutionType;
  city: string;
  province: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  website?: string;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  institutionId: string;
  headName: string;
  email: string;
  phone: string;
  staffCount: number;
  activeComplaintsCount: number;
  primaryCategory: ComplaintCategory;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  institutionId: string;
  departmentId: string;
  departmentName: string;
  roleTitle: string;
  activeAssignedCount: number;
  avatar?: string;
}

export interface ComplaintActivityLog {
  id: string;
  timestamp: string;
  authorName: string;
  authorRole: UserRole;
  action: string;
  note?: string;
}

export interface ComplaintTimelineStage {
  stage: ComplaintStatus;
  status: 'completed' | 'current' | 'upcoming';
  timestamp?: string;
  notes?: string;
  actor?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: Priority;
  status: ComplaintStatus;
  location: string;
  studentId: string;
  userId?: string;
  studentName: string;
  studentRollNumber?: string;
  studentEmail?: string;
  institutionId: string;
  institutionName: string;
  departmentId: string;
  departmentName: string;
  assignedDepartment?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  assignedStaff?: string;
  attachmentName?: string;
  attachmentSize?: string;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
  adminResponse?: string;
  timeline?: ComplaintTimelineStage[];
  activityLogs: ComplaintActivityLog[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'status_change' | 'assigned' | 'announcement' | 'urgent';
  read: boolean;
  timestamp: string;
  complaintId?: string;
}

export type PublicPage = 
  | 'home' 
  | 'about' 
  | 'features' 
  | 'how-it-works' 
  | 'contact' 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'verify-email';

export interface StudentRegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  institutionId: string;
  institutionName: string;
  rollNumber: string;
  department: string;
  phone: string;
  agreeTerms: boolean;
}

export type StudentPage = 'dashboard' | 'submit' | 'complaints' | 'complaint-details' | 'notifications' | 'profile';

export type AdminPage = 
  | 'dashboard' 
  | 'complaints' 
  | 'complaint-details' 
  | 'users' 
  | 'categories' 
  | 'notifications' 
  | 'profile' 
  | 'students' 
  | 'departments' 
  | 'staff' 
  | 'reports' 
  | 'settings';

export type SuperAdminPage = 'dashboard' | 'institutions' | 'requests' | 'complaints' | 'complaint-details' | 'users' | 'reports' | 'settings';

export type StaffPage = 'dashboard' | 'submit' | 'complaints' | 'complaint-details' | 'notifications' | 'profile';

export type AppPage = 
  | { view: 'public'; page: PublicPage }
  | { view: 'student'; page: StudentPage; detailId?: string }
  | { view: 'admin'; page: AdminPage; detailId?: string }
  | { view: 'superadmin'; page: SuperAdminPage; detailId?: string }
  | { view: 'staff'; page: StaffPage; detailId?: string };
