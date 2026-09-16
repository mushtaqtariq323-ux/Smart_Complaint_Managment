import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  UserCheck, 
  UserX, 
  Eye, 
  Mail, 
  Phone, 
  Building, 
  FileText, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';

export const AdminUsers: React.FC = () => {
  const { 
    currentUser, 
    users, 
    complaints, 
    toggleUserStatus, 
    navigate 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'staff'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Selected user for details modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter for current institution
  const instUsers = users.filter(
    (u) => !currentUser?.institutionId || u.institutionId === currentUser.institutionId
  );

  const totalUsers = instUsers.length;
  const totalStudents = instUsers.filter((u) => u.role === 'student').length;
  const totalStaff = instUsers.filter((u) => u.role === 'department_staff').length;
  const activeCount = instUsers.filter((u) => u.status === 'active').length;
  const inactiveCount = instUsers.filter((u) => u.status === 'inactive').length;

  // Filter users list
  const filteredUsers = useMemo(() => {
    return instUsers.filter((u) => {
      // Tab filter
      if (activeTab === 'student' && u.role !== 'student') return false;
      if (activeTab === 'staff' && u.role !== 'department_staff') return false;

      // Status filter
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      // Search term filter
      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(s);
        const matchesEmail = u.email.toLowerCase().includes(s);
        const matchesDept = (u.departmentName || '').toLowerCase().includes(s);
        const matchesRoll = (u.rollNumber || '').toLowerCase().includes(s);
        const matchesEmp = (u.employeeId || '').toLowerCase().includes(s);
        if (!matchesName && !matchesEmail && !matchesDept && !matchesRoll && !matchesEmp) {
          return false;
        }
      }

      return true;
    });
  }, [instUsers, activeTab, statusFilter, searchTerm]);

  // Count complaints submitted by user
  const getUserComplaintsCount = (userId: string) => {
    return complaints.filter((c) => c.studentId === userId || c.userId === userId).length;
  };

  // Get user complaints list
  const getUserComplaints = (userId: string) => {
    return complaints.filter((c) => c.studentId === userId || c.userId === userId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus User Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {filteredUsers.length} Users
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supervise enrolled students, academic faculty, departmental staff accounts, and access authorization.
          </p>
        </div>

        <button
          onClick={() => navigate('admin', 'dashboard')}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs self-start sm:self-auto transition-colors"
        >
          Return to Dashboard
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Enrolled</span>
          <p className="text-xl font-black text-slate-900 mt-1">{totalUsers}</p>
          <span className="text-[11px] text-slate-500">All directory accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 bg-blue-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Students</span>
          <p className="text-xl font-black text-blue-900 mt-1">{totalStudents}</p>
          <span className="text-[11px] text-blue-600 font-medium">Undergrad & Postgrad</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200/80 bg-indigo-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">Faculty & Staff</span>
          <p className="text-xl font-black text-indigo-900 mt-1">{totalStaff}</p>
          <span className="text-[11px] text-indigo-600 font-medium">Dept & Operations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Active</span>
          <p className="text-xl font-black text-emerald-800 mt-1">{activeCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Full complaint access</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 bg-rose-50/20 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">Deactivated</span>
          <p className="text-xl font-black text-rose-800 mt-1">{inactiveCount}</p>
          <span className="text-[11px] text-rose-600 font-medium">Access blocked</span>
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            <button
              id="admin-users-tab-all"
              onClick={() => setActiveTab('all')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Users ({totalUsers})
            </button>
            <button
              id="admin-users-tab-students"
              onClick={() => setActiveTab('student')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'student' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Students ({totalStudents})
            </button>
            <button
              id="admin-users-tab-staff"
              onClick={() => setActiveTab('staff')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'staff' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Faculty / Staff ({totalStaff})
            </button>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Account Status:</span>
            <select
              id="admin-users-filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="inactive">Inactive / Deactivated</option>
            </select>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="admin-users-search-input"
            type="text"
            placeholder="Search by user name, official email, department, roll number, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-700 text-sm">No campus users match current filters</p>
            <p className="text-xs text-slate-400">Try modifying your search query or switching active tabs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department & Roll / Emp ID</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4 text-center">Complaints</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isStaff = u.role === 'department_staff';
                  const complaintsCount = getUserComplaintsCount(u.id);
                  const identifier = u.employeeId || u.rollNumber || 'N/A';

                  return (
                    <tr 
                      key={u.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isStaff ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="font-bold text-slate-900 hover:text-emerald-700 text-left group-hover:underline text-xs"
                            >
                              {u.name}
                            </button>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isStaff 
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200' 
                            : 'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}>
                          {isStaff ? <Briefcase className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                          <span>{isStaff ? 'Faculty / Staff' : 'Student'}</span>
                        </span>
                      </td>

                      {/* Department & ID */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                          {u.departmentName || 'General Campus'}
                        </p>
                        <span className="text-[10px] font-mono text-slate-400">
                          {isStaff ? `Emp: ${identifier}` : `Roll: ${identifier}`}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <p className="text-slate-700 truncate max-w-[170px] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.email}</span>
                        </p>
                        {u.phone && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{u.phone}</span>
                          </p>
                        )}
                      </td>

                      {/* Complaints Count */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {complaintsCount}
                        </span>
                      </td>

                      {/* Account Status Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {u.status === 'active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            id={`admin-user-view-${u.id}`}
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-[11px] font-semibold flex items-center gap-1"
                            title="View Full Profile & Submitted Complaints"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Details</span>
                          </button>

                          <button
                            id={`admin-user-toggle-${u.id}`}
                            onClick={() => toggleUserStatus(u.id)}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                              u.status === 'active'
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                            title={u.status === 'active' ? 'Deactivate User Account' : 'Activate User Account'}
                          >
                            {u.status === 'active' ? (
                              <>
                                <UserX className="w-3 h-3" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3 h-3" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title="User Account & History Profile"
        >
          <div className="space-y-6">
            {/* Header Identity Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base ${
                  selectedUser.role === 'department_staff' ? 'bg-indigo-600 text-white' : 'bg-emerald-700 text-white'
                }`}>
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold uppercase ${
                      selectedUser.role === 'department_staff' 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {selectedUser.role === 'department_staff' ? 'Faculty/Staff' : 'Student'}
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-600">{selectedUser.departmentName}</span>
                  </div>
                </div>
              </div>

              {/* Status & Toggle */}
              <div className="text-right shrink-0">
                <div className="mb-2">
                  {selectedUser.status === 'active' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      Inactive
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    toggleUserStatus(selectedUser.id);
                    setSelectedUser({
                      ...selectedUser,
                      status: selectedUser.status === 'active' ? 'inactive' : 'active'
                    });
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>
            </div>

            {/* Profile Field Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {selectedUser.role === 'department_staff' ? 'Employee Code' : 'Student Roll Number'}
                </span>
                <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                  {selectedUser.employeeId || selectedUser.rollNumber || 'N/A'}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Enrolled Institution</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">
                  {selectedUser.institutionName || 'National University of Sciences & Technology'}
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Email Address</span>
                <span className="font-medium text-slate-800 truncate block mt-0.5">{selectedUser.email}</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Phone Contact</span>
                <span className="font-medium text-slate-800 block mt-0.5">{selectedUser.phone || 'N/A'}</span>
              </div>

              {selectedUser.office && (
                <div className="p-3 rounded-xl border border-slate-200 bg-white col-span-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Assigned Campus Office</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{selectedUser.office}</span>
                </div>
              )}
            </div>

            {/* User Complaints History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Complaints History ({getUserComplaints(selectedUser.id).length})
                </h4>
                <span className="text-[11px] text-slate-400">Tickets submitted by user</span>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden max-h-56 overflow-y-auto">
                {getUserComplaints(selectedUser.id).length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    This user has not submitted any complaints yet.
                  </div>
                ) : (
                  getUserComplaints(selectedUser.id).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedUser(null);
                        navigate('admin', 'complaint-details', c.id);
                      }}
                      className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-800">{c.id}</span>
                          <StatusBadge status={c.status} size="sm" />
                          <PriorityBadge priority={c.priority} size="sm" />
                        </div>
                        <p className="font-bold text-slate-900 truncate max-w-sm">{c.title}</p>
                      </div>

                      <span className="text-[11px] text-emerald-700 font-semibold hover:underline shrink-0">
                        View Ticket →
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
