import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Activity, Dumbbell, UtensilsCrossed, TrendingUp, Bot, User, Settings as SettingsIcon, ListChecks,
  Menu, X, Sun, Moon, Bell, LogOut, ChevronRight, Flame, Trophy, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import Logo from '@/components/ui/Logo'
import { todayPlanDay } from '@/services/ai/workoutGenerator'
import { workoutStreak } from '@/utils/dates'
import { weeklyWorkoutTarget } from '@/utils/calculate'

const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, sub: 'Your fitness at a glance' },
  { to: '/body-analysis', label: 'Body Analysis', icon: Activity, sub: 'BMI & calorie estimates' },
  { to: '/workout', label: 'Workout Plan', icon: Dumbbell, sub: 'Your AI-generated training split' },
  { to: '/diet', label: 'Diet Plan', icon: UtensilsCrossed, sub: 'Nutrition guidance & meals' },
  { to: '/planner', label: 'My Planner', icon: ListChecks, sub: 'Build your own plan & follow it' },
  { to: '/progress', label: 'Progress', icon: TrendingUp, sub: 'Charts, history & logging' },
  { to: '/ai-coach', label: 'Fitness Coach', icon: Bot, sub: 'Chat in English, Urdu or Sindhi' },
  { to: '/profile', label: 'My Profile', icon: User, sub: 'Your account & fitness info' },
  { to: '/settings', label: 'Settings', icon: SettingsIcon, sub: 'Preferences & security' },
]

