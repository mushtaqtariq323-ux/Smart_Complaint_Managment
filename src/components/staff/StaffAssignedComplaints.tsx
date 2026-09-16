import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus } from '../../types';
import { Search, Filter, Wrench, MapPin, CheckCircle, ChevronRight, Check } from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';
import { Modal } from '../common/Modal';

export const StaffAssignedComplaints: React.FC = () => {
  const { currentUser, complaints, updateComplaintStatus, navigate } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const assigned = complaints.filter(
    (c) => c.assignedStaffId === currentUser?.id || c.departmentId === currentUser?.departmentId
  );

  const filtered = assigned.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStart = (id: string) => {
    updateComplaintStatus(id, 'In Progress', 'Technician started physical inspection');
  };

  const handleOpenResolve = (id: string) => {
    setActiveComplaintId(id);
    setNotes('');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = () => {
    if (!activeComplaintId) return;
    updateComplaintStatus(
      activeComplaintId,
      'Resolved',
      notes.trim() || 'Verified and completed successfully.'
    );
    setResolveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Assigned Incident Tickets</h1>
          <p className="text-xs text-slate-500">
            Field dispatches assigned to {currentUser?.name} in {currentUser?.departmentName}
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
          {filtered.length} Work Orders
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket ID, location, title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-semibold text-slate-700">No tickets found</p>
              <p className="text-slate-400 mt-1">Try resetting your filter parameters.</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <CategoryBadge category={c.category} />
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{c.description}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-medium text-slate-800">{c.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {c.status !== 'In Progress' && c.status !== 'Resolved' && c.status !== 'Closed' && (
                    <button
                      onClick={() => handleStart(c.id)}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Start Task
                    </button>
                  )}

                  {c.status === 'In Progress' && (
                    <button
                      onClick={() => handleOpenResolve(c.id)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}

                  <button
                    onClick={() => navigate('staff', 'complaint-details', c.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="Resolve Ticket"
        subtitle={`Work Order ${activeComplaintId || ''}`}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Field Remediation Notes *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail replacement parts, tests conducted, or work done..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={() => setResolveModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmResolve}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
            >
              Confirm Complete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
