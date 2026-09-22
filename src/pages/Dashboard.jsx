import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Scale, Target, Activity, Flame, Utensils, CalendarCheck, Play, CheckCircle2, TrendingUp,
  Dumbbell, Plus, Timer, Sparkles, ArrowRight, Info, Zap, Bot,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import Badge, { DIFF_TONE } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressRing from '@/components/ui/ProgressRing'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { DashboardSkeleton, EmptyState } from '@/components/ui/Feedback'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import WorkoutRunner from '@/components/WorkoutRunner'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { todayPlanDay } from '@/services/ai/workoutGenerator'
import { calcBMI, bmiCategory, calcMacroTargets, weeklyWorkoutTarget } from '@/utils/calculate'
import { lastNDays, formatDate, workoutStreak, weekStartKey, dateKey } from '@/utils/dates'

function QuickLogModal({ open, onClose }) {
  const { upsertEntry, todayEntry } = useData()
  const toast = useToast()
  const [form, setForm] = useState({ calories: todayEntry?.calories ?? '', protein: todayEntry?.protein ?? '' })
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      await upsertEntry({
        calories: form.calories === '' ? null : Number(form.calories),
        protein: form.protein === '' ? null : Number(form.protein),
      })
      toast.success("Today's nutrition updated.")
      onClose()
    } catch { toast.error('Could not save. Try again.') } finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Log today's intake" subtitle="These update your nutrition rings and charts.">
      <div className="space-y-4">
        <Input label="Calories consumed (kcal)" type="number" min="0" placeholder="e.g. 1650" value={form.calories} onChange={set('calories')} />
        <Input label="Protein (grams)" type="number" min="0" placeholder="e.g. 110" value={form.protein} onChange={set('protein')} />
        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={saving} onClick={save}>Save</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function Dashboard() {
  const { profile, fitness } = useAuth()
  const { plan, dietPlan, entries, logs, todayEntry, dataLoading, logWorkout } = useData()
  const navigate = useNavigate()
  const toast = useToast()
  const [runner, setRunner] = useState(false)
  const [quickLog, setQuickLog] = useState(false)
  const [logging, setLogging] = useState(false)

  const today = todayPlanDay(plan)
  const targets = dietPlan?.targets || calcMacroTargets(fitness || {})
  const streak = useMemo(() => workoutStreak(logs), [logs])
  const weeklyTarget = weeklyWorkoutTarget(fitness?.experienceLevel)
  const weeklyDone = useMemo(() => logs.filter((l) => l.date >= weekStartKey()).length, [logs])
  const weeklyPct = Math.min(100, Math.round((weeklyDone / weeklyTarget) * 100))

  const latestWeight = useMemo(() => entries.find((e) => e.weight)?.weight ?? fitness?.weight ?? null, [entries, fitness])
  const bmi = latestWeight && fitness?.height ? calcBMI(latestWeight, fitness.height) : null
  const cat = bmiCategory(bmi)
  const consumed = todayEntry?.calories || 0
  const calPct = targets?.calories ? Math.min(100, Math.round((consumed / targets.calories) * 100)) : 0

  const weightData = useMemo(() => [...entries]
    .filter((e) => e.weight)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14)
    .map((e) => ({ label: formatDate(e.date), value: e.weight })), [entries])

  const weekCalories = useMemo(() => {
    const keys = lastNDays(7)
    return keys.map((k) => ({ label: formatDate(k, { weekday: 'short' }), value: entries.find((e) => e.date === k)?.calories || 0 }))
  }, [entries])

  const todayLogged = logs.some((l) => l.date === dateKey())

  const markCompleted = async () => {
    setLogging(true)
    try {
      await logWorkout({ date: dateKey(), name: today?.focus || 'Workout', focus: today?.focus, duration: today?.duration || 30, exercisesTotal: today?.exercises?.length || 0, exercisesDone: today?.exercises?.length || 0 })
      toast.success('Workout marked as completed. Streak updated! 🔥')
    } catch { toast.error('Could not log the workout.') } finally { setLogging(false) }
  }

  if (dataLoading) return <DashboardSkeleton />

  if (!plan || !dietPlan) {
    return (
      <>
        <PageHeader title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Athlete'}! 👋`} subtitle="Let's pick up where you left off." />
        <EmptyState
          icon={Sparkles}
          title="Your AI plans aren't generated yet"
          description="Generate your personalized workout and diet plans — it takes just a few seconds and uses your fitness profile."
          action={<Button icon={<Sparkles size={15} />} onClick={() => navigate('/workout')}>Go to Workout Plan</Button>}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title={`Welcome back, ${profile?.name?.split(' ')[0] || 'Athlete'}! 👋`}
        subtitle={`${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} · Goal: ${fitness?.goal || 'General Fitness'}`}
        actions={<Button variant="outline" icon={<Sparkles size={15} />} onClick={() => navigate('/ai-coach')}>Ask Fitness Coach</Button>}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <StatCard delay={0} icon={Scale} tone="sky" label="Current Weight" value={latestWeight ?? '—'} unit="kg" sub={entries.find((e) => e.weight) ? 'Latest logged entry' : 'From your profile'} />
        <StatCard delay={60} icon={Target} tone="violet" label="Goal Weight" value={fitness?.goalWeight ?? '—'} unit="kg" sub={fitness?.goalWeight ? `${(latestWeight - fitness.goalWeight).toFixed(1)} kg to go` : 'Set one in onboarding'} />
        <StatCard delay={120} icon={Activity} tone={cat.tone === 'Healthy' || cat.tone === 'emerald' ? 'emerald' : 'orange'} label="BMI" value={bmi ?? '—'} sub={bmi ? `${cat.label} · estimate` : 'Add height & weight'} />
        <StatCard delay={180} icon={Flame} tone="orange" label="Daily Calories" value={targets?.calories?.toLocaleString() ?? '—'} unit="kcal" sub={`${consumed.toLocaleString()} consumed today`} />
        <StatCard delay={240} icon={Zap} tone="lime" label="Workout Streak" value={streak} unit={streak === 1 ? 'day' : 'days'} sub={streak > 0 ? 'Keep the chain alive!' : 'Log a workout to start'} />
        <StatCard delay={300} icon={CalendarCheck} tone="emerald" label="Weekly Progress" value={`${weeklyDone}/${weeklyTarget}`} sub="workouts this week" />
      </div>

      {/* Today's workout + nutrition */}
      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <Card className="animate-fade-up p-6 lg:col-span-3" style={{ animationDelay: '80ms' }}>
          <CardHeader
            icon={Dumbbell}
            title="Today's Workout"
            subtitle={today?.day || 'Rest day'}
            action={<Badge tone={today?.type === 'rest' ? 'sky' : DIFF_TONE[today?.difficulty] || 'emerald'}>{today?.type === 'rest' ? 'Recovery' : today?.difficulty}</Badge>}
          />
          {today?.type === 'rest' ? (
            <div className="mt-5 rounded-2xl border border-sky-500/25 bg-sky-500/[.06] p-5">
              <p className="font-display text-base font-bold text-sky-600 dark:text-sky-300">Active Recovery 😌</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{today.suggestion}</p>
            </div>
          ) : (
            <>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div>
                  <p className="font-display text-2xl font-bold text-zinc-900 dark:text-white">{today?.focus}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{fitness?.workoutPreference} · {plan.preference}</p>
                </div>
                <div className="flex gap-6 text-center">
                  <div><p className="font-display text-lg font-bold text-emerald-500">{today?.duration}<span className="text-xs"> min</span></p><p className="text-[11px] uppercase tracking-wide text-zinc-400">Duration</p></div>
                  <div><p className="font-display text-lg font-bold text-emerald-500">{today?.exercises?.length}</p><p className="text-[11px] uppercase tracking-wide text-zinc-400">Exercises</p></div>
                </div>
              </div>
              <ul className="mt-5 space-y-2">
                {today?.exercises?.slice(0, 4).map((ex) => (
                  <li key={ex.id} className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-zinc-50 px-3.5 py-2.5 text-sm dark:border-white/[.06] dark:bg-white/[.03]">
                    <span className="font-medium text-zinc-700 dark:text-zinc-200">{ex.name}</span>
                    <span className="text-xs text-zinc-400">{ex.sets} × {ex.reps !== '—' ? ex.reps : ex.duration}</span>
                  </li>
                ))}
                {(today?.exercises?.length || 0) > 4 && (
                  <li className="px-3.5 text-xs text-zinc-400">+ {today.exercises.length - 4} more on the Workout page</li>
                )}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button icon={<Play size={15} />} onClick={() => setRunner(true)}>{todayLogged ? 'Restart Workout' : 'Start Workout'}</Button>
                <Button variant="outline" loading={logging} icon={<CheckCircle2 size={15} />} onClick={markCompleted} disabled={todayLogged}>
                  {todayLogged ? 'Completed ✓' : 'Mark Completed'}
                </Button>
              </div>
            </>
          )}
        </Card>

        <Card className="animate-fade-up p-6 lg:col-span-2" style={{ animationDelay: '140ms' }}>
          <CardHeader icon={Utensils} title="Today's Nutrition" subtitle="vs. your daily target" action={<button onClick={() => setQuickLog(true)} className="btn-ghost !p-2" title="Log intake"><Plus size={16} /></button>} />
          <div className="mt-5 flex items-center gap-5">
            <ProgressRing value={calPct} size={104} color="#f97316" label={`${consumed.toLocaleString()}`} sub={`of ${targets?.calories?.toLocaleString() ?? '—'} kcal`} />
            <div className="flex-1 space-y-3">
              {targets && [['Protein', todayEntry?.protein || 0, targets.protein, '#38bdf8'], ['Carbs', todayEntry?.carbs || Math.round((consumed * 0.45) / 4), targets.carbs, '#fbbf24'], ['Fats', todayEntry?.fats || Math.round((consumed * 0.3) / 9), targets.fats, '#fb7185']].map(([name, v, t, color]) => (
                <div key={name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold text-zinc-600 dark:text-zinc-300">{name}</span>
                    <span className="text-zinc-400">{v} / {t} g</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (v / t) * 100)}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setQuickLog(true)} className="btn-outline mt-5 w-full py-2 text-[13px]"><Plus size={14} /> Log calories & protein</button>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="animate-fade-up p-6" style={{ animationDelay: '200ms' }}>
          <CardHeader icon={TrendingUp} title="Weight Trend" subtitle="Your last logged entries" action={<Link to="/progress" className="btn-ghost !px-2 !py-1 text-xs">View all <ArrowRight size={13} /></Link>} />
          <div className="mt-4">{weightData.length >= 2 ? <LineChart data={weightData} unit="kg" /> : <p className="grid h-36 place-items-center text-sm text-zinc-400">Log your weight on the Progress page to see trends.</p>}</div>
        </Card>
        <Card className="animate-fade-up p-6" style={{ animationDelay: '260ms' }}>
          <CardHeader icon={Flame} title="Calories — Last 7 Days" subtitle="Logged intake vs. target" action={<Link to="/diet" className="btn-ghost !px-2 !py-1 text-xs">Diet plan <ArrowRight size={13} /></Link>} />
          <div className="mt-4"><BarChart data={weekCalories} target={targets?.calories} unit="kcal" /></div>
        </Card>
      </div>

      {/* AI Coach quick access */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-zinc-950 animate-fade-up dark:bg-zinc-900/60" style={{ animationDelay: '300ms' }}>
        <div className="relative flex flex-wrap items-center gap-4 p-6">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-lime-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl" />
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950"><Bot size={22} /></span>
          <div className="relative min-w-0 flex-1">
            <p className="font-display text-base font-bold text-white">Your Fitness Coach is in your corner</p>
            <p className="mt-0.5 text-[13px] text-zinc-400">Ask about today's workout, what to eat, or motivation — in English, Urdu or Sindhi.</p>
          </div>
          <Button className="relative" icon={<Sparkles size={15} />} onClick={() => navigate('/ai-coach')}>Chat with Coach</Button>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-3 text-[12.5px] text-zinc-500 dark:border-white/[.06] dark:bg-white/[.03] dark:text-zinc-400">
        <Info size={14} className="mt-0.5 shrink-0 text-sky-400" />
        BMI, calories and macros shown here are estimates for general wellness purposes only — not medical diagnoses.
      </div>

      <WorkoutRunner open={runner} onClose={() => setRunner(false)} day={today} title={`Today's Workout`} />
      <QuickLogModal open={quickLog} onClose={() => setQuickLog(false)} />
    </>
  )
}

function Bot0() { return <Sparkles size={15} /> }
