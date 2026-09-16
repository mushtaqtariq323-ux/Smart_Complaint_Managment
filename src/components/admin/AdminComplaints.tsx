import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus, Priority } from '../../types';
import { 
  FileText, 
  Search, 
  Filter, 
  UserCheck, 
  CheckSquare, 
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  User,
  GraduationCap,
  Briefcase,
  Building,
  Clock,
  Layers,
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const AdminComplaints: React.FC = () => {
  const { 
    currentUser, 
    complaints, 
    users,
    departments, 
    staffList, 
    categories,
    navigate, 
    assignComplaint, 
    updateComplaintStatus 
  } = useApp();

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'priority_desc' | 'title_asc'>('date_desc');

  // Fast Assign modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetComplaintId, setTargetComplaintId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [assignNotes, setAssignNotes] = useState('');

  // Status update modal state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [resolutionNote, setResolutionNote] = useState('');

  // Institution complaints
  const instComplaints = complaints.filter(
    (c) => !currentUser?.institutionId || c.institutionId === currentUser.institutionId
  );

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    return instComplaints
      .filter((c) => {
        // Search matches: Title, Complaint ID, User Name, Roll Number / Employee ID
        const s = searchTerm.toLowerCase();
        const matchesSearch =
          !s ||
          c.title.toLowerCase().includes(s) ||
          c.id.toLowerCase().includes(s) ||
          c.studentName.toLowerCase().includes(s) ||
          (c.studentRollNumber && c.studentRollNumber.toLowerCase().includes(s)) ||
          (c.location && c.location.toLowerCase().includes(s));

        // Status filter
        const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

        // Category filter
        const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;

        // Priority filter
        const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;

        // Role filter
        let matchesRole = true;
        if (selectedRole !== 'ALL') {
          // Check role from user object in users list or studentRollNumber prefix
          const submitter = users.find((u) => u.id === c.studentId || u.id === c.userId);
          const role = submitter?.role || (c.studentRollNumber?.startsWith('EMP') ? 'department_staff' : 'student');
          if (selectedRole === 'student') {
            matchesRole = role === 'student';
          } else if (selectedRole === 'staff') {
            matchesRole = role === 'department_staff';
          }
        }

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'priority_desc') {
          const priorityWeights: Record<Priority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [instComplaints, searchTerm, selectedStatus, selectedCategory, selectedPriority, selectedRole, sortBy, users]);

  // Handle opening Assign Modal
  const handleOpenAssignModal = (complaintId: string) => {
    const c = instComplaints.find((x) => x.id === complaintId);
    setTargetComplaintId(complaintId);
    setSelectedDeptId(c?.departmentId || departments[0]?.id || '');
    setSelectedStaffId(c?.assignedStaffId || '');
    setAssignNotes('');
    setAssignModalOpen(true);
  };

  // Handle confirming Assignment
  const handleConfirmAssign = () => {
    if (!targetComplaintId) return;
    const dept = departments.find((d) => d.id === selectedDeptId) || departments[0];
    const staff = staffList.find((s) => s.id === selectedStaffId);

    assignComplaint(
      targetComplaintId,
      dept.id,
      dept.name,
      staff?.id,
      staff?.name,
      assignNotes.trim() || undefined
    );
    setAssignModalOpen(false);
  };

  // Handle opening Status Modal
  const handleOpenStatusModal = (complaintId: string, current: ComplaintStatus) => {
    setTargetComplaintId(complaintId);
    setNewStatus(current);
    setResolutionNote('');
    setStatusModalOpen(true);
  };

  // Handle confirming Status Change
  const handleConfirmStatus = () => {
    if (!targetComplaintId) return;
    updateComplaintStatus(targetComplaintId, newStatus, resolutionNote.trim() || undefined);
    setStatusModalOpen(false);
  };

  const targetComplaint = instComplaints.find((c) => c.id === targetComplaintId);

  // Helper to determine submitter role badge
  const getSubmitterRole = (c: any) => {
    const submitter = users.find((u) => u.id === c.studentId || u.id === c.userId);
    const isStaff = submitter?.role === 'department_staff' || (c.studentRollNumber && c.studentRollNumber.startsWith('EMP'));
    return isStaff ? 'Faculty/Staff' : 'Student';
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
    setSelectedRole('ALL');
    setSortBy('date_desc');
  };

  const hasActiveFilters = searchTerm || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedPriority !== 'ALL' || selectedRole !== 'ALL' || sortBy !== 'date_desc';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Complaint Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {filteredComplaints.length} tickets
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review, triage, re-assign, and resolve issues across all campus departments, students, and faculty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
          <button
            onClick={() => navigate('admin', 'dashboard')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="admin-complaints-search-input"
              type="text"
              placeholder="Search by Title, Complaint ID (e.g. CMP-2026-0814), Submitter Name, Roll No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              id="admin-complaints-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="priority_desc">Priority (Urgent First)</option>
              <option value="title_asc">Title (A to Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Status</label>
            <select
              id="admin-filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Category</label>
            <select
              id="admin-filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Priority</label>
            <select
              id="admin-filter-priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Submitter Role Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Submitted By</label>
            <select
              id="admin-filter-role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
            >
              <option value="ALL">All Users</option>
              <option value="student">Students Only</option>
              <option value="staff">Faculty / Staff Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table / List Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-700 text-sm">No complaints match current filters</p>
            <p className="text-xs text-slate-400">Try adjusting your search terms, status, or role filter criteria.</p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Complaint ID & Title</th>
                  <th className="py-3 px-4">Submitted By</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => {
                  const role = getSubmitterRole(c);
                  const isStaff = role === 'Faculty/Staff';

                  return (
                    <tr 
                      key={c.id} 
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* ID & Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200/80">
                            {c.id}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate('admin', 'complaint-details', c.id)}
                          className="font-bold text-slate-900 hover:text-emerald-700 text-left line-clamp-1 group-hover:underline text-xs"
                        >
                          {c.title}
                        </button>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{c.location}</p>
                      </td>

                      {/* Submitted By */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isStaff ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {isStaff ? <Briefcase className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{c.studentName}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                isStaff ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {isStaff ? 'Staff' : 'Student'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {c.studentRollNumber || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <CategoryBadge category={c.category} size="sm" />
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>

                      {/* Assigned To */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {c.assignedStaffName || c.assignedStaff ? (
                          <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{c.assignedStaffName || c.assignedStaff}</span>
                          </div>
                        ) : c.assignedDepartment || c.departmentName ? (
                          <div className="flex items-center gap-1 text-slate-600">
                            <Building className="w-3 h-3 text-slate-400" />
                            <span className="text-[11px] truncate max-w-[120px]">{c.assignedDepartment || c.departmentName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            id={`admin-view-btn-${c.id}`}
                            onClick={() => navigate('admin', 'complaint-details', c.id)}
                            title="View Full Complaint Details"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors font-medium text-[11px] flex items-center gap-1"
                          >
                            <span>Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>

                          <button
                            id={`admin-status-btn-${c.id}`}
                            onClick={() => handleOpenStatusModal(c.id, c.status)}
                            title="Change Status"
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                          >
                            Status
                          </button>

                          <button
                            id={`admin-assign-btn-${c.id}`}
                            onClick={() => handleOpenAssignModal(c.id)}
                            title="Assign to Staff / Department"
                            className="px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-colors"
                          >
                            Assign
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

      {/* Modal 1: Quick Status Change Modal */}
      {statusModalOpen && targetComplaint && (
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Update Status: ${targetComplaint.id}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block truncate">{targetComplaint.title}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-500">Current Status:</span>
                <StatusBadge status={targetComplaint.status} size="sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select New Status
              </label>
              <select
                id="modal-status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Remarks / Note (Dispatched to complainant)
              </label>
              <textarea
                id="modal-status-note"
                rows={3}
                placeholder="Add explanation, investigation findings, or official decision remarks..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This note will be recorded in the complaint audit log and notified to the complainant.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStatusModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="modal-confirm-status-btn"
                type="button"
                onClick={handleConfirmStatus}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Commit Status Change
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal 2: Quick Assign Modal */}
      {assignModalOpen && targetComplaint && (
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={`Assign Ticket: ${targetComplaint.id}`}
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block truncate">{targetComplaint.title}</span>
              <span className="text-slate-500 text-[11px] mt-0.5 block">Category: {targetComplaint.category}</span>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Responsible Department
              </label>
              <select
                id="modal-assign-department"
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Staff Handler Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assigned Staff Engineer / Handler
              </label>
              <select
                id="modal-assign-staff"
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">-- No specific staff (Department queue only) --</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role.replace('_', ' ')}) - {s.departmentName}
                  </option>
                ))}
              </select>
            </div>

            {/* Instructions / Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Assignment Instructions / Notes (Optional)
              </label>
              <textarea
                id="modal-assign-notes"
                rows={2}
                placeholder="Provide directions, urgent priority notes, or technician instructions..."
                value={assignNotes}
                onChange={(e) => setAssignNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="modal-confirm-assign-btn"
                type="button"
                onClick={handleConfirmAssign}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
