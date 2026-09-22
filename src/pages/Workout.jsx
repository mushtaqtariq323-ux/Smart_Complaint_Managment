import { useMemo, useState } from 'react'
import {
  Dumbbell, RefreshCw, Play, CheckCircle2, Replace, ChevronDown, Info, CalendarDays, Flame, Timer, ListChecks, Home, Building2, Check, User,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge, { DIFF_TONE } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import WorkoutRunner from '@/components/WorkoutRunner'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { generateWorkoutPlan, regenerateForPreference, replaceExerciseInPlan, todayPlanDay } from '@/services/ai/workoutGenerator'
import { saveFitnessProfile } from '@/services/firestore'
import { todayDayName, dateKey } from '@/utils/dates'

const GROUP_LABEL = {
  legs: 'Legs', glutes: 'Glutes', chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  arms: 'Arms', core: 'Core', cardio: 'Cardio', fullbody: 'Full Body', mobility: 'Mobility',
}

function ExerciseRow({ ex, onReplace }) {
  const [open, setOpen] = useState(false)
  return (
    <li className="rounded-xl border border-zinc-200/80 bg-white transition hover:border-emerald-300/60 dark:border-white/[.06] dark:bg-white/[.02] dark:hover:border-emerald-400/30">
      <div className="flex items-center gap-3 p-3.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-lime-400/20 to-emerald-500/15 text-emerald-500">
          <Dumbbell size={15} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-white">
            <span className="truncate">{ex.name}</span>
            <span className="chip shrink-0 !border-violet-500/25 !bg-violet-500/10 !px-2 !py-0.5 !text-[10px] !text-violet-500">{GROUP_LABEL[ex.group] || 'General'}</span>
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {ex.sets} sets · {ex.reps !== '—' ? `${ex.reps} reps` : ex.duration} · rest {ex.rest} · {ex.difficulty}
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/[.06]" aria-label="Details" aria-expanded={open}>
          <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
        <button onClick={() => onReplace(ex)} className="chip border-violet-500/30 bg-violet-500/10 text-violet-500 transition hover:bg-violet-500/20" title="Replace exercise">
          <Replace size={12} /> <span className="hidden sm:inline">Replace</span>
        </button>
      </div>
      {open && (
        <p className="animate-fade-in border-t border-zinc-200/70 px-4 py-3 text-[13px] leading-relaxed text-zinc-500 dark:border-white/[.06] dark:text-zinc-400">
          <Info size={13} className="mr-1.5 inline text-emerald-500" /><strong className="text-zinc-700 dark:text-zinc-200">Target: {GROUP_LABEL[ex.group] || 'Full body'}.</strong> {ex.instructions}
        </p>
      )}
    </li>
  )
}

export default function Workout() {
  const { user, fitness } = useAuth()
  const { plan, logs, dataLoading, savePlan, logWorkout } = useData()
  const toast = useToast()
  const [activeDay, setActiveDay] = useState(todayDayName())
  const [runner, setRunner] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [confirmComplete, setConfirmComplete] = useState(false)
  const [logging, setLogging] = useState(false)

  const today = todayPlanDay(plan)
  const day = plan?.days?.find((d) => d.day === activeDay) || plan?.days?.[0]
  const doneDates = useMemo(() => new Set(logs.map((l) => l.date)), [logs])

  const regenerate = async () => {
    if (!fitness) { toast.error('Complete onboarding first.'); return }
    setRegenerating(true)
    try {
      const fresh = generateWorkoutPlan(fitness)
      await savePlan(fresh)
      toast.success('Fresh AI workout plan generated! 💪')
    } catch { toast.error('Could not generate a new plan.') } finally { setTimeout(() => setRegenerating(false), 600) }
  }

  const replaceExercise = async (ex) => {
    const dayIndex = plan.days.findIndex((d) => d.day === activeDay)
    const exIndex = day.exercises.findIndex((e) => e.id === ex.id)
    const next = replaceExerciseInPlan(plan, dayIndex, exIndex)
    if (!next) { toast.info('No alternatives left for this exercise.'); return }
    try {
      await savePlan(next)
      toast.success(`Swapped "${ex.name}" for "${next.days[dayIndex].exercises[exIndex].name}".`)
    } catch { toast.error('Could not replace the exercise.') }
  }

  const markCompleted = async () => {
    setLogging(true)
    try {
      await logWorkout({ date: dateKey(), name: day.focus, focus: day.focus, duration: day.duration, exercisesTotal: day.exercises.length, exercisesDone: day.exercises.length })
      toast.success('Workout logged. Streak updated! 🔥')
      setConfirmComplete(false)
    } catch { toast.error('Could not log the workout.') } finally { setLogging(false) }
  }

  if (dataLoading) {
    return (
      <>
        <PageHeader title="Workout Plan" subtitle="Loading your AI training split…" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div>
        <Skeleton className="mt-5 h-96 rounded-2xl" />
      </>
    )
  }

  if (!plan) {
    return (
      <>
        <PageHeader title="Workout Plan" subtitle="Your personalized AI training split." />
        <EmptyState
          icon={Dumbbell}
          title="No workout plan yet"
          description={fitness
            ? 'Generate a plan tailored to your goal, experience level and equipment — it only takes a second.'
            : 'Complete your fitness onboarding first — then your personalized weekly split is one tap away.'}
          action={fitness
            ? <Button icon={<RefreshCw size={15} />} onClick={regenerate}>Generate AI Plan</Button>
            : <Button icon={<User size={15} />} onClick={() => window.location.assign('/onboarding')}>Complete Onboarding</Button>}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Workout Plan"
        subtitle={`AI-built for ${plan.goal} · ${plan.preference} · ${plan.experienceLevel} level`}
        badge={<Badge tone="emerald"><Flame size={11} /> {plan.daysPerWeek} days/week</Badge>}
        actions={<Button variant="outline" loading={regenerating} icon={<RefreshCw size={15} />} onClick={regenerate}>Regenerate Plan</Button>}
      />

      {/* Home / Gym switcher */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-white/[.08] dark:bg-white/[.04]">
          {[['Home Workout', Home], ['Gym Workout', Building2]].map(([pref, Icon]) => {
            const active = plan.preference === pref
            return (
              <button
                key={pref}
                onClick={() => switchPreference(pref)}
                disabled={switching}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-all disabled:opacity-60
                  ${active ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-zinc-950 shadow-glow-lime' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}
              >
                <Icon size={14} /> {pref === 'Home Workout' ? 'Home' : 'Gym'} {active && <Check size={13} strokeWidth={3} />}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">Switch anytime — your plan rebuilds for your equipment.</p>
      </div>

      {/* Day selector */}
      <div className="no-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {plan.days.map((d) => {
          const isActive = d.day === activeDay
          const isToday = d.day === todayDayName()
          const isDone = doneDates.has(dateKey()) && isToday
          return (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`relative w-[118px] shrink-0 rounded-2xl border p-3.5 text-left transition-all duration-200 active:scale-[.98]
                ${isActive ? 'border-emerald-400 bg-gradient-to-br from-lime-400/15 to-emerald-500/10 shadow-glow-lime' : 'border-zinc-200 bg-white hover:border-emerald-300 dark:border-white/[.07] dark:bg-zinc-900/60 dark:hover:border-emerald-400/30'}`}
            >
              {isToday && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" />}
              <p className={`text-[11px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-500' : 'text-zinc-400'}`}>{d.day.slice(0, 3)}{isToday ? ' · today' : ''}</p>
              <p className={`mt-1 text-[13px] font-semibold leading-tight ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-300'}`}>{d.focus}</p>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-zinc-400">{d.type === 'rest' ? '—' : <><Timer size={11} /> {d.duration} min</>}</p>
            </button>
          )
        })}
      </div>

      {/* Active day */}
      {day && (
        <Card className="mt-5 animate-fade-up p-6" key={day.day}>
          <CardHeader
            icon={day.type === 'rest' ? CalendarDays : ListChecks}
            title={`${day.day} — ${day.focus}`}
            subtitle={day.type === 'rest' ? 'Recovery day' : `${day.exercises.length} exercises · ~${day.duration} min`}
            action={day.type !== 'rest' && <Badge tone={DIFF_TONE[day.difficulty] || 'emerald'}>{day.difficulty}</Badge>}
          />
          {day.type === 'rest' ? (
            <div className="mt-5 rounded-2xl border border-sky-500/25 bg-sky-500/[.06] p-5">
              <p className="font-display text-base font-bold text-sky-600 dark:text-sky-300">Recharge today 😌</p>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{day.suggestion}</p>
            </div>
          ) : (
            <>
              <ul className="mt-5 space-y-2.5">
                {day.exercises.map((ex) => (
                  <ExerciseRow key={ex.id} ex={ex} onReplace={replaceExercise} />
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button icon={<Play size={15} />} onClick={() => setRunner(true)}>{day.day === todayDayName() && doneDates.has(dateKey()) ? 'Restart Workout' : 'Start Workout'}</Button>
                <Button variant="outline" loading={logging} icon={<CheckCircle2 size={15} />} onClick={() => (day.day === todayDayName() && doneDates.has(dateKey()) ? toast.info('Already logged for today — great job!') : setConfirmComplete(true))}>
                  {day.day === todayDayName() && doneDates.has(dateKey()) ? 'Completed ✓' : 'Mark Completed'}
                </Button>
              </div>
              {day.day !== todayDayName() && (
                <p className="mt-3 text-xs text-zinc-400">Completing logs today's date — you can mark any day's plan as done on its scheduled day.</p>
              )}
            </>
          )}
        </Card>
      )}

      <WorkoutRunner open={runner} onClose={() => setRunner(false)} day={day} title={day?.focus} />

      <Modal open={confirmComplete} onClose={() => setConfirmComplete(false)} title="Mark workout as completed?" subtitle={day ? `${day.day} — ${day.focus}` : ''}>
        <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          This logs today's session ({day?.duration} min, {day?.exercises?.length} exercises) to your progress and updates your streak and weekly target.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setConfirmComplete(false)}>Cancel</Button>
          <Button className="flex-1" loading={logging} onClick={markCompleted}>Yes, log it</Button>
        </div>
      </Modal>
    </>
  )
}
