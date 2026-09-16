import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstitutionType } from '../../types';
import { 
  Building2, 
  Search, 
  Plus, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  ShieldAlert, 
  ExternalLink,
  Power
} from 'lucide-react';
import { PAKISTAN_CITIES, PAKISTAN_PROVINCES } from '../../data/mockData';
import { Modal } from '../common/Modal';

export const SuperAdminInstitutions: React.FC = () => {
  const { institutions, addInstitution, toggleInstitutionStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  // New Institution Form
  const [name, setName] = useState('');
  const [type, setType] = useState<InstitutionType>('university');
  const [city, setCity] = useState(PAKISTAN_CITIES[0]);
  const [province, setProvince] = useState(PAKISTAN_PROVINCES[0]);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [website, setWebsite] = useState('');

  const filtered = institutions.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.adminName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'ALL' || inst.type === typeFilter;
    const matchesProvince = provinceFilter === 'ALL' || inst.province === provinceFilter;

    return matchesSearch && matchesType && matchesProvince;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !adminEmail.trim()) return;

    addInstitution({
      name: name.trim(),
      type,
      city,
      province,
      adminName: adminName.trim() || 'Registrar',
      adminEmail: adminEmail.trim(),
      adminPhone: adminPhone.trim() || '+92 51 000 0000',
      website: website.trim() || 'https://institution.edu.pk'
    });

    setModalOpen(false);
    setName('');
    setAdminName('');
    setAdminEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">National Institutions Directory</h1>
          <p className="text-xs text-slate-500">
            Registered universities, affiliated colleges, and schools onboarded to the Pakistan SCMS infrastructure
          </p>
        </div>

        <button
          id="add-institution-modal-btn"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Institution</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search institution by name, city, focal person..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="university">Universities</option>
            <option value="college">Colleges</option>
            <option value="school">Schools</option>
          </select>

          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none max-w-[200px]"
          >
            <option value="ALL">All Provinces</option>
            {PAKISTAN_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Institutions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 border border-purple-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {inst.type}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      inst.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {inst.status}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{inst.name}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{inst.city}, {inst.province}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <p>
                  Focal Person: <strong className="text-slate-800">{inst.adminName}</strong>
                </p>
                <p className="font-mono text-[11px] text-slate-500 truncate">{inst.adminEmail}</p>
                <p className="font-mono text-[11px] text-slate-500">{inst.adminPhone}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={inst.website}
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Portal URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => toggleInstitutionStatus(inst.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  inst.status === 'Active'
                    ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                    : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{inst.status === 'Active' ? 'Suspend' : 'Activate'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Institution Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Onboard New Institution"
        subtitle="Manually provision an academic institution into the Pakistan SCMS network"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Institution Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quaid-i-Azam University"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InstitutionType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
              >
                <option value="university">University</option>
                <option value="college">College</option>
                <option value="school">School</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none"
              >
                {PAKISTAN_PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Campus Admin / Registrar Name *</label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="Dr. Tariq Mushtaq"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Email *</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="registrar@qau.edu.pk"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Admin Phone</label>
              <input
                type="tel"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                placeholder="+92 51 9064 0000"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Institution Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://qau.edu.pk"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-xs"
            >
              Provision Campus
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