function NavItems({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2 scrollbar-thin">
      {NAV.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200
            ${isActive
              ? 'bg-gradient-to-r from-lime-400/15 to-emerald-500/10 text-emerald-600 shadow-[inset_2px_0_0_0] shadow-lime-400 dark:text-emerald-400'
              : 'text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[.05] dark:hover:text-white'}`}
        >
          {({ isActive }) => (
            <>
              <Icon size={18} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-lime-500 dark:text-lime-400' : ''}`} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserChip({ onLogout }) {
  const { profile, user } = useAuth()
  const initial = (profile?.name || user?.email || 'A').charAt(0).toUpperCase()
  return (
    <div className="border-t border-zinc-200 p-4 dark:border-white/[.06]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 font-display text-sm font-bold text-zinc-950">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{profile?.name || 'Athlete'}</p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user?.email}</p>
        </div>
        <button onClick={onLogout} className="rounded-lg p-2 text-zinc-400 transition hover:bg-rose-500/10 hover:text-rose-500" title="Logout" aria-label="Logout">
          <LogOut size={17} />
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout() {
  const [drawer, setDrawer] = useState(false)
  const [bell, setBell] = useState(false)
  const [bannerClosed, setBannerClosed] = useState(false)
  const { pathname } = useLocation()
  const { logout, user, profile, fitness, dbError } = useAuth()
  const { plan, logs, dataError } = useData()
  const { isDark, toggleTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => { setDrawer(false); setBell(false); window.scrollTo({ top: 0 }) }, [pathname])

  const current = NAV.find((n) => pathname.startsWith(n.to))
  const today = todayPlanDay(plan)
  const streak = useMemo(() => workoutStreak(logs), [logs])

  const notifications = useMemo(() => {
    const list = []
    if (today?.type === 'workout') list.push({ icon: Dumbbell, tone: 'text-emerald-500', text: `Today's workout "${today.focus}" is ready (${today.duration} min).` })
    else if (today) list.push({ icon: CheckCircle2, tone: 'text-sky-500', text: 'Recovery day — go for a light walk or stretch.' })
    if (streak >= 3) list.push({ icon: Flame, tone: 'text-orange-500', text: `You're on a ${streak}-day workout streak. Keep it alive!` })
    if (streak >= 7) list.push({ icon: Trophy, tone: 'text-lime-500', text: `One full week streak — outstanding commitment!` })
    const target = weeklyWorkoutTarget(fitness?.experienceLevel)
    const done = logs.filter((l) => l.date >= new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)).length
    if (done >= target) list.push({ icon: Trophy, tone: 'text-violet-500', text: `Weekly target complete: ${done}/${target} workouts.` })
    return list.slice(0, 4)
  }, [today, streak, fitness, logs])

  const doLogout = async () => {
    try { await logout(); toast.success('Logged out. See you soon!', 'Take care 👋'); navigate('/') } catch { toast.error('Could not log out. Try again.') }
  }

  const storageBlocked = (dbError || dataError) && !bannerClosed

  return (
    <div className="min-h-screen">
      {/* ── Storage blocked banner ── */}
      {storageBlocked && (
        <div className="fixed inset-x-0 top-0 z-[60] border-b border-amber-400/30 bg-amber-400/10 px-4 py-2.5 backdrop-blur-md lg:pl-[268px]">
          <div className="mx-auto flex max-w-6xl items-start gap-3 sm:items-center">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500 sm:mt-0" />
            <p className="min-w-0 flex-1 text-[12.5px] leading-relaxed text-amber-700 dark:text-amber-300">
              <strong>Storage access blocked.</strong>
              <span className="hidden sm:inline">
                {' '}This Firebase project's security rules are preventing data from loading or saving. Open the Firebase console → Firestore Database → Rules and deploy the included <code className="rounded bg-amber-500/15 px-1">firestore.rules</code> file from the project root. Everything else keeps working — reload after fixing the rules and your data syncs automatically.
              </span>
              <span className="sm:hidden"> Deploy <code className="rounded bg-amber-500/15 px-1">firestore.rules</code> (project root) in the Firebase console.</span>
            </p>
            <button onClick={() => setBannerClosed(true)} className="rounded-md p-1 text-amber-600 transition hover:bg-amber-500/15 dark:text-amber-300" aria-label="Dismiss">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* ── Sidebar (desktop) ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 hidden w-[268px] flex-col border-r border-zinc-200/80 bg-white/85 backdrop-blur-xl dark:border-white/[.06] dark:bg-zinc-950/80 lg:flex ${storageBlocked ? '!top-[54px]' : ''}`}>
        <div className="flex h-[68px] items-center px-6">
          <Logo />
        </div>
        <NavItems />
        <UserChip onLogout={doLogout} />
      </aside>

      {/* ── Drawer (mobile) ── */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-white shadow-2xl dark:bg-zinc-950 animate-fade-in">
            <div className="flex h-[68px] items-center justify-between px-5">
              <Logo />
              <button onClick={() => setDrawer(false)} className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/10" aria-label="Close menu"><X size={18} /></button>
            </div>
            <NavItems onNavigate={() => setDrawer(false)} />
            <UserChip onLogout={doLogout} />
          </aside>
        </div>
      )}

      {/* ── Topbar ── */}
      <header className={`sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-xl dark:border-white/[.06] dark:bg-zinc-950/75 lg:pl-[268px] ${storageBlocked ? '!top-[54px]' : ''}`}>
        <div className="flex h-[68px] items-center gap-3 px-4 sm:px-6">
          <button onClick={() => setDrawer(true)} className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-white/[.06] lg:hidden" aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-[17px] font-bold text-zinc-900 dark:text-white">{current?.label || 'AI Fitness Coach'}</h2>
            <p className="hidden truncate text-xs text-zinc-500 dark:text-zinc-400 sm:block">{current?.sub || 'User panel'}</p>
          </div>

          <button onClick={toggleTheme} className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[.06] dark:hover:text-lime-300" title={isDark ? 'Light mode' : 'Dark mode'} aria-label="Toggle theme">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative">
            <button onClick={() => setBell((b) => !b)} className="relative rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-200/60 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[.06] dark:hover:text-white" aria-label="Notifications">
              <Bell size={18} />
              {notifications.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 ring-2 ring-white dark:ring-zinc-950" />}
            </button>
            {bell && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setBell(false)} />
                <div className="absolute right-0 z-20 mt-2 w-[320px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl animate-scale-in dark:border-white/10 dark:bg-zinc-900">
                  <div className="border-b border-zinc-100 px-4 py-3 text-sm font-bold dark:border-white/[.06] dark:text-white">Notifications</div>
                  <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin">
                    {notifications.length === 0 && <p className="px-3 py-6 text-center text-sm text-zinc-400">All caught up! 🎉</p>}
                    {notifications.map((n, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-100 dark:hover:bg-white/[.05]">
                        <n.icon size={16} className={`mt-0.5 shrink-0 ${n.tone}`} />
                        <p className="text-[13px] leading-snug text-zinc-600 dark:text-zinc-300">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={() => navigate('/profile')} className="group flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition hover:bg-zinc-200/60 dark:hover:bg-white/[.06] sm:pr-2.5" title="My profile">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-lime-400 to-emerald-500 font-display text-[13px] font-bold text-zinc-950">
              {(profile?.name || user?.email || 'A').charAt(0).toUpperCase()}
            </span>
            <ChevronRight size={14} className="hidden text-zinc-400 transition group-hover:translate-x-0.5 sm:block" />
          </button>
        </div>
      </header>

      {/* ── Content ── */}
      <main className={`min-h-[calc(100vh-68px)] px-4 sm:px-6 lg:pl-[300px] lg:pr-8 ${pathname === '/ai-coach' ? 'py-4' : 'py-6'}`}>
        <div className="mx-auto max-w-6xl">
          <Outlet />
          {/* The coach page is a full-height app view — footer would force page scroll */}
          {pathname !== '/ai-coach' && (
            <footer className="mt-12 border-t border-zinc-200/70 py-5 text-center text-xs text-zinc-400 dark:border-white/[.05] dark:text-zinc-500">
              AI Fitness Coach · Estimates are for general wellness purposes only and are not medical advice.
            </footer>
          )}
        </div>
      </main>
    </div>
  )
}
