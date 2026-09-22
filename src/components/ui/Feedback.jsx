import { AlertTriangle, Loader2 } from 'lucide-react'
import logoMark from '@/assets/logo-mark.png'

export const Skeleton = ({ className = '' }) => <div className={`skeleton ${className}`} />

export const PageLoader = ({ label = 'Checking your session…' }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-5">
    <div className="relative">
      <img
        src={logoMark}
        alt="AI Fitness Coach"
        className="h-16 w-16 rounded-2xl object-cover shadow-[0_0_30px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/40"
      />
      <span className="absolute -inset-3 -z-10 animate-ping rounded-3xl bg-cyan-400/20" />
    </div>
    <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
      <Loader2 size={15} className="animate-spin text-cyan-500" />
      {label}
    </div>
  </div>
)

export const InlineLoader = ({ label = 'Loading…' }) => (
  <div className="flex items-center justify-center gap-2 py-10 text-sm text-zinc-500 dark:text-zinc-400">
    <Loader2 size={16} className="animate-spin text-emerald-500" />
    {label}
  </div>
)

export function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 px-6 py-12 text-center dark:border-white/10 ${className}`}>
      {Icon && (
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-lime-400/15 to-emerald-500/15 text-emerald-500">
          <Icon size={26} />
        </span>
      )}
      <h3 className="font-display text-base font-semibold text-zinc-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export const ErrorState = ({ message = 'Something went wrong while loading your data.', onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center dark:border-rose-500/20 dark:bg-rose-500/5">
    <AlertTriangle size={26} className="text-rose-500" />
    <p className="max-w-sm text-sm text-rose-600 dark:text-rose-300">{message}</p>
    {onRetry && <button onClick={onRetry} className="btn-outline px-4 py-2 text-xs">Try again</button>}
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
    </div>
    <div className="grid gap-5 lg:grid-cols-5">
      <Skeleton className="h-72 rounded-2xl lg:col-span-3" />
      <Skeleton className="h-72 rounded-2xl lg:col-span-2" />
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <Skeleton className="h-56 rounded-2xl" />
      <Skeleton className="h-56 rounded-2xl" />
    </div>
  </div>
)
