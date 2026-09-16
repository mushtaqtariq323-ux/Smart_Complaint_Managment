import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory } from '../../types';
import { Network, Plus, Users, FileText, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminDepartments: React.FC = () => {
  const { departments, complaints, addDepartment, currentUser } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [headName, setHeadName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffCount, setStaffCount] = useState(5);
  const [primaryCategory, setPrimaryCategory] = useState<ComplaintCategory>('Classroom');

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !headName.trim()) return;

    addDepartment({
      name: name.trim(),
      institutionId: currentUser?.institutionId || 'inst-1',
      headName: headName.trim(),
      email: email.trim() || 'dept.contact@nust.edu.pk',
      phone: phone.trim() || '+92 51 9085 0000',
      staffCount: Number(staffCount),
      primaryCategory
    });

    setModalOpen(false);
    setName('');
    setHeadName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campus Departments</h1>
          <p className="text-xs text-slate-500">
            Designated units responsible for maintenance, infrastructure, IT, and administrative remediation
          </p>
        </div>

        <button
          id="add-department-btn"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Grid of departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptComplaints = complaints.filter((c) => c.departmentId === dept.id);
          const activeCount = deptComplaints.filter((c) => c.status !== 'Closed' && c.status !== 'Resolved').length;

          return (
            <div
              key={dept.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                    <Network className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {dept.primaryCategory}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Head: <span className="font-semibold text-slate-700">{dept.headName}</span></p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px] truncate">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{dept.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>{dept.staffCount}</strong> Staff</span>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                  {activeCount} Active Tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Campus Department"
        subtitle="Configure a new organizational grievance handling unit"
        maxWidth="md"
      >
        <form onSubmit={handleCreateDept} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chemical Labs & Safety Division"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Department Head / Supervisor *</label>
            <input
              type="text"
              required
              value={headName}
              onChange={(e) => setHeadName(e.target.value)}
              placeholder="e.g. Dr. Asad Ullah"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dept@institution.edu.pk"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 51 9085 XXXX"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Primary Category</label>
              <select
                value={primaryCategory}
                onChange={(e) => setPrimaryCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
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
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Assigned Staff Count</label>
              <input
                type="number"
                min={1}
                max={100}
                value={staffCount}
                onChange={(e) => setStaffCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs"
            >
              Save Department
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
