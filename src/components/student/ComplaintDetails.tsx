import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  User, 
  Wrench, 
  FileText, 
  Paperclip, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Download,
  Share2,
  Lock,
  ExternalLink,
  Check,
  UserCheck
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { ComplaintStatus, ComplaintTimelineStage } from '../../types';
import { buildComplaintTimeline, STAGES_ORDER } from '../../utils/complaintUtils';

interface Props {
  complaintId?: string;
}

export const StudentComplaintDetails: React.FC<Props> = ({ complaintId }) => {
  const { currentUser, complaints, navigate, addActivityComment } = useApp();
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Find complaint: prioritize requested ID, fallback to first matching student complaint
  const complaint = complaints.find((c) => c.id === complaintId) ||
    complaints.find((c) => c.studentId === currentUser?.id || c.studentEmail === currentUser?.email || c.userId === currentUser?.id) ||
    complaints[0];

  if (!complaint) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-xs">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-slate-800">Complaint Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested complaint identifier does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate('student', 'complaints')}
          className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
        >
          Return to My Complaints
        </button>
      </div>
    );
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addActivityComment(complaint.id, commentText.trim());
    setCommentText('');
  };

  const handleCopyTicketId = () => {
    navigator.clipboard?.writeText(complaint.id);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Build or retrieve the 5 canonical timeline stages
  const timelineStages: ComplaintTimelineStage[] = complaint.timeline && complaint.timeline.length === 5
    ? complaint.timeline
    : buildComplaintTimeline(complaint);

  const effectiveAdminResponse = complaint.adminResponse || complaint.resolutionNotes;
  const effectiveDepartment = complaint.assignedDepartment || complaint.departmentName;
  const effectiveStaff = complaint.assignedStaff || complaint.assignedStaffName;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top navigation & action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          id="back-to-my-complaints-btn"
          onClick={() => navigate('student', 'complaints')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Complaints</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCopyTicketId}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied ID</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Ticket ID</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header bar */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded border border-emerald-200">
                  {complaint.id}
                </span>
                <CategoryBadge category={complaint.category} />
                <PriorityBadge priority={complaint.priority} />
                <span className="text-xs text-slate-400">• Registered on {new Date(complaint.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {complaint.title}
              </h1>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{complaint.location}</span>
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <StatusBadge status={complaint.status} size="md" />
            </div>
          </div>
        </div>

        {/* 3. Visual Status Timeline (Submitted -> Pending -> In Progress -> Resolved -> Closed) */}
        <div 
          id="student-complaint-timeline"
          className="p-6 bg-slate-900 text-white border-b border-slate-800"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Official Redressal Timeline
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Institutional 5-Stage Verification and Resolution Cycle
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Status Managed by Campus Authority</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {timelineStages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'current';
              const isUpcoming = stage.status === 'upcoming';

              return (
                <div 
                  key={stage.stage}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : isCompleted
                      ? 'bg-slate-800/50 border-emerald-800/50 text-slate-200'
                      : 'bg-slate-900/50 border-slate-800 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-400/30'
                          : isCompleted
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>

                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      isCurrent ? 'text-emerald-300' : isCompleted ? 'text-emerald-400/80' : 'text-slate-600'
                    }`}>
                      {stage.status}
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <p className={`text-xs font-bold ${
                      isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                    }`}>
                      {stage.stage}
                    </p>
                    
                    {stage.timestamp && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {new Date(stage.timestamp).toLocaleDateString('en-PK', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}

                    {stage.actor && (
                      <p className="text-[10px] text-emerald-300/80 font-medium truncate mt-0.5">
                        {stage.actor}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Student Complaint Description
              </h3>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                {complaint.description}
              </div>
            </div>

            {/* 4. Admin Response / Department Resolution Box */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <span>Administrative Response & Resolution Report</span>
              </h3>
              
              {effectiveAdminResponse ? (
                <div className="p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Official Resolution Sign-off</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {new Date(complaint.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-emerald-900 font-medium">
                    {effectiveAdminResponse}
                  </p>
                  <div className="pt-2 text-[11px] text-emerald-700/80 flex items-center gap-2 border-t border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified by: {effectiveStaff || 'Campus Administrative Officer'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Pending Administrative Assessment</p>
                    <p className="text-amber-800/80 mt-0.5">
                      This complaint has been routed to {effectiveDepartment}. Technicians and campus administrators are investigating the issue and will post resolution updates here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Supporting Attachment Preview / Download */}
            {complaint.attachmentName && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Uploaded Supporting Evidence
                </h3>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-emerald-700">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{complaint.attachmentName}</p>
                      <p className="text-[10px] text-slate-400">{complaint.attachmentSize || '840 KB'} • Student Evidence File</p>
                    </div>
                  </div>

                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Simulated file download for "${complaint.attachmentName}". In production, this will stream from secure cloud storage.`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download File</span>
                  </a>
                </div>
              </div>
            )}

            {/* 6. Student Inquiry / Follow-up Input */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                <span>Post Student Follow-up Inquiry</span>
              </h3>
              <form onSubmit={handlePostComment} className="flex gap-2">
                <input
                  id="student-followup-input"
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ask a clarifying question or report updated status on-site..."
                  className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  id="student-post-followup-btn"
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-1">
                Your message is added directly to the official complaint audit trail.
              </p>
            </div>
          </div>

          {/* Right Column: Metadata & Locked Permissions Notice */}
          <div className="space-y-4">
            {/* Metadata Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5 text-xs">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center justify-between">
                <span>Grievance Dossier</span>
                <span className="text-[10px] font-mono text-slate-400">{complaint.id}</span>
              </h4>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Responsible Department</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{effectiveDepartment}</span>
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Assigned Technician / Staff</span>
                <p className="font-bold text-slate-800 mt-0.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {effectiveStaff ? (
                    <span className="text-emerald-800">{effectiveStaff}</span>
                  ) : (
                    <span className="text-amber-700 italic">Pending assignment</span>
                  )}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Institution</span>
                <p className="font-medium text-slate-700 mt-0.5">{complaint.institutionName}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Complainant (Student)</span>
                <p className="font-semibold text-slate-800 mt-0.5">{complaint.studentName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{complaint.studentRollNumber} • {complaint.studentEmail}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Created Timestamp</span>
                <p className="text-slate-700 mt-0.5">{new Date(complaint.createdAt).toLocaleString('en-PK')}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Last System Update</span>
                <p className="text-slate-700 mt-0.5">{new Date(complaint.updatedAt).toLocaleString('en-PK')}</p>
              </div>
            </div>

            {/* Read-only Security Banner */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                <Lock className="w-3.5 h-3.5 text-slate-700" />
                <span>Student Interface Security</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                As a student user, your permissions are read-only for lifecycle status, departmental assignment, and administrative sign-offs. Status changes are strictly authenticated by university staff.
              </p>
            </div>
          </div>
        </div>

        {/* Chronological Audit Trail & Activity Log */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audit Trail & Activity Log ({complaint.activityLogs?.length || 0})
            </h3>
            <span className="text-[10px] text-slate-400">Chronological verification history</span>
          </div>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {complaint.activityLogs?.map((log) => (
              <div key={log.id} className="flex items-start gap-4 relative">
                <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  •
                </div>
                <div className="flex-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{log.authorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                        {log.authorRole.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleString('en-PK')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 mt-1">{log.action}</p>
                  {log.note && (
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {log.note}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
