import { Link } from 'react-router-dom'
import {
  ArrowRight, Dumbbell, UtensilsCrossed, Activity, TrendingUp, Bot, Check, Sun, Moon,
  Flame, HeartPulse, Timer, Languages, Sparkles, LogIn, Zap, Trophy, Home,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useTheme } from '@/context/ThemeContext'

const FEATURES = [
  { icon: Dumbbell, title: 'Personalized Workouts', desc: 'AI-built weekly splits around your goal, level and equipment — home or gym. Swap any exercise with one tap.', tone: 'from-lime-400/20 to-emerald-500/10 text-emerald-500' },
  { icon: UtensilsCrossed, title: 'AI Nutrition', desc: 'Calorie & macro targets with meal-by-meal guidance that respects your food preferences and allergies.', tone: 'from-orange-400/20 to-amber-500/10 text-orange-500' },
  { icon: Activity, title: 'Body Analysis', desc: 'BMI, healthy weight range and estimated daily calorie needs — clear estimates for general wellness.', tone: 'from-sky-400/20 to-indigo-500/10 text-sky-500' },
  { icon: TrendingUp, title: 'Progress Tracking', desc: 'Weight trends, workout consistency and nutrition charts with weekly, monthly and all-time views.', tone: 'from-violet-400/20 to-fuchsia-500/10 text-violet-500' },
  { icon: Bot, title: 'Fitness Coach 24/7', desc: 'Chat in English, Urdu or Sindhi — even Roman script. Your coach knows your profile and plans.', tone: 'from-rose-400/20 to-pink-500/10 text-rose-500' },
]

const STEPS = [
  { n: '01', title: 'Create your account', desc: 'Sign up securely with Firebase — your data stays yours.' },
  { n: '02', title: 'Tell us about you', desc: 'A 2-minute onboarding captures your goal, level and preferences.' },
  { n: '03', title: 'Train, eat, improve', desc: 'Follow your AI plans, log progress and chat with your coach.' },
]

