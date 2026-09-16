import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, GraduationCap, Mail, Phone, CheckCircle } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { complaints, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Sample student list for the campus
  const mockStudents = [
    { id: 'std-1', name: 'Ayesha Khan', roll: '2023-CS-184', dept: 'Computer Science', email: 'ayesha.khan@seecs.edu.pk', phone: '+92 301 2345678', complaintsCount: 3, status: 'Active' },
    { id: 'std-2', name: 'Hamza Ali', roll: '2022-EE-092', dept: 'Electrical Engineering', email: 'hamza.ali@smme.edu.pk', phone: '+92 321 9876543', complaintsCount: 2, status: 'Active' },
    { id: 'std-3', name: 'Zainab Fatima', roll: '2024-BBA-045', dept: 'Business Administration', email: 'zainab.fatima@nbs.edu.pk', phone: '+92 333 5566778', complaintsCount: 1, status: 'Active' },
    { id: 'std-4', name: 'Bilal Hassan', roll: '2021-ME-110', dept: 'Mechanical Engineering', email: 'bilal.hassan@smme.edu.pk', phone: '+92 345 1122334', complaintsCount: 0, status: 'Active' },
    { id: 'std-5', name: 'Maryam Tariq', roll: '2023-SE-054', dept: 'Software Engineering', email: 'maryam.tariq@seecs.edu.pk', phone: '+92 300 4455667', complaintsCount: 1, status: 'Active' },
    { id: 'std-6', name: 'Saad Ur Rehman', roll: '2022-CE-033', dept: 'Civil Engineering', email: 'saad.rehman@nice.edu.pk', phone: '+92 312 8899001', complaintsCount: 0, status: 'Active' }
  ];

  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enrolled Students Directory</h1>
          <p className="text-xs text-slate-500">
            Student accounts registered with grievance logging privileges at {currentUser?.institutionName?.split('(')[0]}
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students by name, roll no, dept..."
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll / CMS</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Institutional Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Complaints Filed</th>
                <th className="py-3 px-4">Account Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <span>{s.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{s.roll}</td>
                  <td className="py-3.5 px-4 text-slate-600">{s.dept}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.email}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{s.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.complaintsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                      {s.complaintsCount} tickets
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
