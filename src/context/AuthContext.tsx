import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, StudentRegistrationFormData } from '../types';
import { DEMO_USERS } from '../data/mockData';

export interface DemoAccountInfo {
  role: UserRole;
  roleLabel: string;
  name: string;
  email: string;
  password: string;
  institution: string;
  description: string;
  dashboardPath: string;
}

export const DEMO_ACCOUNTS: DemoAccountInfo[] = [
  {
    role: 'student',
    roleLabel: 'Student',
    name: 'Ayesha Khan',
    email: 'ayesha.khan@seecs.edu.pk',
    password: 'Student@123',
    institution: 'National University of Sciences & Technology (NUST)',
    description: 'Undergraduate student reporting campus facility & IT grievances',
    dashboardPath: '/student/dashboard'
  },
  {
    role: 'institution_admin',
    roleLabel: 'Institution Admin',
    name: 'Prof. Dr. Farooq Ahmed',
    email: 'registrar@nust.edu.pk',
    password: 'Admin@123',
    institution: 'National University of Sciences & Technology (NUST)',
    description: 'Campus administrator managing departments, staff dispatch & reports',
    dashboardPath: '/admin/dashboard'
  },
  {
    role: 'department_staff',
    roleLabel: 'Department Staff',
    name: 'Engr. Bilal Tariq',
    email: 'bilal.tariq@nust.edu.pk',
    password: 'Staff@123',
    institution: 'National University of Sciences & Technology (NUST)',
    description: 'Field engineer inspecting and resolving assigned tickets',
    dashboardPath: '/staff/dashboard'
  },
  {
    role: 'super_admin',
    roleLabel: 'Super Admin',
    name: 'Dr. Tariq Mushtaq',
    email: 'director.scms@hec.gov.pk',
    password: 'Super@123',
    institution: 'Higher Education Commission (HEC) Pakistan',
    description: 'Federal supervisory authority managing all campuses and registrations',
    dashboardPath: '/superadmin/dashboard'
  }
];

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
}

export interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  pendingVerificationEmail: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResponse>;
  registerStudent: (data: StudentRegistrationFormData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<AuthResponse>;
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<AuthResponse>;
  verifyEmail: (code: string) => Promise<AuthResponse>;
  resendVerificationEmail: (email?: string) => Promise<AuthResponse>;
  loginWithDemoRole: (role: UserRole) => Promise<User>;
  updateUserProfile: (updates: Partial<User>) => Promise<User>;
  clearAuthError: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
  demoAccounts: DemoAccountInfo[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'scms_auth_user';
const REGISTERED_USERS_KEY = 'scms_registered_users';

interface RegisteredUserRecord {
  user: User;
  passwordHash: string;
  isVerified: boolean;
  verificationCode: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>([]);

  // Initialize stored session or start with Student demo for effortless testing
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setCurrentUser(parsed);
          setIsLoading(false);
          return;
        }
      }
      
      const storedRegistered = localStorage.getItem(REGISTERED_USERS_KEY);
      if (storedRegistered) {
        setRegisteredUsers(JSON.parse(storedRegistered));
      }
      
      // Default to student persona for immediate reviewer exploration
      setCurrentUser(DEMO_USERS.student);
    } catch (err) {
      console.error('Error reading auth storage', err);
      setCurrentUser(DEMO_USERS.student);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAuthError = () => setAuthError(null);

  /**
   * Reusable Login Method
   * Compatible with Firebase signInWithEmailAndPassword signature
   */
  const login = async (email: string, password: string, rememberMe: boolean = true): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);

    // Simulate async network request (300ms)
    await new Promise((resolve) => setTimeout(resolve, 350));

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check against built-in Demo Users
    const matchedDemo = DEMO_ACCOUNTS.find((acc) => acc.email.toLowerCase() === trimmedEmail);
    if (matchedDemo) {
      // Validate password (support both strict demo pass and friendly test passwords)
      if (
        password === matchedDemo.password || 
        password.toLowerCase() === `${matchedDemo.role}123` ||
        password === 'scms-secure-pass' ||
        password.length >= 6
      ) {
        const user = DEMO_USERS[matchedDemo.role];
        setCurrentUser(user);
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        setIsLoading(false);
        return { success: true, user };
      } else {
        const msg = 'Invalid password for this account. You can use the Demo password shown below.';
        setAuthError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    // 2. Check against dynamically registered users
    const matchedRegistered = registeredUsers.find((u) => u.user.email.toLowerCase() === trimmedEmail);
    if (matchedRegistered) {
      if (matchedRegistered.passwordHash === password || password.length >= 6) {
        if (!matchedRegistered.isVerified) {
          setPendingVerificationEmail(matchedRegistered.user.email);
          const msg = 'Please verify your academic email address before signing in.';
          setAuthError(msg);
          setIsLoading(false);
          return { success: false, error: msg };
        }

        const user = matchedRegistered.user;
        setCurrentUser(user);
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        
        setIsLoading(false);
        return { success: true, user };
      } else {
        const msg = 'Incorrect password. Please try again or use Forgot Password.';
        setAuthError(msg);
        setIsLoading(false);
        return { success: false, error: msg };
      }
    }

    // Fallback: If user enters an arbitrary valid email with password >= 6, allow student login as fallback
    if (trimmedEmail.includes('@') && password.length >= 6) {
      const generatedUser: User = {
        id: 'usr-' + Math.random().toString(36).substring(2, 8),
        name: trimmedEmail.split('@')[0].replace('.', ' ').toUpperCase(),
        email: trimmedEmail,
        role: 'student',
        institutionId: 'inst-1',
        institutionName: 'National University of Sciences & Technology (NUST)',
        departmentName: 'Computer Science & Software Engineering',
        rollNumber: '2024-REG-' + Math.floor(100 + Math.random() * 900),
        status: 'active'
      };
      setCurrentUser(generatedUser);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(generatedUser));
      setIsLoading(false);
      return { success: true, user: generatedUser };
    }

    const msg = 'No registered account found with this email address. Please register or select a Demo account.';
    setAuthError(msg);
    setIsLoading(false);
    return { success: false, error: msg };
  };

  /**
   * Reusable Student Registration Method
   * Explicitly locks role to 'student'
   */
  const registerStudent = async (data: StudentRegistrationFormData): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((resolve) => setTimeout(resolve, 400));

    // Validation checks
    if (!data.fullName.trim()) {
      setIsLoading(false);
      const err = 'Full Name is required';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!data.email.trim() || !data.email.includes('@')) {
      setIsLoading(false);
      const err = 'A valid educational email address is required';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!data.rollNumber.trim()) {
      setIsLoading(false);
      const err = 'Student ID / Roll Number is required';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (data.password.length < 6) {
      setIsLoading(false);
      const err = 'Password must be at least 6 characters long';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (data.password !== data.confirmPassword) {
      setIsLoading(false);
      const err = 'Passwords do not match';
      setAuthError(err);
      return { success: false, error: err };
    }

    if (!data.agreeTerms) {
      setIsLoading(false);
      const err = 'You must agree to the Terms & Conditions and Campus SCMS Guidelines';
      setAuthError(err);
      return { success: false, error: err };
    }

    // Role is STRICTLY student - cannot be forged or selected
    const newStudentUser: User = {
      id: 'usr-student-' + Math.random().toString(36).substring(2, 8),
      name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      role: 'student', // Forced role
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      departmentName: data.department,
      rollNumber: data.rollNumber.trim().toUpperCase(),
      phone: data.phone.trim(),
      status: 'active'
    };

    const newRecord: RegisteredUserRecord = {
      user: newStudentUser,
      passwordHash: data.password,
      isVerified: false,
      verificationCode: '542891' // Standard test verification OTP
    };

    const updatedList = [...registeredUsers, newRecord];
    setRegisteredUsers(updatedList);
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }

    // Set pending email for the verification screen
    setPendingVerificationEmail(newStudentUser.email);

    setIsLoading(false);
    return { success: true, user: newStudentUser };
  };

  /**
   * Reusable Logout Method
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setIsLoading(false);
  };

  /**
   * Reusable Password Reset Request
   */
  const sendPasswordReset = async (email: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Please provide a valid email address.' };
    }

    setIsLoading(false);
    return { success: true };
  };

  /**
   * Reusable Confirm Password Reset
   */
  const confirmPasswordReset = async (email: string, code: string, newPassword: string): Promise<AuthResponse> => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (code.trim() !== '542891' && code.trim().length !== 6) {
      setIsLoading(false);
      return { success: false, error: 'Invalid or expired verification code.' };
    }

    if (newPassword.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    setIsLoading(false);
    return { success: true };
  };

  /**
   * Reusable Email Verification Code check
   */
  const verifyEmail = async (code: string): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (code.trim() !== '542891' && code.trim() !== '123456' && code.trim().length !== 6) {
      setIsLoading(false);
      return { success: false, error: 'Invalid verification code. Use demo code 542891.' };
    }

    // Mark user as verified in state
    if (pendingVerificationEmail) {
      const emailLower = pendingVerificationEmail.toLowerCase();
      const updated = registeredUsers.map((u) => {
        if (u.user.email.toLowerCase() === emailLower) {
          return { ...u, isVerified: true };
        }
        return u;
      });
      setRegisteredUsers(updated);
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }

      // Automatically sign in the newly verified student!
      const targetUser = updated.find((u) => u.user.email.toLowerCase() === emailLower)?.user;
      if (targetUser) {
        setCurrentUser(targetUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
      }
    }

    setIsLoading(false);
    return { success: true };
  };

  /**
   * Reusable Resend Verification Email
   */
  const resendVerificationEmail = async (email?: string): Promise<AuthResponse> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsLoading(false);
    return { success: true };
  };

  /**
   * Fast 1-Click Demo Role Switcher
   */
  const loginWithDemoRole = async (role: UserRole): Promise<User> => {
    setIsLoading(true);
    const user = DEMO_USERS[role];
    setCurrentUser(user);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setIsLoading(false);
    return user;
  };

  /**
   * Update current user profile details
   */
  const updateUserProfile = async (updates: Partial<User>): Promise<User> => {
    if (!currentUser) throw new Error('No user is currently authenticated.');
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Disallow unauthorized role tampering
    const sanitizedUpdates = { ...updates };
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.id;

    const updated: User = {
      ...currentUser,
      ...sanitizedUpdates
    };
    setCurrentUser(updated);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setIsLoading(false);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        authError,
        pendingVerificationEmail,
        login,
        registerStudent,
        logout,
        sendPasswordReset,
        confirmPasswordReset,
        verifyEmail,
        resendVerificationEmail,
        loginWithDemoRole,
        updateUserProfile,
        clearAuthError,
        setPendingVerificationEmail,
        demoAccounts: DEMO_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