function MockCard() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="card relative z-10 overflow-hidden !rounded-3xl border-white/40 bg-white/90 p-5 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-zinc-900/90">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Today's Workout</p>
            <p className="mt-0.5 font-display text-lg font-bold text-zinc-900 dark:text-white">Full Body A · 40 min</p>
          </div>
          <span className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-500"><Flame size={12} /> Streak 12</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {[
            ['Bodyweight Squats', '3 × 12–15', '92%'],
            ['Push-ups', '3 × 8–14', '68%'],
            ['Front Plank', '3 × 45s', '45%'],
          ].map(([n, s, w]) => (
            <div key={n} className="rounded-xl border border-zinc-200/70 bg-white p-3 dark:border-white/[.06] dark:bg-white/[.04]">
              <div className="flex items-center justify-between text-[13px] font-semibold text-zinc-800 dark:text-zinc-100">
                <span>{n}</span><span className="text-zinc-400">{s}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" style={{ width: w }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2.5 text-sm font-bold text-zinc-950">
          Start Workout <ArrowRight size={16} />
        </div>
      </div>
      <div className="absolute -left-6 top-16 z-20 hidden animate-float rounded-2xl bg-white p-3 shadow-xl dark:bg-zinc-900 sm:block" style={{ animationDelay: '.8s' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 text-orange-500"><HeartPulse size={17} /></span>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">BMI</p>
            <p className="font-display text-sm font-bold text-zinc-900 dark:text-white">23.1 · Healthy</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-5 bottom-14 z-20 hidden animate-float rounded-2xl bg-white p-3 shadow-xl dark:bg-zinc-900 sm:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-500/15 text-violet-500"><Timer size={17} /></span>
          <div>
            <p className="text-[10px] font-bold uppercase text-zinc-400">Daily Calories</p>
            <p className="font-display text-sm font-bold text-zinc-900 dark:text-white">1,840 / 2,150</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const { isDark, toggleTheme } = useTheme()
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/75 backdrop-blur-xl dark:border-white/[.06] dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-5">
          <Logo textClassName="hidden min-[420px]:inline" />
          <nav className="hidden items-center gap-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 md:flex xl:gap-7">
            <a href="#features" className="transition hover:text-emerald-500">Features</a>
            <a href="#benefits" className="transition hover:text-emerald-500">Benefits</a>
            <a href="#how" className="transition hover:text-emerald-500">How it works</a>
            <a href="#coach" className="transition hover:text-emerald-500">Fitness Coach</a>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={toggleTheme} className="rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-white/[.06]" aria-label="Toggle theme">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <Link to="/login" className="btn-ghost px-2.5 py-2 min-[420px]:px-3.5" aria-label="Login">
              <LogIn size={16} /> <span className="hidden min-[420px]:inline">Login</span>
            </Link>
            <Link to="/signup" className="btn-primary shrink-0 whitespace-nowrap px-3 py-2 min-[520px]:px-3.5" aria-label="Get started — create account">
              <span className="min-[520px]:hidden">Start</span>
              <span className="hidden min-[520px]:inline">Get Started</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-b from-lime-300/20 to-transparent blur-3xl dark:from-lime-400/10" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime-500/30 bg-lime-400/10 px-3.5 py-1.5 text-xs font-semibold text-lime-600 dark:text-lime-300">
              <Sparkles size={13} /> AI-powered plans · Built around you
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.06] tracking-tight text-zinc-900 dark:text-white sm:text-5xl xl:text-[56px]">
              AI Fitness Coach
              <span className="mt-2 block gradient-text">Your Personal AI-Powered Fitness Companion</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-base lg:mx-0">
              Personalized workouts, nutrition guidance, progress tracking, and a Fitness Coach — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/signup" className="btn-primary px-6 py-3 text-[15px]">Get Started <ArrowRight size={16} /></Link>
              <Link to="/login" className="btn-outline px-6 py-3 text-[15px]">Login</Link>
            </div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-zinc-500 dark:text-zinc-400 lg:justify-start">
              {['Free to start', 'Secure Firebase auth', 'English · Urdu · Sindhi'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> {t}</span>
              ))}
            </div>
          </div>
          <div className="animate-slide-left"><MockCard /></div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Everything you need to <span className="gradient-text">get better</span></h2>
            <p className="mt-3 text-[15px] text-zinc-500 dark:text-zinc-400">One platform for training, nutrition, analysis and coaching — designed around your body and your goal.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`card card-hover animate-fade-up p-6 ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}`} style={{ animationDelay: `${i * 70}ms` }}>
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${f.tone}`}><f.icon size={22} /></span>
                <h3 className="mt-4 font-display text-lg font-bold text-zinc-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-5 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.25fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
              <Trophy size={13} /> Why AI Fitness Coach
            </span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Benefits that go <span className="gradient-text">beyond the gym</span></h2>
            <p className="mt-4 text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Most people don't fail from lack of effort — they fail from lack of a plan. Your Fitness Coach removes the guesswork so every workout and every meal moves you forward.
            </p>
            <Link to="/signup" className="btn-primary mt-7 px-5 py-2.5">Start seeing the benefits <ArrowRight size={15} /></Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Zap, title: 'Plans in seconds', desc: 'A full week of training and meals generated the moment you finish onboarding.' },
              { icon: Flame, title: 'Stay consistent', desc: 'Streaks, weekly targets and gentle reminders keep you showing up.' },
              { icon: Home, title: 'Train anywhere', desc: 'Complete home programs or full gym splits — switch anytime.' },
              { icon: UtensilsCrossed, title: 'Eat with confidence', desc: 'Meals matched to your calories, preferences and allergies.' },
              { icon: TrendingUp, title: 'See real progress', desc: 'Weight trends, consistency charts and milestone tracking.' },
              { icon: Bot, title: 'A coach in your corner', desc: '24/7 chat support in English, Urdu and Sindhi.' },
            ].map((b, i) => (
              <div key={b.title} className="card card-hover animate-fade-up p-5" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-lime-400/20 to-emerald-500/10 text-emerald-500"><b.icon size={18} /></span>
                <h3 className="mt-3 text-sm font-bold text-zinc-900 dark:text-white">{b.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI coach band */}
      <section id="coach" className="px-5 py-10">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-center dark:bg-zinc-900/60 sm:px-12">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[.06] px-3.5 py-1.5 text-xs font-semibold text-lime-300"><Languages size={13} /> Speaks your language</span>
          <h2 className="mx-auto mt-5 max-w-2xl font-display text-3xl font-bold text-white">A coach that answers in <span className="bg-gradient-to-r from-lime-300 to-emerald-400 bg-clip-text text-transparent">English, Urdu & Sindhi</span></h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
            Type in any script — even Roman Urdu like "aaj kya workout karun?" — and your coach replies in the same style, using your real profile data.
          </p>
          <div className="mx-auto mt-8 max-w-lg space-y-3">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-r from-lime-400 to-emerald-500 px-4 py-2.5 text-left text-sm font-semibold text-zinc-950">Aaj kya workout karun?</div>
            <div className="mr-auto w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/[.08] px-4 py-2.5 text-left text-sm text-zinc-100 ring-1 ring-white/10">
              Today's plan is ready! 💪 <strong>Full Body A</strong> — 40 minutes · 6 exercises. Tap Start Workout — you've got this!
            </div>
          </div>
          <Link to="/signup" className="btn-primary mt-9 px-6 py-3">Meet your Fitness Coach <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">Up and running in <span className="gradient-text">3 steps</span></h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="card card-hover animate-fade-up relative overflow-hidden p-6" style={{ animationDelay: `${i * 90}ms` }}>
                <span className="font-display text-5xl font-bold text-emerald-500/15 dark:text-lime-400/10">{s.n}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-zinc-900 dark:text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 pt-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-lime-400 to-emerald-500 px-6 py-14 text-center shadow-glow-lime sm:px-12">
          <h2 className="font-display text-3xl font-bold text-zinc-950 sm:text-4xl">Your transformation starts today</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] font-medium text-zinc-900/70">Join and get your first AI workout and diet plan within minutes of onboarding.</p>
          <Link to="/signup" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-7 py-3.5 text-[15px] font-bold text-white shadow-xl transition hover:scale-[1.03] hover:bg-zinc-900 active:scale-[.98]">
            Create free account <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/70 bg-white/60 dark:border-white/[.05] dark:bg-zinc-950/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              Your personal AI-powered fitness companion. General wellness guidance — not medical advice.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-500 dark:text-zinc-400">
              <li><a href="#features" className="transition hover:text-emerald-500">Features</a></li>
              <li><a href="#benefits" className="transition hover:text-emerald-500">Benefits</a></li>
              <li><a href="#how" className="transition hover:text-emerald-500">How it works</a></li>
              <li><a href="#coach" className="transition hover:text-emerald-500">Fitness Coach</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Account</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-500 dark:text-zinc-400">
              <li><Link to="/signup" className="transition hover:text-emerald-500">Sign up</Link></li>
              <li><Link to="/login" className="transition hover:text-emerald-500">Login</Link></li>
              <li><Link to="/forgot-password" className="transition hover:text-emerald-500">Reset password</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">Disclaimer</h4>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              BMI and calorie figures are estimates for general wellness purposes only and are not medical diagnoses.
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-200/70 py-5 text-center text-xs text-zinc-400 dark:border-white/[.05] dark:text-zinc-500">
          © 2026 AI Fitness Coach · Built with React, Firebase & love for fitness
        </div>
      </footer>
    </div>
  )
}
