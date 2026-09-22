import { useMemo, useState } from 'react'

const W = 620
const H = 220
const PAD = { t: 18, r: 14, b: 30, l: 40 }

/** Smooth gradient-area line chart (hand-rolled SVG, no chart lib). */
export default function LineChart({ data = [], color = '#34d399', unit = '', height = H }) {
  const [hover, setHover] = useState(null)
  const pts = useMemo(() => {
    const vals = data.map((d) => d.value).filter((v) => v != null)
    if (vals.length < 2) return null
    const min = Math.min(...vals)
    const max = Math.max(...vals)
    const span = max - min || 1
    const iw = W - PAD.l - PAD.r
    const ih = height - PAD.t - PAD.b
    const step = iw / (data.length - 1)
    return {
      min, max,
      points: data.map((d, i) => ({
        x: PAD.l + i * step,
        y: PAD.t + ih - (((d.value ?? min) - min) / span) * ih,
        ...d,
      })),
    }
  }, [data, height])

  if (!pts) {
    return (
      <div className="grid h-40 place-items-center text-sm text-zinc-400 dark:text-zinc-500">
        Not enough data yet — add at least two entries.
      </div>
    )
  }

  const path = pts.points
    .map((p, i, a) => {
      if (i === 0) return `M ${p.x} ${p.y}`
      const prev = a[i - 1]
      const cx = (prev.x + p.x) / 2
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`
    })
    .join(' ')
  const area = `${path} L ${pts.points[pts.points.length - 1].x} ${height - PAD.b} L ${pts.points[0].x} ${height - PAD.b} Z`
  const gid = `lg-${color.replace('#', '')}`

  const ticks = [pts.max, (pts.max + pts.min) / 2, pts.min].map((v) => Math.round(v * 10) / 10)

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="w-full" onMouseLeave={() => setHover(null)}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => {
        const y = PAD.t + (height - PAD.t - PAD.b) * (i / (ticks.length - 1))
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} className="stroke-zinc-200 dark:stroke-white/[.07]" strokeDasharray="3 5" />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[10px]">{t}</text>
          </g>
        )
      })}
      <path d={area} fill={`url(#${gid})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {pts.points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x} cy={p.y} r={hover === i ? 5.5 : 3.5}
            fill={hover === i ? color : '#fff'}
            stroke={color} strokeWidth="2"
            style={{ transition: 'r .15s' }}
          />
          <rect x={p.x - 16} y={0} width={32} height={height} fill="transparent" onMouseEnter={() => setHover(i)} />
          {i % Math.ceil(pts.points.length / 7) === 0 && (
            <text x={p.x} y={height - 8} textAnchor="middle" className="fill-zinc-400 text-[10px]">{p.label}</text>
          )}
        </g>
      ))}
      {hover != null && (() => {
        const p = pts.points[hover]
        const boxW = 86
        const bx = Math.min(Math.max(p.x - boxW / 2, 4), W - boxW - 4)
        return (
          <g pointerEvents="none">
            <rect x={bx} y={Math.max(p.y - 44, 2)} width={boxW} height={34} rx={8} className="fill-zinc-900 dark:fill-zinc-800" stroke={color} strokeOpacity="0.4" />
            <text x={bx + boxW / 2} y={Math.max(p.y - 44, 2) + 14} textAnchor="middle" className="fill-white text-[10px] font-semibold">{p.label}</text>
            <text x={bx + boxW / 2} y={Math.max(p.y - 44, 2) + 27} textAnchor="middle" className="fill-zinc-300 text-[10px]">{p.value} {unit}</text>
          </g>
        )
      })()}
    </svg>
  )
}
