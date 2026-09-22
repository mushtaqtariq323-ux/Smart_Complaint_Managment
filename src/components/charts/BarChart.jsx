const W = 620
const H = 220
const PAD = { t: 18, r: 14, b: 30, l: 40 }

/** Rounded bar chart with optional target line (hand-rolled SVG). */
export default function BarChart({ data = [], target, color = '#34d399', mutedColor, unit = '' }) {
  const vals = data.map((d) => d.value || 0)
  const max = Math.max(target || 0, ...vals, 1) * 1.15
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const gap = 8
  const bw = Math.max(6, iw / data.length - gap)
  const yFor = (v) => PAD.t + ih - (v / max) * ih
  const ticks = [0, max / 2, Math.round(max * 0.9)].map((v) => Math.round(v))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {ticks.map((t, i) => {
        const y = yFor(t)
        return (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y} y2={y} className="stroke-zinc-200 dark:stroke-white/[.07]" strokeDasharray="3 5" />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" className="fill-zinc-400 text-[10px]">{t}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const v = d.value || 0
        const x = PAD.l + i * (iw / data.length) + gap / 2
        const y = yFor(v)
        const hit = target ? v >= target * 0.9 : true
        const fill = v === 0 ? undefined : hit ? color : (mutedColor || '#fbbf24')
        return (
          <g key={i}>
            <rect x={x} y={v === 0 ? yFor(2) - 2 : y} width={bw} height={v === 0 ? 2 : yFor(0) - y} rx={Math.min(6, bw / 2)}
              fill={fill} opacity={v === 0 ? 0.35 : 1}>
              <title>{`${d.label}: ${v} ${unit}`}</title>
            </rect>
            <rect x={x - 4} y={PAD.t} width={bw + 8} height={ih} fill="transparent" />
            {(data.length <= 12 || i % Math.ceil(data.length / 8) === 0) && (
              <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="fill-zinc-400 text-[10px]">{d.label}</text>
            )}
          </g>
        )
      })}
      {target != null && (
        <g>
          <line x1={PAD.l} x2={W - PAD.r} y1={yFor(target)} y2={yFor(target)} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="6 5" opacity="0.8" />
          <text x={W - PAD.r} y={yFor(target) - 6} textAnchor="end" className="fill-rose-400 text-[10px] font-semibold">target {target} {unit}</text>
        </g>
      )}
    </svg>
  )
}
