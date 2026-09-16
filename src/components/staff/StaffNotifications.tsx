import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Sparkles,
  Inbox,
  Filter
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/complaintUtils';

export const StaffNotifications: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead, navigate } = useApp();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Filter notifications targeted to this user or general faculty updates
  const myNotifications = notifications.filter(
    (n) => !n.userId || n.userId === currentUser?.id
  );

  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const displayedNotifications = filter === 'unread' 
    ? myNotifications.filter((n) => !n.read) 
    : myNotifications;

  const handleNotificationClick = (n: typeof notifications[0]) => {
    if (!n.read) {
      markNotificationAsRead(n.id);
    }
    if (n.complaintId) {
      navigate('staff', 'complaint-details', n.complaintId);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'assigned':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'status_change':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'announcement':
        return <FileText className="w-5 h-5 text-amber-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Faculty Notifications</h1>
          <p className="text-xs text-slate-500">
            Real-time updates regarding status changes, technician assignments, and admin remarks
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              id="staff-mark-all-read-btn"
              onClick={markAllNotificationsAsRead}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All ({myNotifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
            filter === 'unread'
              ? 'bg-blue-700 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${filter === 'unread' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'}`}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {displayedNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Inbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filter === 'unread'
                ? 'You are all caught up! When technicians or administrators update your complaints, alerts will appear here.'
                : 'No alerts have been recorded for your account yet.'}
            </p>
          </div>
        ) : (
          displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs sm:text-sm font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>

                {notif.complaintId && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {notif.complaintId}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1">
                      <span>View Ticket Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
