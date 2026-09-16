import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintStatus, Priority } from '../../types';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  ChevronRight, 
  ArrowUpDown, 
  Inbox, 
  Clock, 
  FileText,
  Calendar,
  Building2,
  AlertCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

export const StaffMyComplaints: React.FC = () => {
  const { currentUser, complaints, navigate } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Filter complaints strictly submitted by this faculty member
  const myComplaints = useMemo(() => {
    return complaints.filter(
      (c) => c.studentId === currentUser?.id || c.userId === currentUser?.id || c.studentEmail === currentUser?.email
    );
  }, [complaints, currentUser]);

  // Filtered and sorted complaints
  const filteredComplaints = useMemo(() => {
    return myComplaints
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
        const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime();
        const timeB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [myComplaints, searchTerm, selectedStatus, selectedPriority, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: myComplaints.length,
      pending: myComplaints.filter((c) => c.status === 'Submitted' || c.status === 'Pending').length,
      inProgress: myComplaints.filter((c) => c.status === 'In Progress').length,
      resolved: myComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Closed').length,
      rejected: myComplaints.filter((c) => c.status === 'Rejected').length
    };
  }, [myComplaints]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Submitted Complaints</h1>
          <p className="text-xs text-slate-500">
            Track grievances, equipment tickets, and infrastructure requests submitted by you
          </p>
        </div>

        <button
          id="staff-complaints-new-btn"
          onClick={() => navigate('staff', 'submit')}
          className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Complaint</span>
        </button>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="filter-status-all"
          onClick={() => setSelectedStatus('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedStatus === 'ALL'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>All</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatus === 'ALL' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.all}
          </span>
        </button>

        <button
          id="filter-status-pending"
          onClick={() => setSelectedStatus('Pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedStatus === 'Pending'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Pending</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatus === 'Pending' ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.pending}
          </span>
        </button>

        <button
          id="filter-status-progress"
          onClick={() => setSelectedStatus('In Progress')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedStatus === 'In Progress'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>In Progress</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatus === 'In Progress' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.inProgress}
          </span>
        </button>

        <button
          id="filter-status-resolved"
          onClick={() => setSelectedStatus('Resolved')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedStatus === 'Resolved'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Resolved</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatus === 'Resolved' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.resolved}
          </span>
        </button>

        <button
          id="filter-status-rejected"
          onClick={() => setSelectedStatus('Rejected')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedStatus === 'Rejected'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Rejected</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${selectedStatus === 'Rejected' ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {statusCounts.rejected}
          </span>
        </button>
      </div>

      {/* Search, Filter, Sort Controls Card */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="staff-complaints-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, title, category, or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Priority Filter & Sort */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="staff-complaints-priority-filter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              id="staff-complaints-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table / List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No complaints found</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedStatus !== 'ALL' || selectedPriority !== 'ALL'
                ? 'No tickets match your active filter and search criteria. Try adjusting filters.'
                : 'You have not submitted any complaints yet. Submit a new ticket to get started.'}
            </p>
            {(searchTerm || selectedStatus !== 'ALL' || selectedPriority !== 'ALL') ? (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('ALL');
                  setSelectedPriority('ALL');
                }}
                className="mt-3 px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('staff', 'submit')}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit First Complaint</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[150px] truncate">
                      {c.departmentName || c.assignedDepartment || 'Campus Operations'}
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        id={`staff-complaint-view-${c.id}`}
                        onClick={() => navigate('staff', 'complaint-details', c.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            Showing <strong>{filteredComplaints.length}</strong> of <strong>{myComplaints.length}</strong> submitted complaints
          </span>
          <span className="text-[11px]">
            Faculty Grievance Portal • Real-time status sync
          </span>
        </div>
      </div>
    </div>
  );
};
