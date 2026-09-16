import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus, Priority } from '../../types';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  UserCheck, 
  Wrench, 
  Send, 
  CheckCircle2, 
  FileText, 
  Paperclip,
  Clock,
  ShieldCheck,
  AlertTriangle,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Building,
  User,
  Check,
  MessageSquare
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

interface Props {
  complaintId?: string;
}

export const AdminComplaintDetails: React.FC<Props> = ({ complaintId }) => {
  const { 
    complaints, 
    users,
    staffList, 
    departments, 
    navigate, 
    updateComplaintStatus, 
    assignComplaint, 
    addActivityComment 
  } = useApp();

  const complaint = complaints.find((c) => c.id === complaintId) || complaints[0];

  // Status management state
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint?.status || 'Pending');
  const [adminStatusRemarks, setAdminStatusRemarks] = useState(complaint?.resolutionNotes || complaint?.adminResponse || '');

  // Assignment state
  const [selectedDeptId, setSelectedDeptId] = useState(complaint?.departmentId || departments[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(complaint?.assignedStaffId || '');
  const [assignmentNote, setAssignmentNote] = useState('');

  // Admin Memo state
  const [adminMemo, setAdminMemo] = useState('');

  if (!complaint) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Complaint ticket not found</p>
        <button
          onClick={() => navigate('admin', 'complaints')}
          className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
        >
          Return to Complaints Queue
        </button>
      </div>
    );
  }

  // Resolve submitter details
  const submitterUser = users.find((u) => u.id === complaint.studentId || u.id === complaint.userId);
  const isStaff = submitterUser?.role === 'department_staff' || (complaint.studentRollNumber && complaint.studentRollNumber.startsWith('EMP'));
  const submitterRoleText = isStaff ? 'Faculty / Staff Member' : 'Student';
  const submitterIdLabel = isStaff ? 'Employee ID' : 'Roll Number';
  const submitterIdValue = submitterUser?.employeeId || submitterUser?.rollNumber || complaint.studentRollNumber || 'N/A';
  const submitterEmail = submitterUser?.email || complaint.studentEmail || 'N/A';
  const submitterPhone = submitterUser?.phone || '+92 51 9085 0000';
  const submitterDept = submitterUser?.departmentName || complaint.departmentName || 'General Campus Department';

  // Handle Status Update
  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(complaint.id, selectedStatus, adminStatusRemarks.trim() || undefined);
  };

  // Handle Assignment
  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find((d) => d.id === selectedDeptId) || departments[0];
    const staff = staffList.find((s) => s.id === selectedStaffId);

    assignComplaint(
      complaint.id,
      dept.id,
      dept.name,
      staff?.id,
      staff?.name,
      assignmentNote.trim() || undefined
    );
    setAssignmentNote('');
  };

  // Handle posting Admin Memo / Internal Comment
  const handlePostMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminMemo.trim()) return;
    addActivityComment(complaint.id, `[Admin Official Memo]: ${adminMemo.trim()}`);
    setAdminMemo('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="admin-details-back-btn"
          onClick={() => navigate('admin', 'complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Complaints Queue</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Ticket ID: <strong className="text-slate-700">{complaint.id}</strong>
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner Header */}
        <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-slate-900 bg-slate-200/80 px-2.5 py-0.5 rounded">
                  {complaint.id}
                </span>
                <StatusBadge status={complaint.status} size="md" />
                <PriorityBadge priority={complaint.priority} size="md" />
                <CategoryBadge category={complaint.category} size="md" />
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {complaint.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {complaint.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Submitted {new Date(complaint.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Updated {new Date(complaint.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Quick Status Pill Indicator */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 md:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Assigned Handler</span>
              <div className="text-xs font-bold text-slate-900 mt-0.5 flex items-center gap-1.5 md:justify-end">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{complaint.assignedStaffName || complaint.assignedStaff || 'Unassigned'}</span>
              </div>
              <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                {complaint.assignedDepartment || complaint.departmentName || 'No Department'}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Description & Review Controls (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Submitter Profile Card */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${
                    isStaff ? 'bg-indigo-600 text-white' : 'bg-emerald-700 text-white'
                  }`}>
                    {isStaff ? <Briefcase className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{complaint.studentName}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isStaff ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {submitterRoleText}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{submitterDept}</p>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">{submitterIdLabel}</span>
                  <span className="font-mono font-bold text-slate-800">{submitterIdValue}</span>
                </div>
              </div>

              {/* Submitter Contact Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{submitterEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{submitterPhone}</span>
                </div>
              </div>
            </div>

            {/* 2. Complaint Description & Attachments */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Incident Description</span>
              </h2>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs">
                {complaint.description}
              </div>

              {/* Attachments */}
              {complaint.attachmentName ? (
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{complaint.attachmentName}</p>
                      <p className="text-[10px] text-slate-400">{complaint.attachmentSize || 'Uploaded file'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Attached Evidence
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No attachments submitted with this ticket.</p>
              )}
            </div>

            {/* 3. Administrative Review & Status Management Control */}
            <div className="bg-white rounded-2xl border border-emerald-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900">Admin Review & Status Management</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">Official Determination</span>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Workflow Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['Pending', 'Under Review', 'In Progress', 'Resolved', 'Rejected'] as ComplaintStatus[]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setSelectedStatus(st)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                          selectedStatus === st
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-600/30'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admin Remarks & Determination Notes (Notified to Submitter)
                  </label>
                  <textarea
                    id="admin-review-remarks-input"
                    rows={3}
                    placeholder="Enter official investigation notes, resolution details, or reason for rejection/review..."
                    value={adminStatusRemarks}
                    onChange={(e) => setAdminStatusRemarks(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Complainant will receive an automated notification with this updated status and note.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500">
                    Target: <strong className="text-slate-800">{complaint.studentName}</strong>
                  </span>
                  <button
                    id="admin-save-status-btn"
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save & Dispatch Status</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 4. Assignment Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900">Ticket Department & Staff Assignment</h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">Resource Dispatch</span>
              </div>

              <form onSubmit={handleAssign} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Responsible Department
                    </label>
                    <select
                      id="admin-assign-dept-select"
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

                  {/* Staff Member */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Specific Field Engineer / Staff Handler
                    </label>
                    <select
                      id="admin-assign-staff-select"
                      value={selectedStaffId}
                      onChange={(e) => setSelectedStaffId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="">-- No specific staff (Department Queue) --</option>
                      {staffList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.departmentName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Assignment Instructions / Memo (Optional)
                  </label>
                  <input
                    id="admin-assign-memo-input"
                    type="text"
                    placeholder="e.g. Conduct immediate inspection before 2:00 PM; replacement parts stocked in Storeroom 3"
                    value={assignmentNote}
                    onChange={(e) => setAssignmentNote(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    id="admin-confirm-assignment-btn"
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
                  >
                    <Wrench className="w-4 h-4" />
                    <span>Update Assignment & Notify Handler</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Activity Timeline & Audit Logs (1 Col) */}
          <div className="space-y-6">
            {/* Timeline / Audit Trail */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900">Activity History Log</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {complaint.activityLogs?.length || 0} entries
                </span>
              </div>

              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                {(complaint.activityLogs || []).map((log, idx) => (
                  <div key={log.id || idx} className="relative flex items-start gap-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 border-2 border-white flex items-center justify-center font-bold text-[10px] shrink-0 z-10 shadow-xs">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {log.note && (
                        <p className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 leading-snug">
                          {log.note}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span>By {log.authorName}</span>
                        <span className="uppercase">{log.authorRole.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Admin Note / Memo */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Add Internal Administrative Memo</span>
              </h4>

              <form onSubmit={handlePostMemo} className="space-y-2">
                <textarea
                  id="admin-internal-memo-input"
                  rows={2}
                  placeholder="Record an internal operational note or campus security comment..."
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  id="admin-post-memo-btn"
                  type="submit"
                  disabled={!adminMemo.trim()}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Internal Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
