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
  ShieldCheck,
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

const PRIORITIES: { label: Priority; desc: string; color: string }[] = [
  { label: 'Low', desc: 'Minor aesthetic or non-urgent issue', color: 'border-slate-200 text-slate-700 bg-slate-50' },
  { label: 'Medium', desc: 'Standard classroom/hostel inconvenience', color: 'border-blue-200 text-blue-800 bg-blue-50/50' },
  { label: 'High', desc: 'Affecting ongoing class/lab session', color: 'border-orange-200 text-orange-800 bg-orange-50/50' },
  { label: 'Urgent', desc: 'Safety hazard, electrical spark, or flooding', color: 'border-red-300 text-red-800 bg-red-50/50 font-bold' }
];

export const SubmitComplaint: React.FC = () => {
  const { currentUser, departments, submitComplaint, navigate } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Internet');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [location, setLocation] = useState('');
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || '');
  const [description, setDescription] = useState('');
  
  // Simulated attachment
  const [attachment, setAttachment] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Automatically update suggested department when category changes
  const handleCategoryChange = (newCat: ComplaintCategory) => {
    setCategory(newCat);
    const matched = departments.find((d) => d.primaryCategory === newCat);
    if (matched) {
      setDepartmentId(matched.id);
    }
  };

  const processFile = (file: File) => {
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;
    
    // Create preview URL if image
    let previewUrl: string | undefined = undefined;
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file);
    }
    
    setAttachment({ name: file.name, size: sizeStr, previewUrl });
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

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!title.trim() || title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long.';
    }
    if (!location.trim() || location.trim().length < 3) {
      errors.location = 'Please provide a clear campus location (building, floor, room number).';
    }
    if (!description.trim() || description.trim().length < 15) {
      errors.description = 'Please explain the issue in detail (at least 15 characters).';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const created = submitComplaint({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        location: location.trim(),
        departmentId,
        attachmentName: attachment?.name,
        attachmentSize: attachment?.size,
        attachmentUrl: attachment?.previewUrl
      });
      setIsSubmitting(false);
      navigate('student', 'complaint-details', created.id);
    }, 400);
  };

  const activeDepartment = departments.find((d) => d.id === departmentId) || departments[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-dashboard-btn"
          onClick={() => navigate('student', 'dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Dashboard</span>
        </button>

        <span className="text-xs text-slate-400 font-medium">
          Step 1 of 1: Grievance Registration
        </span>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Submit New Grievance</h1>
              <p className="text-xs text-slate-500">
                Lodge an official ticket with campus administration and departmental staff
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Institutional Banner (Read-only, student cannot modify institution) */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-200/80 text-emerald-900">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Institution (Locked)</p>
                <p className="font-bold text-slate-900">{currentUser?.institutionName || 'National University of Sciences & Technology (NUST)'}</p>
              </div>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-200/60">
              <p className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Lodged By</p>
              <p className="font-semibold text-slate-900">{currentUser?.name} • Roll: {currentUser?.rollNumber || '2023-CS-184'}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="complaint-title-input" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Complaint Subject / Title *
            </label>
            <input
              id="complaint-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
              }}
              placeholder="e.g. High-speed Wi-Fi dropping in CS Lab 3 / Water cooler leaking in Hostel Wing B"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                formErrors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {formErrors.title && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.title}
              </p>
            )}
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complaint-category-select" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                id="complaint-category-select"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as ComplaintCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="complaint-dept-select" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Assigned Department (Auto-Mapped)
              </label>
              <select
                id="complaint-dept-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Auto-routing informational notice */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              Tickets in category <span className="font-bold text-slate-800">"{category}"</span> will be automatically monitored and resolved by <span className="font-bold text-slate-800">"{activeDepartment?.name}"</span> technicians.
            </p>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Urgency / Priority Level *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.label;
                return (
                  <button
                    type="button"
                    key={p.label}
                    id={`complaint-priority-${p.label.toLowerCase()}`}
                    onClick={() => setPriority(p.label)}
                    className={`p-3 rounded-xl border text-left transition-all ${p.color} ${
                      isSelected ? 'ring-2 ring-emerald-600 font-bold shadow-xs' : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{p.label}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-tight">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="complaint-location-input" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Campus Location Details *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="complaint-location-input"
                type="text"
                required
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                }}
                placeholder="e.g. SEECS Building, Ground Floor, Computer Lab 3 (Near Server Room)"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none ${
                  formErrors.location ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                }`}
              />
            </div>
            {formErrors.location && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.location}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="complaint-description-textarea" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Detailed Description of Issue *
            </label>
            <textarea
              id="complaint-description-textarea"
              rows={4}
              required
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (formErrors.description) setFormErrors({ ...formErrors, description: '' });
              }}
              placeholder="Provide specific details: when the issue began, affected equipment, error codes, and how many students are disrupted..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none ${
                formErrors.description ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
              }`}
            />
            {formErrors.description && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {formErrors.description}
              </p>
            )}
          </div>

          {/* Attachment Upload dropzone (Supports drag-and-drop & click picker) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Supporting Photo / File Evidence (Optional)
            </label>

            {attachment ? (
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  {attachment.previewUrl ? (
                    <img 
                      src={attachment.previewUrl} 
                      alt="Attachment preview" 
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  ) : (
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-slate-900">{attachment.name}</p>
                    <p className="text-[10px] text-slate-400">{attachment.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  Click or drag and drop photo / document proof
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  PNG, JPG, PDF up to 10MB (Wi-Fi ping logs, broken hardware photos, etc.)
                </span>
                <input
                  id="complaint-file-input"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="complaint-submit-button"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Registering Complaint...</span>
              ) : (
                <>
                  <FilePlus2 className="w-4 h-4" />
                  <span>Submit Official Complaint</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Status will initialize as <span className="font-semibold text-slate-600">"Submitted"</span> and dispatch immediately to campus administrators.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
