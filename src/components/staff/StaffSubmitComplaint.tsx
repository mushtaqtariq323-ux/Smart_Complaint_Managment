import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, Priority } from '../../types';
import { 
  FilePlus2, 
  UploadCloud, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  MapPin, 
  Tag, 
  Building2, 
  Paperclip,
  X,
  FileCheck,
  ShieldAlert,
  Info
} from 'lucide-react';

const CATEGORIES: ComplaintCategory[] = [
  'Electricity',
  'Water',
  'Internet',
  'Classroom',
  'Laboratory',
  'Cleaning',
  'Transport',
  'Security',
  'Furniture',
  'Other'
];

const PRIORITIES: { label: Priority; desc: string; color: string; activeColor: string }[] = [
  { 
    label: 'Low', 
    desc: 'Minor aesthetic or non-urgent issue', 
    color: 'border-slate-200 text-slate-700 bg-slate-50/50 hover:bg-slate-100',
    activeColor: 'border-slate-600 bg-slate-100 text-slate-900 ring-2 ring-slate-400'
  },
  { 
    label: 'Medium', 
    desc: 'Standard faculty office or classroom inconvenience', 
    color: 'border-blue-200 text-blue-800 bg-blue-50/40 hover:bg-blue-50',
    activeColor: 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500'
  },
  { 
    label: 'High', 
    desc: 'Affecting ongoing lectures, evaluations or research', 
    color: 'border-amber-200 text-amber-800 bg-amber-50/40 hover:bg-amber-50',
    activeColor: 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500'
  },
  { 
    label: 'Urgent', 
    desc: 'Safety hazard, electrical spark, flood or major server fault', 
    color: 'border-red-200 text-red-800 bg-red-50/40 hover:bg-red-50',
    activeColor: 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-500'
  }
];

