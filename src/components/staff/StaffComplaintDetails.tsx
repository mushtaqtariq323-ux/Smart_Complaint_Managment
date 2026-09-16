import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Paperclip, 
  Download, 
  ExternalLink, 
  ShieldAlert, 
  MessageSquare, 
  FileText,
  User,
  Check
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

interface Props {
  complaintId?: string;
}

export const StaffComplaintDetails: React.FC<Props> = ({ complaintId }) => {
  const { currentUser, complaints, navigate } = useApp();

  // Find complaint
  const complaint = complaints.find((c) => c.id === complaintId);

  // Access check: Faculty/Staff can only view complaints submitted by their own account
  const isOwner = complaint && (
    complaint.studentId === currentUser?.id ||
    complaint.userId === currentUser?.id ||
    complaint.studentEmail === currentUser?.email
  );

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Complaint Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The requested ticket does not exist or may have been removed.
          </p>
        </div>
        <button
          onClick={() => navigate('staff', 'complaints')}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Return to My Complaints
        </button>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl border border-rose-200 text-center space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Access Restricted</h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Faculty and staff members are only authorized to view complaints submitted by their own account. You cannot view other users' tickets.
          </p>
        </div>
        <button
          onClick={() => navigate('staff', 'complaints')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to My Complaints</span>
        </button>
      </div>
    );
  }

  // 4-stage timeline for faculty view: Submitted -> Under Review -> In Progress -> Resolved
  const timelineStages = [
    {
      id: 'submitted',
      label: 'Submitted',
      desc: 'Ticket registered in SCMS portal',
      timestamp: complaint.createdAt,
      actor: complaint.studentName,
      isDone: true,
      isCurrent: complaint.status === 'Submitted'
    },
    {
      id: 'under-review',
      label: 'Under Review',
      desc: 'Institutional assessment & department routing',
      timestamp: complaint.status !== 'Submitted' ? complaint.createdAt : undefined,
      actor: 'Campus Maintenance Cell',
      isDone: complaint.status === 'Pending' || complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed' || complaint.status === 'Rejected',
      isCurrent: complaint.status === 'Pending'
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      desc: 'Technician dispatched & physical inspection underway',
      timestamp: (complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed') ? complaint.updatedAt : undefined,
      actor: complaint.assignedStaff || complaint.assignedStaffName || `${complaint.departmentName} Lead Tech`,
      isDone: complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed',
      isCurrent: complaint.status === 'In Progress'
    },
    {
      id: 'resolved',
      label: 'Resolved',
      desc: 'Work completed, verified and tested',
      timestamp: (complaint.status === 'Resolved' || complaint.status === 'Closed') ? complaint.updatedAt : undefined,
      actor: complaint.assignedStaff || complaint.assignedStaffName || 'Maintenance Officer',
      isDone: complaint.status === 'Resolved' || complaint.status === 'Closed',
      isCurrent: complaint.status === 'Resolved' || complaint.status === 'Closed'
    }
  ];

  const isRejected = complaint.status === 'Rejected';

  // Format dates
  const createdFormatted = new Date(complaint.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
  const updatedFormatted = new Date(complaint.updatedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          id="staff-details-back-btn"
          onClick={() => navigate('staff', 'complaints')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Complaints</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">ID: {complaint.id}</span>
        </div>
      </div>

      {/* Main Complaint Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
              {complaint.id}
            </span>
            <CategoryBadge category={complaint.category} />
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {complaint.title}
          </h1>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {complaint.departmentName || complaint.assignedDepartment || 'Campus Operations'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {complaint.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Submitted On</span>
                <span className="font-semibold text-slate-800 block">
                  {createdFormatted}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-[11px] text-slate-400 block">Last Activity</span>
                <span className="font-semibold text-slate-800 block">
                  {updatedFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Alert State (if applicable) */}
      {isRejected && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-900">Complaint Rejected by Campus Administration</h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              {complaint.adminResponse || 
                'This complaint was reviewed by institutional administrators and cannot be serviced through routine maintenance channels.'}
            </p>
            <p className="text-[11px] text-rose-600 mt-2 font-medium">
              If you believe this decision was made in error, please contact your department chair or campus registrar office.
            </p>
          </div>
        </div>
      )}

      {/* Status Timeline Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Resolution Status Timeline</h2>
          <span className="text-xs text-slate-500 font-medium">
            Status: <strong className="text-slate-800">{complaint.status}</strong>
          </span>
        </div>

        {isRejected ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-1">Process Stopped</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The ticket was submitted on {createdFormatted} and subsequently rejected following administrative review. No further technician dispatch is scheduled.
            </p>
          </div>
        ) : (
          <div className="relative pt-2 pb-4">
            {/* Desktop / Tablet Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              {timelineStages.map((stage, idx) => {
                let badgeBg = 'bg-slate-100 text-slate-400 border-slate-200';
                let icon = <span className="text-xs font-bold">{idx + 1}</span>;

                if (stage.isDone) {
                  badgeBg = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
                  icon = <Check className="w-4 h-4" />;
                } else if (stage.isCurrent) {
                  badgeBg = 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 animate-pulse';
                  icon = <Clock className="w-4 h-4" />;
                }

                return (
                  <div key={stage.id} className="flex flex-col space-y-2 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${badgeBg}`}>
                        {icon}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug">{stage.desc}</p>

                    {stage.timestamp && (
                      <p className="text-[10px] text-slate-400 font-mono mt-auto">
                        {new Date(stage.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Description Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Detailed Grievance Description</span>
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {complaint.description}
        </div>
      </div>

      {/* Attachment / Evidence Preview Area */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Paperclip className="w-4 h-4 text-slate-500" />
          <span>Attachment & Photo Evidence</span>
        </h2>

        {complaint.attachmentName ? (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Paperclip className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{complaint.attachmentName}</p>
                <p className="text-[11px] text-slate-500">{complaint.attachmentSize || 'Evidence Document'} • Verified Upload</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={complaint.attachmentUrl || '#'}
                download={complaint.attachmentName}
                onClick={(e) => {
                  if (!complaint.attachmentUrl) e.preventDefault();
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500">No physical evidence or attachments were provided for this complaint.</p>
          </div>
        )}
      </div>

      {/* Admin / Resolver Remarks Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <span>Administrative & Field Resolver Remarks</span>
        </h2>

        {complaint.adminResponse || complaint.resolutionNotes ? (
          <div className="space-y-3">
            {complaint.adminResponse && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">Campus Administrator Remarks</span>
                  <span className="text-[10px] text-blue-600 font-mono">Official Response</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{complaint.adminResponse}</p>
              </div>
            )}

            {complaint.resolutionNotes && (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Field Technician Resolution Note</span>
                  <span className="text-[10px] text-emerald-700 font-mono">Service Completed</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{complaint.resolutionNotes}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No formal administrative notes have been published yet. You will be notified as technicians post field updates.
          </p>
        )}

        {/* Activity Logs Timeline */}
        {complaint.activityLogs && complaint.activityLogs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-700">Audit History & Logs</h3>
            <div className="space-y-2">
              {complaint.activityLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <span className="text-slate-600">{log.authorName} ({log.authorRole.replace('_', ' ')})</span>
                    {log.note && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{log.note}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap self-start sm:self-auto">
                    {new Date(log.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
