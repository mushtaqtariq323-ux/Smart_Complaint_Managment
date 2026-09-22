export default function ProgressRing({
  value = 0, size = 96, stroke = 9, color = '#34d399', trackColor, label, sub, children, className = '',
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const id = `ring-${Math.random().toString(36).slice(2, 8)}`
  return (
    <div className={`relative inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
          className={trackColor ? '' : 'stroke-zinc-200 dark:stroke-white/10'} stroke={trackColor} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.21,.61,.35,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        {children || (
          <div>
            <div className="font-display text-lg font-bold leading-none text-zinc-900 dark:text-white">{label}</div>
            {sub && <div className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">{sub}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