export const StaffSubmitComplaint: React.FC = () => {
  const { currentUser, departments, submitComplaint, navigate, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Internet');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState(
    currentUser?.departmentName ? `${currentUser.departmentName} Faculty Block` : 'Academic Block B, Faculty Wing'
  );
  const [departmentId, setDepartmentId] = useState<string>(() => {
    const matched = departments.find((d) => d.primaryCategory === 'Internet');
    return matched?.id || departments[0]?.id || '';
  });
  const [description, setDescription] = useState('');
  
  // Optional attachment
  const [attachment, setAttachment] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Automatically suggest department when category changes
  const handleCategoryChange = (newCat: ComplaintCategory) => {
    setCategory(newCat);
    const matched = departments.find((d) => d.primaryCategory === newCat);
    if (matched) {
      setDepartmentId(matched.id);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors((prev) => ({ ...prev, attachment: 'File size must be under 10MB' }));
      return;
    }

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    
    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }
    
    setAttachment({ name: file.name, size: sizeStr, previewUrl });
    setFormErrors((prev) => {
      const copy = { ...prev };
      delete copy.attachment;
      return copy;
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!title.trim()) {
      errors.title = 'Complaint title is required.';
    } else if (title.trim().length < 5) {
      errors.title = 'Title should be at least 5 characters long.';
    }

    if (!category) {
      errors.category = 'Please select a complaint category.';
    }

    if (!departmentId) {
      errors.departmentId = 'Please select the target campus department.';
    }

    if (!location.trim()) {
      errors.location = 'Specific location, room number, or lab block is required.';
    }

    if (!description.trim()) {
      errors.description = 'Please provide a detailed description of the grievance.';
    } else if (description.trim().length < 20) {
      errors.description = 'Please provide more details (at least 20 characters) to help technicians troubleshoot.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedDept = departments.find((d) => d.id === departmentId);

      const newComplaint = submitComplaint({
        title: title.trim(),
        category,
        priority,
        location: location.trim(),
        departmentId,
        departmentName: selectedDept?.name || 'Campus Operations',
        description: description.trim(),
        attachmentName: attachment?.name,
        attachmentSize: attachment?.size,
        attachmentUrl: attachment?.previewUrl || (attachment?.name ? '/mock-attachment.png' : undefined)
      });

      setIsSubmitting(false);
      showToast(`Complaint ${newComplaint.id} submitted successfully!`, 'success');
      navigate('staff', 'complaint-details', newComplaint.id);
    }, 450);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="staff-submit-back-btn"
          onClick={() => navigate('staff', 'dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <span className="text-xs font-medium text-slate-500">
          Submitting as <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.departmentName})
        </span>
      </div>

      {/* Main Submission Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Submit Faculty/Staff Complaint</h1>
              <p className="text-xs sm:text-sm text-blue-200/90 mt-0.5">
                Lodge an official campus maintenance request, IT ticket, or facility grievance
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Complaint Title */}
          <div className="space-y-1.5">
            <label htmlFor="complaint-title" className="block text-xs font-bold text-slate-800">
              Complaint Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="complaint-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formErrors.title) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.title;
                    return c;
                  });
                }
              }}
              placeholder="e.g., Split AC breaker tripping in Faculty Office 204"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
                formErrors.title 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' 
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {formErrors.title && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formErrors.title}</span>
              </p>
            )}
          </div>

          {/* Category & Department Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="complaint-category" className="block text-xs font-bold text-slate-800">
                Category <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="complaint-category"
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-500">
                Department routing is auto-matched based on selected category.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="complaint-department" className="block text-xs font-bold text-slate-800">
                Responsible Department <span className="text-rose-500">*</span>
              </label>
              <select
                id="complaint-department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              {formErrors.departmentId && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{formErrors.departmentId}</span>
                </p>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-1.5">
            <label htmlFor="complaint-location" className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Exact Location / Office / Lab <span className="text-rose-500">*</span></span>
            </label>
            <input
              id="complaint-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (formErrors.location) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.location;
                    return c;
                  });
                }
              }}
              placeholder="e.g., SEECS Building B, 2nd Floor, Room 204 / Telecom Research Lab"
              className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
                formErrors.location 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' 
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {formErrors.location && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formErrors.location}</span>
              </p>
            )}
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Priority Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.label;
                return (
                  <button
                    key={p.label}
                    type="button"
                    id={`priority-btn-${p.label.toLowerCase()}`}
                    onClick={() => setPriority(p.label)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected ? p.activeColor : p.color
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{p.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-800" />}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="complaint-description" className="block text-xs font-bold text-slate-800">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {description.length} characters
              </span>
            </div>
            <textarea
              id="complaint-description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (formErrors.description) {
                  setFormErrors((prev) => {
                    const c = { ...prev };
                    delete c.description;
                    return c;
                  });
                }
              }}
              placeholder="Describe what is broken, when it started happening, specific error codes, or impact on faculty duties and student lab sessions..."
              className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none ${
                formErrors.description 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100' 
                  : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              }`}
            />
            {formErrors.description && (
              <p className="text-[11px] text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{formErrors.description}</span>
              </p>
            )}
          </div>

          {/* Attachment / Evidence Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-slate-500" />
              <span>Optional Evidence / Attachment</span>
            </label>

            {attachment ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{attachment.name}</p>
                    <p className="text-[11px] text-slate-500">{attachment.size} • Attached</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Drag & drop photo evidence, screenshot, or diagnostic log
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  PNG, JPG, PDF, or TXT up to 10MB
                </p>

                <label className="mt-3 inline-block">
                  <span className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileInputChange}
                    accept="image/*,.pdf,.txt,.doc,.docx"
                  />
                </label>
              </div>
            )}
            {formErrors.attachment && (
              <p className="text-[11px] text-rose-600">{formErrors.attachment}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              id="staff-submit-cancel-btn"
              onClick={() => navigate('staff', 'dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="staff-submit-confirm-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
