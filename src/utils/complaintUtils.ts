import { Complaint, ComplaintStatus, ComplaintTimelineStage, Priority } from '../types';

export const STAGES_ORDER: ComplaintStatus[] = [
  'Submitted',
  'Pending',
  'In Progress',
  'Resolved',
  'Closed'
];

export const STAGE_CONFIG: Record<ComplaintStatus, {
  label: string;
  stepNumber: number;
  shortDesc: string;
  badgeClass: string;
  dotColor: string;
}> = {
  'Submitted': {
    label: 'Submitted',
    stepNumber: 1,
    shortDesc: 'Ticket registered by student',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  'Pending': {
    label: 'Pending',
    stepNumber: 2,
    shortDesc: 'Awaiting admin assessment & dispatch',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500'
  },
  'In Progress': {
    label: 'In Progress',
    stepNumber: 3,
    shortDesc: 'Staff assigned & physical work underway',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500'
  },
  'Resolved': {
    label: 'Resolved',
    stepNumber: 4,
    shortDesc: 'Maintenance completed & verified',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    dotColor: 'bg-teal-500'
  },
  'Closed': {
    label: 'Closed',
    stepNumber: 5,
    shortDesc: 'Final sign-off archived by administration',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    dotColor: 'bg-slate-500'
  },
  'Rejected': {
    label: 'Rejected',
    stepNumber: 0,
    shortDesc: 'Complaint declined by administration',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500'
  }
};

/**
 * Computes the 5 canonical timeline stages for a complaint.
 * Ensures timestamps, active status, and actor remarks are accurately populated.
 */
export function buildComplaintTimeline(complaint: Complaint): ComplaintTimelineStage[] {
  // If complaint already has an explicit custom timeline array with 5 stages, verify or use it
  const currentStatus = complaint.status;
  const currentStageIndex = STAGES_ORDER.indexOf(currentStatus);
  const effectiveIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  return STAGES_ORDER.map((stageName, idx) => {
    let status: 'completed' | 'current' | 'upcoming' = 'upcoming';
    let timestamp: string | undefined = undefined;
    let actor: string | undefined = undefined;
    let notes: string | undefined = undefined;

    if (idx < effectiveIndex) {
      status = 'completed';
    } else if (idx === effectiveIndex) {
      status = 'current';
    } else {
      status = 'upcoming';
    }

    // Assign realistic dates and notes based on stages and activity logs
    if (stageName === 'Submitted') {
      timestamp = complaint.createdAt;
      actor = complaint.studentName;
      notes = `Submitted ticket via SCMS. Location: ${complaint.location}`;
    } else if (stageName === 'Pending') {
      if (idx <= effectiveIndex) {
        timestamp = complaint.createdAt; // or slightly after
        actor = 'Campus Grievance Cell / Admin Desk';
        notes = 'Complaint logged in institutional review queue.';
      }
    } else if (stageName === 'In Progress') {
      if (idx <= effectiveIndex) {
        timestamp = complaint.updatedAt;
        actor = complaint.assignedStaff || complaint.assignedStaffName || `${complaint.assignedDepartment || complaint.departmentName} Technician`;
        notes = `Assigned to ${complaint.assignedDepartment || complaint.departmentName}. Field team dispatched.`;
      }
    } else if (stageName === 'Resolved') {
      if (idx <= effectiveIndex) {
        timestamp = complaint.updatedAt;
        actor = complaint.assignedStaff || complaint.assignedStaffName || 'Lead Maintenance Officer';
        notes = complaint.adminResponse || complaint.resolutionNotes || 'Remediation completed. Tested and operational.';
      }
    } else if (stageName === 'Closed') {
      if (idx <= effectiveIndex) {
        timestamp = complaint.updatedAt;
        actor = 'Campus Registrar Administration';
        notes = 'Ticket archived after student verification period.';
      }
    }

    // Check if there is a matching activity log for this stage
    const matchingLog = complaint.activityLogs?.find((log) => {
      const act = log.action.toLowerCase();
      if (stageName === 'Submitted' && act.includes('submitted')) return true;
      if (stageName === 'Pending' && (act.includes('review') || act.includes('pending') || act.includes('routed'))) return true;
      if (stageName === 'In Progress' && (act.includes('progress') || act.includes('assigned'))) return true;
      if (stageName === 'Resolved' && act.includes('resolved')) return true;
      if (stageName === 'Closed' && act.includes('closed')) return true;
      return false;
    });

    if (matchingLog) {
      timestamp = matchingLog.timestamp;
      actor = matchingLog.authorName;
      if (matchingLog.note) {
        notes = matchingLog.note;
      }
    }

    return {
      stage: stageName,
      status,
      timestamp: status !== 'upcoming' ? (timestamp || complaint.updatedAt) : undefined,
      actor: status !== 'upcoming' ? actor : undefined,
      notes: status !== 'upcoming' ? notes : undefined
    };
  });
}

export function formatRelativeTime(isoDateString: string): string {
  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoDateString;
  }
}
