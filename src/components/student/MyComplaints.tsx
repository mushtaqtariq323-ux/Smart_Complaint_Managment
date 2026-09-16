import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintStatus, Priority } from '../../types';
import { 
  FileText, 
  Search, 
  Filter, 
  FilePlus2, 
  Calendar, 
  MapPin, 
  ArrowRight,
  SlidersHorizontal,
  X,
  LayoutList,
  LayoutGrid,
  UserCheck,
  Building2,
  Paperclip
} from 'lucide-react';
import { StatusBadge, PriorityBadge, CategoryBadge } from '../common/Badge';

export const MyComplaints: React.FC = () => {
  const { currentUser, complaints, navigate } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Security & Privacy: Student must only see their own complaints
  const studentComplaints = complaints.filter(
    (c) => c.studentId === currentUser?.id || c.studentEmail === currentUser?.email || c.userId === currentUser?.id
  );

  const filtered = studentComplaints.filter((c) => {
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const statuses: { label: string; value: string; count: number }[] = [
    { label: 'All', value: 'ALL', count: studentComplaints.length },
    { label: 'Submitted', value: 'Submitted', count: studentComplaints.filter((c) => c.status === 'Submitted').length },
    { label: 'Pending', value: 'Pending', count: studentComplaints.filter((c) => c.status === 'Pending').length },
    { label: 'In Progress', value: 'In Progress', count: studentComplaints.filter((c) => c.status === 'In Progress').length },
    { label: 'Resolved', value: 'Resolved', count: studentComplaints.filter((c) => c.status === 'Resolved').length },
    { label: 'Closed', value: 'Closed', count: studentComplaints.filter((c) => c.status === 'Closed').length }
  ];

  const hasActiveFilters = searchTerm !== '' || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || selectedPriority !== 'ALL';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedCategory('ALL');
    setSelectedPriority('ALL');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Registered Complaints</h1>
          <p className="text-xs text-slate-500">
            Track status progression, departmental responses, and staff dispatch in real-time
          </p>
        </div>

        <button
          id="my-complaints-new-btn"
          onClick={() => navigate('student', 'submit')}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <FilePlus2 className="w-4 h-4" />
          <span>Submit New Complaint</span>
        </button>
      </div>

      {/* Status Pill Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statuses.map((s) => (
          <button
            key={s.value}
            id={`filter-pill-${s.value.toLowerCase().replace(' ', '-')}`}
            onClick={() => setSelectedStatus(s.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedStatus === s.value
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span>{s.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              selectedStatus === s.value ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
            }`}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Secondary Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="complaints-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, keyword, building, or issue description..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
          <select
            id="complaints-category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none flex-1 sm:flex-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Electricity">Electricity</option>
            <option value="Water">Water</option>
            <option value="Internet">Internet</option>
            <option value="Classroom">Classroom</option>
            <option value="Laboratory">Laboratory</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Transport">Transport</option>
            <option value="Security">Security</option>
            <option value="Furniture">Furniture</option>
            <option value="Other">Other</option>
          </select>

          <select
            id="complaints-priority-filter"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none flex-1 sm:flex-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center p-0.5 rounded-xl border border-slate-200 bg-slate-50">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
              title="Table View"
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 transition-colors"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering: Card View or Table View */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No complaints match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {hasActiveFilters 
              ? 'Try resetting the search query or clearing the status/category filters.'
              : 'You have not submitted any complaints yet.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={() => navigate('student', 'submit')}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors"
            >
              Submit First Complaint
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Title & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Department / Staff</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    id={`table-row-${c.id}`}
                    onClick={() => navigate('student', 'complaint-details', c.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {c.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{c.title}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <CategoryBadge category={c.category} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{c.assignedDepartment || c.departmentName}</p>
                      {c.assignedStaff || c.assignedStaffName ? (
                        <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                          <UserCheck className="w-3 h-3" />
                          <span>{c.assignedStaff || c.assignedStaffName}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5">Awaiting assignment</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString('en-PK', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('student', 'complaint-details', c.id);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-200/60"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              id={`complaint-card-${c.id}`}
              onClick={() => navigate('student', 'complaint-details', c.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {c.id}
                  </span>
                  <CategoryBadge category={c.category} />
                  <PriorityBadge priority={c.priority} />
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(c.createdAt).toLocaleDateString('en-PK', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {c.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs">{c.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Dept: <strong className="text-slate-800">{c.assignedDepartment || c.departmentName}</strong></span>
                  </div>

                  {(c.assignedStaff || c.assignedStaffName) && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Assigned: <strong>{c.assignedStaff || c.assignedStaffName}</strong></span>
                    </div>
                  )}

                  {c.attachmentName && (
                    <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Paperclip className="w-3 h-3" />
                      <span>Evidence attached</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Timeline & Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
