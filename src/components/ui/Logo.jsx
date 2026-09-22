import logoMark from '@/assets/logo-mark.png'

/**
 * Official app branding — the AI Fitness Coach emblem
 * (muscular torso + barbell with a blue/cyan tech glow).
 * Used in the sidebar, mobile header, auth pages, landing, onboarding, 404.
 */
export default function Logo({ size = 'md', withText = true, textClassName = '' }) {
  const dims = size === 'lg' ? 'h-11 w-11' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src={logoMark}
        alt="AI Fitness Coach"
        className={`${dims} shrink-0 rounded-xl object-cover shadow-[0_0_16px_rgba(34,211,238,0.28)] ring-1 ring-cyan-400/30`}
      />
      {withText && (
        <span className={`font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-white ${textClassName}`}>
          AI<span className="gradient-text">Fitness</span>Coach
        </span>
      )}
    </span>
  )
}
