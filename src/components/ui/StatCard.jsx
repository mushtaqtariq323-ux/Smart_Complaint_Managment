const TONES = {
  emerald: 'from-emerald-500/15 to-lime-500/10 text-emerald-600 dark:text-emerald-400',
  orange: 'from-orange-500/15 to-amber-500/10 text-orange-600 dark:text-orange-400',
  sky: 'from-sky-500/15 to-indigo-500/10 text-sky-600 dark:text-sky-400',
  violet: 'from-violet-500/15 to-fuchsia-500/10 text-violet-600 dark:text-violet-400',
  rose: 'from-rose-500/15 to-pink-500/10 text-rose-600 dark:text-rose-400',
  lime: 'from-lime-500/20 to-emerald-500/10 text-lime-700 dark:text-lime-400',
  zinc: 'from-zinc-500/10 to-zinc-400/10 text-zinc-600 dark:text-zinc-300',
}

export default function StatCard({ icon: Icon, label, value, unit, sub, tone = 'emerald', delay = 0, className = '' }) {
  return (
    <div className={`card card-hover animate-fade-up p-4 ${className}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className={`grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br ${TONES[tone]}`}>
            <Icon size={16} />
          </span>
        )}
        <span className="text-[12px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</span>
      </div>
      <div className="mt-3 font-display text-[26px] font-bold leading-none text-zinc-900 dark:text-white">
        {value}{unit && <span className="ml-1 text-sm font-semibold text-zinc-400">{unit}</span>}
      </div>
      {sub && <div className="mt-1.5 text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">{sub}</div>}
    </div>
  )
}
