const TONES = {
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  lime: 'border-lime-500/30 bg-lime-500/10 text-lime-700 dark:text-lime-400',
  orange: 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400',
  sky: 'border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400',
  violet: 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  zinc: 'border-zinc-400/30 bg-zinc-400/10 text-zinc-600 dark:text-zinc-300',
}

export default function Badge({ tone = 'zinc', children, className = '' }) {
  return <span className={`chip border ${TONES[tone] || TONES.zinc} ${className}`}>{children}</span>
}

export const DIFF_TONE = { Beginner: 'emerald', Intermediate: 'amber', Advanced: 'rose' }
