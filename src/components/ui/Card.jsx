export default function Card({ className = '', hover = false, children, ...props }) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-lime-400/20 to-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Icon size={19} />
          </span>
        )}
        <div>
          <h3 className="font-display text-[15px] font-semibold leading-tight text-zinc-900 dark:text-white">{title}</h3>
          {subtitle && <p className="mt-0.5 text-[13px] text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}
