import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryItem } from '../../types';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit2, 
  Power, 
  CheckCircle2, 
  XCircle, 
  Building, 
  FileText,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminCategories: React.FC = () => {
  const { 
    categories, 
    complaints, 
    departments, 
    addCategory, 
    updateCategory, 
    toggleCategoryStatus,
    navigate 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'disabled'>('active');
  const [formError, setFormError] = useState('');

  // Complaint count per category
  const getCategoryCount = (categoryName: string) => {
    return complaints.filter((c) => c.category === categoryName).length;
  };

  const totalCategories = categories.length;
  const activeCategories = categories.filter((c) => c.status === 'active').length;
  const disabledCategories = categories.filter((c) => c.status === 'disabled').length;

  // Filter categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter !== 'all' && cat.status !== statusFilter) return false;
      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(s);
        const matchesDesc = cat.description.toLowerCase().includes(s);
        const matchesDept = (cat.departmentName || '').toLowerCase().includes(s);
        if (!matchesName && !matchesDesc && !matchesDept) return false;
      }
      return true;
    });
  }, [categories, statusFilter, searchTerm]);

  // Open modal for new category
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormDesc('');
    setFormDeptId(departments[0]?.id || '');
    setFormStatus('active');
    setFormError('');
    setModalOpen(true);
  };

  // Open modal for editing category
  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormDesc(cat.description);
    setFormDeptId(cat.departmentId || departments[0]?.id || '');
    setFormStatus(cat.status);
    setFormError('');
    setModalOpen(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const dept = departments.find((d) => d.id === formDeptId);

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName.trim(),
        description: formDesc.trim(),
        departmentId: dept?.id,
        departmentName: dept?.name,
        status: formStatus
      });
    } else {
      addCategory({
        name: formName.trim(),
        description: formDesc.trim(),
        departmentId: dept?.id,
        departmentName: dept?.name,
        status: formStatus
      });
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Grievance Category Management</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {totalCategories} Categories
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure incident classifications, associate departmental queues, and regulate active complaint options.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="admin-add-category-btn"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Categories</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCategories}</p>
          <span className="text-[11px] text-slate-500">Configured taxonomy</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Active</span>
          <p className="text-2xl font-black text-emerald-800 mt-1">{activeCategories}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Available for submission</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Disabled</span>
          <p className="text-2xl font-black text-slate-600 mt-1">{disabledCategories}</p>
          <span className="text-[11px] text-slate-500">Hidden from user forms</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Total Complaints</span>
          <p className="text-2xl font-black text-blue-900 mt-1">{complaints.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Mapped to categories</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="admin-category-search-input"
            type="text"
            placeholder="Search category name or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <select
            id="admin-category-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
            <FolderOpen className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-700 text-sm mt-2">No categories found</p>
            <p className="text-xs text-slate-400">Try modifying your search query or add a new category.</p>
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const count = getCategoryCount(cat.name);

            return (
              <div
                key={cat.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  cat.status === 'disabled' 
                    ? 'border-slate-200 bg-slate-50/50 opacity-80' 
                    : 'border-slate-200 hover:border-emerald-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        cat.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                    </div>

                    {cat.status === 'active' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                        Disabled
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500 truncate max-w-[170px]">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{cat.departmentName || 'General Campus'}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {count} tickets
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      id={`edit-category-${cat.id}`}
                      onClick={() => handleOpenEdit(cat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      id={`toggle-category-${cat.id}`}
                      onClick={() => toggleCategoryStatus(cat.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                        cat.status === 'active'
                          ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{cat.status === 'active' ? 'Disable' : 'Enable'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Grievance Category'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="category-modal-name"
                type="text"
                required
                placeholder="e.g. Lab Equipment, Dormitory Sanitation, Network Wifi..."
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                id="category-modal-desc"
                rows={3}
                placeholder="Describe what incidents or requests fall under this category..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Default Assigned Department
              </label>
              <select
                id="category-modal-department"
                value={formDeptId}
                onChange={(e) => setFormDeptId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Availability Status
              </label>
              <select
                id="category-modal-status"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="active">Active (Available for submissions)</option>
                <option value="disabled">Disabled (Hidden from submission dropdowns)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                id="category-modal-save-btn"
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
