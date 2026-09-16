import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Filter,
  ExternalLink
} from 'lucide-react';

export const AdminNotifications: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, navigate } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'urgent' | 'updates'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'unread') return !n.read;
      if (activeFilter === 'urgent') return n.title.toLowerCase().includes('urgent') || n.message.toLowerCase().includes('urgent');
      if (activeFilter === 'updates') return n.title.toLowerCase().includes('status') || n.title.toLowerCase().includes('assigned') || n.message.toLowerCase().includes('resolved');
      return true;
    });
  }, [notifications, activeFilter]);

  const getNotificationIcon = (title: string, message: string) => {
    const text = (title + ' ' + message).toLowerCase();
    if (text.includes('urgent') || text.includes('hazard') || text.includes('critical')) {
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    }
    if (text.includes('resolved') || text.includes('approved') || text.includes('completed')) {
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    }
    return <FileText className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin System Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative feed for incident dispatches, triage updates, technician progress, and security alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            id="admin-mark-all-read"
            onClick={markAllNotificationsAsRead}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-xs"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('unread')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'unread' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setActiveFilter('urgent')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'urgent' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Urgent Alerts
        </button>
        <button
          onClick={() => setActiveFilter('updates')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeFilter === 'updates' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Status Updates
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs space-y-2">
            <Bell className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-700 text-sm">No notifications found</p>
            <p className="text-slate-400">Your administrative inbox has no alerts matching this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex items-start gap-4 ${
                !n.read ? 'bg-emerald-50/20' : ''
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                !n.read ? 'bg-emerald-100/70 border border-emerald-200' : 'bg-slate-100 text-slate-400'
              }`}>
                {getNotificationIcon(n.title, n.message)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs sm:text-sm font-bold ${!n.read ? 'text-slate-900' : 'text-slate-700'}`}>
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>

                <div className="mt-3 flex items-center justify-between pt-1">
                  {n.complaintId ? (
                    <button
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        navigate('admin', 'complaint-details', n.complaintId);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                    >
                      <span>Inspect Ticket: {n.complaintId}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span />
                  )}

                  {!n.read && (
                    <button
                      onClick={() => markNotificationAsRead(n.id)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
