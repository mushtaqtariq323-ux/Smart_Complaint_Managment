import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Plus, Pencil, Trash2, Play, Check, Clock, ArrowRight, ChevronUp, ChevronDown, X,
  Dumbbell, UtensilsCrossed, PartyPopper, RotateCcw, ListChecks,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  saveCustomPlan, deleteCustomPlan, toggleStepToday, subscribeCustomPlans, nextStep, newItemId, planHistory, planStreak,
} from '@/services/customPlans'

/* ── ready-made templates: ek tap me poora plan ── */
const TEMPLATES = {
  workout: [
    { title: 'Sham ka Home Workout', time: '17:00', durationMin: 45, items: [
      { name: 'Warm up — jogging in place', target: '5 min', durationMin: 5 },
      { name: 'Push ups', target: '40 reps (4×10)', durationMin: 10 },
      { name: 'Pull ups', target: '20 reps (4×5)', durationMin: 10 },
      { name: 'Squats', target: '50 reps (5×10)', durationMin: 10 },
      { name: 'Plank', target: '3×1 min', durationMin: 5 },
      { name: 'Stretch & cool down', target: '5 min', durationMin: 5 },
    ] },
    { title: 'Beginner 20-min', time: '', durationMin: 20, items: [
      { name: 'Jumping jacks', target: '2 min', durationMin: 2 },
      { name: 'Knee push ups', target: '15 reps', durationMin: 5 },
      { name: 'Bodyweight squats', target: '20 reps', durationMin: 5 },
      { name: 'Plank', target: '30 sec ×3', durationMin: 4 },
      { name: 'Cool-down stretch', target: '4 min', durationMin: 4 },
    ] },
    { title: 'Gym Strength', time: '18:00', durationMin: 60, items: [
      { name: 'Treadmill warm-up', target: '10 min', durationMin: 10 },
      { name: 'Bench press', target: '4×8', durationMin: 12 },
      { name: 'Lat pulldown', target: '4×10', durationMin: 12 },
      { name: 'Leg press', target: '4×10', durationMin: 12 },
      { name: 'Biceps curls', target: '3×12', durationMin: 8 },
      { name: 'Stretch', target: '6 min', durationMin: 6 },
    ] },
    { title: 'Morning Cardio', time: '06:30', durationMin: 30, items: [
      { name: 'Brisk walk / jog', target: '20 min', durationMin: 20 },
      { name: 'Jumping jacks', target: '3×30', durationMin: 4 },
      { name: 'High knees', target: '3×30', durationMin: 3 },
      { name: 'Stretching', target: '3 min', durationMin: 3 },
    ] },
  ],
  diet: [
    { title: 'Fat-loss Meals', time: '07:00', durationMin: null, items: [
      { name: 'Breakfast', target: '2 anda + 1 roti + chai (no sugar)' },
      { name: 'Lunch', target: 'Chicken 150g + salad + 1 roti' },
      { name: 'Evening snack', target: 'Fruit + 5 badam' },
      { name: 'Dinner', target: 'Daal + salad (light)' },
    ] },
    { title: 'Muscle Gain Meals', time: '07:30', durationMin: null, items: [
      { name: 'Breakfast', target: 'Oats + banana + 3 anda' },
      { name: 'Snack', target: 'Nuts + full-cream milk' },
      { name: 'Lunch', target: 'Rice + chicken 200g' },
      { name: 'Pre-workout', target: 'Sandwich + 2 khajoor' },
      { name: 'Dinner', target: 'Beef/daal + veggies + roti' },
    ] },
  ],
}

const SUGGESTIONS = {
  workout: ['Push ups', 'Pull ups', 'Squats', 'Lunges', 'Plank', 'Jumping jacks', 'Burpees', 'Mountain climbers', 'Bench press', 'Deadlift', 'Shoulder press', 'Biceps curls', 'Triceps dips', 'Running', 'Cycling', 'Skipping rope', 'Stretching'],
  diet: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-workout', 'Post-workout'],
}

