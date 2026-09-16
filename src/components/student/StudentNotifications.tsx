import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCheck, Clock, FileText, ChevronRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { formatRelativeTime } from '../../utils/complaintUtils';

export const StudentNotifications: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, navigate } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter notifications targeting current student
  const studentNotifs = notifications.filter(
    (n) => !n.userId || n.userId === currentUser?.id || n.userId === 'user-student-1'
  );

  const unreadCount = studentNotifs.filter((n) => !n.read).length;

  const filteredNotifs = studentNotifs.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Notifications & Alerts</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">Live updates regarding your filed grievances, technician dispatches, and status changes</p>
        </div>

        {studentNotifs.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center p-0.5 rounded-xl border border-slate-200 bg-slate-100 text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({studentNotifs.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  filter === 'unread' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={markAllNotificationsAsRead}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Bell className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700 text-sm">No notifications found</p>
            <p className="text-slate-400 mt-1">
              {filter === 'unread' ? "You've read all your notifications!" : 'No recent system notifications for your account.'}
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              id={`notif-item-${n.id}`}
              onClick={() => {
                markNotificationAsRead(n.id);
                if (n.complaintId) {
                  navigate('student', 'complaint-details', n.complaintId);
                }
              }}
              className={`p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-start gap-3.5 ${
                !n.read ? 'bg-emerald-50/40' : ''
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${!n.read ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-xs font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {formatRelativeTime(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                {n.complaintId && (
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                    <span>Inspect Ticket {n.complaintId}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
