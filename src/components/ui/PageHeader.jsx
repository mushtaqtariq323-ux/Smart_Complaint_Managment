export default function PageHeader({ title, subtitle, actions, badge, compact = false }) {
  return (
    <div className={`${compact ? "mb-3" : "mb-6"} flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="animate-fade-up">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
          {badge}
        </div>
        {subtitle && (
          <p className={compact ? 'mt-1 hidden text-[13px] text-zinc-500 sm:block dark:text-zinc-400' : 'mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400'}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}