const todayKey = () => new Date().toISOString().slice(0, 10)
const emptyDraft = (type = 'workout') => ({
  id: null, title: '', type, time: '', durationMin: '',
  items: [{ id: newItemId(), name: '', target: '', durationMin: '' }],
})

/* countdown beep — user gesture ke baad hi chalta hai */
const beep = () => {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    ;[0, 0.28, 0.56].forEach((t) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.frequency.value = 880; g.gain.value = 0.14
      o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.16)
    })
  } catch { /* audio blocked — silent */ }
}

/* ───────────────────────── Step Timer ───────────────────────── */
function StepTimer({ step, onComplete }) {
  const total = (step.durationMin || 0) * 60
  const [left, setLeft] = useState(total)
  const [running, setRunning] = useState(false)

  useEffect(() => { setLeft((step.durationMin || 0) * 60); setRunning(false) }, [step.id])
  useEffect(() => {
    if (!running) return undefined
    const iv = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(iv)
  }, [running])
  useEffect(() => {
    if (left > 0 || !running) return
    setRunning(false)
    beep()
    onComplete()
  }, [left, running]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!step.durationMin) return null
  const sec = Math.max(left, 0)
  const label = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
  const pct = total ? Math.round(100 - (sec / total) * 100) : 0

  return (
    <div className="mt-4">
      {!running && left === total ? (
        <button type="button" onClick={() => setRunning(true)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/[.07] px-4 py-2.5 text-[13px] font-bold text-emerald-600 transition hover:bg-emerald-500/[.12] dark:text-emerald-300">
          ▶ Start timer ({step.durationMin} min)
        </button>
      ) : (
        <div className="inline-flex flex-col items-center gap-2">
          <span className="font-display text-4xl font-bold tabular-nums text-emerald-500">{label}</span>
          <div className="h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-bold text-zinc-600 dark:border-white/10 dark:text-zinc-300">
              {running ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button type="button" onClick={() => setLeft((s) => s + 30)} className="rounded-lg border border-zinc-200 px-3 py-1.5 text-[12px] font-bold text-zinc-600 dark:border-white/10 dark:text-zinc-300">+30s</button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ───────────────────────── Plan Builder ───────────────────────── */
function PlanBuilder({ initial, onClose, onSave }) {
  const [d, setD] = useState(() => ({
    ...emptyDraft(initial.type),
    ...(initial.plan || {}),
    items: initial.plan?.items?.length ? initial.plan.items.map((it) => ({ ...it })) : emptyDraft(initial.type).items,
  }))
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setD((f) => ({ ...f, [k]: e.target.value }))
  const setItem = (id, k) => (e) => setD((f) => ({ ...f, items: f.items.map((it) => (it.id === id ? { ...it, [k]: e.target.value } : it)) }))
  const addItem = () => setD((f) => ({ ...f, items: [...f.items, { id: newItemId(), name: '', target: '', durationMin: '' }] }))
  const rmItem = (id) => setD((f) => ({ ...f, items: f.items.filter((it) => it.id !== id) }))
  const mv = (i, dir) => setD((f) => {
    const arr = [...f.items]
    const j = i + dir
    if (j < 0 || j >= arr.length) return f
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    return { ...f, items: arr }
  })

  const submit = async (e) => {
    e.preventDefault()
    const items = d.items.filter((it) => it.name.trim())
    if (!d.title.trim()) return
    if (!items.length) return
    setSaving(true)
    await onSave({ ...d, items }).catch(() => {})
    setSaving(false)
    onClose()
  }

  const isDiet = d.type === 'diet'
  return (
    <Card className="animate-fade-up">
      <form onSubmit={submit} className="space-y-4 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
            {initial.plan ? 'Edit Plan' : isDiet ? 'New Diet Plan' : 'New Workout Plan'}
          </h2>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[.06]" aria-label="Close builder"><X size={16} /></button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">Plan name</span>
            <Input value={d.title} onChange={set('title')} placeholder={isDiet ? 'e.g. Fat-loss meals' : 'e.g. Sham ka Workout'} required maxLength={60} />
          </label>
          <div>
            <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">Type</span>
            <div className="grid grid-cols-2 gap-2">
              {[['workout', 'Workout', Dumbbell], ['diet', 'Diet', UtensilsCrossed]].map(([v, label, Icon]) => (
                <button key={v} type="button" onClick={() => setD((f) => ({ ...f, type: v }))}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition ${d.type === v ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' : 'border-zinc-200 text-zinc-500 dark:border-white/10 dark:text-zinc-400'}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">Time (optional)</span>
            <Input type="time" value={d.time} onChange={set('time')} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">Total duration, minutes (optional)</span>
            <Input type="number" min="5" max="600" value={d.durationMin} onChange={set('durationMin')} placeholder="e.g. 120 (2 hours)" />
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-zinc-500 dark:text-zinc-400">
              Steps — {isDiet ? 'meals in order' : 'exercises in order'}
            </span>
            <span className="text-[11.5px] text-zinc-400">The order you write is the order you follow</span>
          </div>
          <div className="space-y-2.5">
            {d.items.map((it, i) => (
              <div key={it.id} className="rounded-xl border border-zinc-200 bg-zinc-50/[.6] p-2.5 dark:border-white/[.07] dark:bg-white/[.03]">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-r from-lime-400 to-emerald-500 text-[12px] font-bold text-zinc-950">{i + 1}</span>
                  <input
                    value={it.name} onChange={setItem(it.id, 'name')}
                    placeholder={isDiet ? `Meal ${i + 1} — e.g. Breakfast (anda + roti)` : `Exercise ${i + 1} — e.g. Push ups`}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[13.5px] font-medium text-zinc-800 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/[.04] dark:text-zinc-100"
                    maxLength={60}
                    list={`afc-suggest-${d.type}`}
                  />
                  <datalist id={`afc-suggest-${d.type}`}>
                    {SUGGESTIONS[d.type].map((sg) => <option key={sg} value={sg} />)}
                  </datalist>
                  <div className="flex shrink-0 flex-col">
                    <button type="button" onClick={() => mv(i, -1)} className="grid h-4 w-7 place-items-center text-zinc-400 hover:text-emerald-500" aria-label="Move up"><ChevronUp size={13} /></button>
                    <button type="button" onClick={() => mv(i, 1)} className="grid h-4 w-7 place-items-center text-zinc-400 hover:text-emerald-500" aria-label="Move down"><ChevronDown size={13} /></button>
                  </div>
                  <button type="button" onClick={() => rmItem(it.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-300 hover:bg-rose-500/10 hover:text-rose-500 dark:text-zinc-600" aria-label="Remove step"><Trash2 size={14} /></button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 pl-9">
                  <input
                    value={it.target} onChange={setItem(it.id, 'target')}
                    placeholder={isDiet ? 'e.g. 2 roti + salan' : 'e.g. 40 reps / 3 sets'}
                    className="min-w-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12.5px] text-zinc-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/[.04] dark:text-zinc-200"
                    maxLength={40}
                  />
                  <input
                    type="number" min="1" max="180" value={it.durationMin ?? ''} onChange={setItem(it.id, 'durationMin')}
                    placeholder="Minutes (optional)"
                    className="min-w-0 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-[12.5px] text-zinc-700 outline-none focus:border-emerald-400 dark:border-white/10 dark:bg-white/[.04] dark:text-zinc-200"
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-zinc-300 py-2.5 text-[13px] font-semibold text-zinc-500 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-white/15 dark:text-zinc-400">
            <Plus size={14} /> Add step
          </button>
        </div>

        <div className="flex gap-2.5 pt-1">
          <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Save Plan'}</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Card>
  )
}

/* ───────────────────── Guided Runner (step-by-step) ───────────────────── */
function PlanRunner({ plan, onExit, onToggle }) {
  const { next, doneCount, total, doneList } = useMemo(() => nextStep(plan), [plan])
  const isDiet = plan.type === 'diet'
  const finished = total > 0 && doneCount >= total
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  return (
    <Card className="animate-fade-up overflow-hidden">
      <div className="border-b border-zinc-100 p-4 dark:border-white/[.06] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold text-zinc-900 dark:text-white">{plan.title}</p>
            <p className="text-[12px] font-medium text-zinc-400">
              {plan.time && `🕒 ${plan.time} · `}{plan.durationMin ? `${plan.durationMin} min · ` : ''}{doneCount}/{total} done today
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onExit}><X size={14} /> Exit</Button>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[.07]">
          <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {finished ? (
        <div className="p-8 text-center">
          <PartyPopper size={44} className="mx-auto mb-3 text-amber-400" />
          <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">Plan complete! 🎉</h3>
          <p className="mx-auto mt-1.5 max-w-xs text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            All {total} {isDiet ? 'meals' : 'exercises'} done for today — awesome! The plan resets fresh tomorrow.
          </p>
          <Button className="mt-5" onClick={onExit}><RotateCcw size={14} /> Back to plans</Button>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          {next ? (
            <>
              <div className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/[.08] to-lime-400/[.05] p-5 text-center sm:p-7">
                <p className="text-[11.5px] font-bold uppercase tracking-wider text-emerald-500">DO THIS NOW — Step {doneCount + 1}</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">{next.name}</h3>
                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-[13px] text-zinc-500 dark:text-zinc-400">
                  {next.target && <span className="rounded-full bg-zinc-900/[.04] px-3 py-1 font-semibold dark:bg-white/[.06]">{next.target}</span>}
                  {next.durationMin && <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900/[.04] px-3 py-1 font-semibold dark:bg-white/[.06]"><Clock size={12} /> {next.durationMin} min</span>}
                </div>
                <StepTimer step={next} onComplete={() => onToggle(next.id, next.name)} />
                <Button size="lg" className="mt-4 w-full sm:w-auto" onClick={() => onToggle(next.id, next.name)}>
                  <Check size={17} /> {isDiet ? 'Mark as eaten' : 'Mark Complete'}
                </Button>
              </div>
              {doneCount > 0 && (
                <p className="mt-3 text-center text-[12.5px] text-zinc-400">
                  ✔ {doneCount} {doneCount === 1 ? 'step' : 'steps'} done — {total - doneCount} to go
                </p>
              )}
            </>
          ) : null}

          {total > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-zinc-400">Today's sequence</p>
              <div className="space-y-1.5">
                {plan.items.map((it, i) => {
                  const done = doneList.includes(it.id)
                  const isNext = next && next.id === it.id
                  return (
                    <button
                      key={it.id} type="button"
                      onClick={() => onToggle(it.id, it.name)}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${done ? 'border-emerald-400/25 bg-emerald-500/[.06]' : isNext ? 'border-emerald-400/50 bg-white dark:bg-white/[.05]' : 'border-zinc-200 bg-white dark:border-white/[.08] dark:bg-white/[.03]'}`}
                    >
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${done ? 'bg-emerald-500 text-white' : isNext ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-zinc-950' : 'bg-zinc-200 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'}`}>
                        {done ? <Check size={12} /> : i + 1}
                      </span>
                      <span className={`min-w-0 flex-1 truncate text-[13.5px] ${done ? 'text-zinc-400 line-through' : 'font-semibold text-zinc-800 dark:text-zinc-100'}`}>
                        {it.name}{it.target ? <span className="font-normal text-zinc-400"> — {it.target}</span> : null}
                      </span>
                      {!done && !isNext && <span className="shrink-0 text-[11px] text-zinc-400">pending</span>}
                      {done && <span className="shrink-0 text-[10.5px] text-zinc-400">(tap to undo)</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

/* ───────────────────────────── Page ───────────────────────────── */
export default function Planner() {
  const { user } = useAuth()
  const toast = useToast()
  const [plans, setPlans] = useState(null) // null = loading
  const [tab, setTab] = useState('workout')
  const [builder, setBuilder] = useState(null) // { type, plan? }
  const [runningId, setRunningId] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const builderRef = useRef(null)

  // Builder khulte hi smooth-scroll karke pehle input pe focus —
  // (Create your first plan page ke neeche hota hai, inputs upar khulte hain)
  useEffect(() => {
    if (!builder) return
    const t = setTimeout(() => {
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      builderRef.current?.querySelector('input[placeholder^=\'e.g.\'], input[placeholder*=\'e.g.\']')?.focus({ preventScroll: true })
    }, 80)
    return () => clearTimeout(t)
  }, [builder])


  useEffect(() => {
    if (!user) return undefined
    return subscribeCustomPlans(
      user.uid,
      (list) => setPlans(list.filter((p) => Array.isArray(p.items))),
      () => setPlans([]),
    )
  }, [user])

  const list = useMemo(() => (plans || []).filter((p) => p.type === tab), [plans, tab])
  const running = runningId ? (plans || []).find((p) => p.id === runningId) : null

  const handleToggle = async (itemId, name) => {
    if (!running) return
    const before = nextStep(running)
    await toggleStepToday(user.uid, running, itemId)
    const completing = !before.doneList.includes(itemId)
    if (completing) {
      const afterIdx = running.items.findIndex((it) => it.id === itemId) + 1
      const upNext = running.items.slice(afterIdx).find((it) => !before.doneList.includes(it.id))
      toast.success(upNext ? `Great job! ✅ Up next: ${upNext.name}` : 'Great job! ✅ Plan complete! 🎉', 'Step done')
    }
  }

  const handleSave = async (draft) => {
    try {
      await saveCustomPlan(user.uid, draft)
      toast.success('Plan saved! Hit Start and the app will guide you step by step. 💪', 'Ready')
    } catch {
      toast.error('Could not save the plan — network or rules issue. Please try again.')
    }
  }

  const handleDelete = async (id) => {
    try { await deleteCustomPlan(user.uid, id) } catch { toast.error('Delete failed — try again.') }
    setConfirmDel(null)
    if (runningId === id) setRunningId(null)
  }

  return (
    <>
      <PageHeader
        title="My Planner"
        subtitle="Build your own workout or diet plan — the app guides you through every step."
        badge={<Badge tone="emerald"><ListChecks size={11} /> Self-guided</Badge>}
        actions={running ? null : (
          <Button size="sm" icon={<Plus size={14} />} onClick={() => setBuilder({ type: tab })}>New Plan</Button>
        )}
      />

      {/* RUNNER — guided step-by-step mode */}
      {running ? (
        <PlanRunner plan={running} onExit={() => setRunningId(null)} onToggle={handleToggle} />
      ) : (
        <>
          {/* Builder */}
          {builder && (
            <div ref={builderRef} className="mb-5 scroll-mt-4">
              <PlanBuilder initial={builder} onClose={() => setBuilder(null)} onSave={handleSave} />
            </div>
          )}

          {/* Tabs */}
          <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1.5 dark:bg-white/[.05]">
            {[['workout', 'Workout Plans', Dumbbell], ['diet', 'Diet Plans', UtensilsCrossed]].map(([v, label, Icon]) => (
              <button key={v} type="button" onClick={() => setTab(v)}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-bold transition ${tab === v ? 'bg-white text-emerald-600 shadow-sm dark:bg-zinc-800 dark:text-emerald-300' : 'text-zinc-500 dark:text-zinc-400'}`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Quick templates */}
          {!builder && (
            <div className="mb-4">
              <p className="mb-2 text-[12px] font-bold uppercase tracking-wider text-zinc-400">⚡ Quick templates — ek tap me ready plan</p>
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                {TEMPLATES[tab].map((t) => (
                  <button key={t.title} type="button"
                    onClick={() => setBuilder({ type: tab, plan: { ...t, items: t.items.map((it) => ({ ...it, id: newItemId() })) } })}
                    className="w-44 shrink-0 rounded-xl border border-zinc-200 bg-white p-3 text-left transition hover:border-emerald-400/60 dark:border-white/10 dark:bg-white/[.04]">
                    <p className="truncate text-[13px] font-bold text-zinc-800 dark:text-zinc-100">{t.title}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">{t.items.length} {tab === 'diet' ? 'meals' : 'steps'}{t.durationMin ? ` · ${t.durationMin} min` : ''}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* List */}
          {plans === null ? (
            <div className="grid place-items-center py-16 text-[13px] text-zinc-400">Loading plans…</div>
          ) : list.length === 0 ? (
            <Card className="p-10 text-center">
              <ListChecks size={38} className="mx-auto mb-3 text-emerald-500" />
              <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">No {tab} plans yet</h3>
              <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                Create your own plan — e.g. <b>"Evening Workout"</b>: 40 push ups → 20 pull ups → chest. The app tells you what to do next at every step.
              </p>
              <Button className="mt-4" icon={<Plus size={14} />} onClick={() => setBuilder({ type: tab })}>Create your first plan</Button>
            </Card>
          ) : (
            <div className="grid gap-3.5 md:grid-cols-2">
              {list.map((p) => {
                const { next, doneCount, total } = nextStep(p)
                const finished = total > 0 && doneCount >= total
                return (
                  <Card key={p.id} className="p-4 transition hover:border-emerald-400/40">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-[15.5px] font-bold text-zinc-900 dark:text-white">{p.title}</h3>
                        <p className="mt-0.5 text-[11.5px] font-medium text-zinc-400">
                          {total} {p.type === 'diet' ? 'meals' : 'steps'}{p.time ? ` · 🕒 ${p.time}` : ''}{p.durationMin ? ` · ${p.durationMin} min` : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => setBuilder({ type: p.type, plan: p })} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-emerald-600 dark:hover:bg-white/[.06]" aria-label={`Edit ${p.title}`}><Pencil size={14} /></button>
                        <button type="button" onClick={() => setConfirmDel(p.id)} className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500" aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-white/[.04]">
                      {finished ? (
                        <p className="text-[13px] font-semibold text-emerald-500">🎉 Today's plan complete — resets tomorrow!</p>
                      ) : next ? (
                        <p className="truncate text-[13px] text-zinc-600 dark:text-zinc-300">
                          <span className="font-bold text-emerald-500">Next: </span>{next.name}{next.target ? ` (${next.target})` : ''}
                        </p>
                      ) : (
                        <p className="text-[13px] text-zinc-400">This plan is empty — edit it to add steps.</p>
                      )}
                    </div>

                    {total > 0 && (
                      <>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/[.07]">
                          <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500" style={{ width: `${Math.round((doneCount / total) * 100)}%` }} />
                        </div>
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <p className="text-[11px] font-semibold text-zinc-400">{doneCount}/{total} done today</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1" title="Last 7 days">
                              {planHistory(p).map((d) => (
                                <span key={d.key} className={`h-1.5 w-3.5 rounded-full ${d.done ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-white/10'}`} />
                              ))}
                            </div>
                            {planStreak(p) >= 2 && (
                              <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[10.5px] font-bold text-amber-500">🔥 {planStreak(p)}-day</span>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    <Button className="mt-3 w-full" size="sm" variant={finished ? 'outline' : 'default'} icon={finished ? <RotateCcw size={14} /> : <Play size={14} />} onClick={() => setRunningId(p.id)}>
                      {finished ? 'Review' : doneCount > 0 ? 'Continue' : 'Start Guide'}
                    </Button>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Delete confirm */}
      {confirmDel && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/50 p-5" onClick={() => setConfirmDel(null)}>
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-[15px] font-bold text-zinc-900 dark:text-white">Delete this plan?</p>
            <p className="mt-1 text-[12.5px] text-zinc-500 dark:text-zinc-400">The whole plan and its progress will be removed.</p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDel(null)}>Cancel</Button>
              <Button className="flex-1 !bg-rose-500 !bg-none hover:!brightness-110" onClick={() => handleDelete(confirmDel)}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
