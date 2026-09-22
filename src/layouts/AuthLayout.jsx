import { Link } from 'react-router-dom'
import { Sparkles, Dumbbell, UtensilsCrossed, Bot } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const HIGHLIGHTS = [
  { icon: Dumbbell, text: 'AI-personalized workout plans' },
  { icon: UtensilsCrossed, text: 'Nutrition guidance for your goal' },
  { icon: Bot, text: '24/7 coach chat — English, Urdu & Sindhi' },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-[420px] w-[420px] rounded-full bg-lime-400/15 blur-3xl" />
        <Link to="/" className="relative z-10"><Logo withText={false} size="lg" /></Link>
        <div className="relative z-10">
          <h2 className="max-w-md font-display text-4xl font-bold leading-tight text-white">
            Your personal <span className="bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">AI-powered</span> fitness companion.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-400">
            Personalized workouts, nutrition guidance, progress tracking, and a Fitness Coach — all in one place.
          </p>
          <ul className="mt-10 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3.5 text-sm text-zinc-300">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[.06] text-lime-300 ring-1 ring-white/10"><Icon size={16} /></span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-zinc-500">© 2026 AI Fitness Coach · General wellness guidance, not medical advice.</p>
      </aside>

      {/* Form panel */}
      <main className="flex min-h-dvh flex-col items-center justify-center px-5 py-6 sm:px-10 sm:py-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-5 flex flex-col items-center text-center sm:mb-8 lg:items-start lg:text-left">
            <Link to="/" className="mb-4 lg:hidden"><Logo /></Link>
            <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-600 dark:text-lime-300">
              <Sparkles size={12} /> Welcome to AI Fitness Coach
            </span>
            <h1 className="font-display text-[28px] font-bold tracking-tight text-zinc-900 dark:text-white">{title}</h1>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          </div>
          {children}
          {footer && <div className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400 sm:mt-7">{footer}</div>}
        </div>
      </main>
    </div>
  )
}
