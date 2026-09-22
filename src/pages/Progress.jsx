import { useMemo, useState } from 'react'
import {
  TrendingUp, Plus, Scale, Flame, Dumbbell, Ruler, CalendarDays, Check, Trash2, Activity, Info, Target,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { addWorkoutLog, upsertProgressEntry } from '@/services/firestore'
import { weeklyWorkoutTarget } from '@/utils/calculate'
import { todayKey, lastNDays, formatDate, weekStartKey, keyToDate, monthKey, workoutStreak } from '@/utils/dates'

const VIEWS = ['Weekly', 'Monthly', 'All-time']

function AddEntryModal({ open, onClose }) {
  const { user } = useAuth()
  const { todayEntry, upsertEntry } = useData()
  const toast = useToast()
  const [form, setForm] = useState({
    weight: todayEntry?.weight ?? '', calories: todayEntry?.calories ?? '', protein: todayEntry?.protein ?? '',
    workoutCompleted: todayEntry?.workoutCompleted || false,
    chest: '', waist: '', hips: '', arms: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      const num = (v) => (v === '' ? null : Number(v))
      await upsertProgressEntry(user.uid, todayKey(), {
        weight: num(form.weight),
        calories: num(form.calories),
        protein: num(form.protein),
        workoutCompleted: form.workoutCompleted,
        measurements: (form.chest || form.waist || form.hips || form.arms)
          ? { chest: num(form.chest), waist: num(form.waist), hips: num(form.hips), arms: num(form.arms) }
          : null,
      })
      if (form.workoutCompleted) {
        await addWorkoutLog(user.uid, { date: todayKey(), name: 'Logged from Progress', duration: 30 })
      }
      toast.success("Today's progress saved.")
      onClose()
    } catch { toast.error('Could not save your entry. Try again.') } finally { setSaving(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add progress entry" subtitle="Today's snapshot — saved under your account.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Weight (kg)" type="number" placeholder="e.g. 67.5" value={form.weight} onChange={set('weight')} />
          <Input label="Calories (kcal)" type="number" placeholder="e.g. 1800" value={form.calories} onChange={set('calories')} />
          <Input label="Protein (g)" type="number" placeholder="e.g. 110" value={form.protein} onChange={set('protein')} />
        </div>
        <div className="rounded-xl border border-zinc-200 px-4 dark:border-white/[.07]">
          <Toggle checked={form.workoutCompleted} onChange={(v) => setForm((f) => ({ ...f, workoutCompleted: v }))} label="Workout completed today" description="Counts toward your streak & consistency" />
        </div>
        <details className="group rounded-xl border border-zinc-200 px-4 dark:border-white/[.07]">
          <summary className="flex cursor-pointer items-center gap-2 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            <Ruler size={15} className="text-emerald-500" /> Body measurements (optional)
          </summary>
          <div className="grid grid-cols-2 gap-3 pb-4">
            <Input label="Chest (cm)" type="number" value={form.chest} onChange={set('chest')} />
            <Input label="Waist (cm)" type="number" value={form.waist} onChange={set('waist')} />
            <Input label="Hips (cm)" type="number" value={form.hips} onChange={set('hips')} />
            <Input label="Arms (cm)" type="number" value={form.arms} onChange={set('arms')} />
          </div>
        </details>
        <div className="flex gap-3 pt-1">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" loading={saving} onClick={save}>Save entry</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function Progress() {
  const { fitness } = useAuth()
  const { entries, logs, dataLoading, dietPlan } = useData()
  const toast = useToast()
  const [view, setView] = useState('Weekly')
  const [modal, setModal] = useState(false)

  const target = dietPlan?.targets?.calories
  const streak = useMemo(() => workoutStreak(logs), [logs])

  const asc = useMemo(() => [...entries].sort((a, b) => a.date.localeCompare(b.date)), [entries])

  const weightData = useMemo(() => {
    let src = asc.filter((e) => e.weight)
    if (view === 'Weekly') src = src.slice(-7)
    if (view === 'Monthly') src = src.slice(-30)
    return src.map((e) => ({ label: formatDate(e.date), value: e.weight }))
  }, [asc, view])

  const consistencyData = useMemo(() => {
    const doneSet = new Set(logs.map((l) => l.date))
    if (view === 'Weekly') {
      return lastNDays(7).map((k) => ({ label: formatDate(k, { weekday: 'narrow' }), value: doneSet.has(k) ? 1 : 0 }))
    }
    if (view === 'Monthly') {
      const buckets = []
      for (let w = 7; w >= 0; w -= 1) {
        const start = keyToDate(weekStartKey())
        start.setDate(start.getDate() - w * 7)
        const end = new Date(start); end.setDate(end.getDate() + 6)
        let count = 0
        logs.forEach((l) => {
          const d = keyToDate(l.date)
          if (d >= start && d <= end) count += 1
        })
        buckets.push({ label: `W-${w}`, value: count })
      }
      return buckets
    }
    const months = {}
    logs.forEach((l) => { months[monthKey(keyToDate(l.date))] = (months[monthKey(keyToDate(l.date))] || 0) + 1 })
    const keys = Object.keys(months).sort().slice(-12)
    return keys.map((k) => ({ label: formatDate(`${k}-01`, { month: 'short' }), value: months[k] }))
  }, [logs, view])

  const nutritionData = useMemo(() => {
    if (view === 'All-time') {
      const months = {}
      asc.forEach((e) => { if (e.calories) months[monthKey(keyToDate(e.date))] = (months[monthKey(keyToDate(e.date))] || 0) + e.calories })
      const keys = Object.keys(months).sort().slice(-12)
      return keys.map((k) => ({ label: formatDate(`${k}-01`, { month: 'short' }), value: Math.round(months[k] / Math.max(1, asc.filter((e) => monthKey(keyToDate(e.date)) === k && e.calories).length)) }))
    }
    const days = view === 'Weekly' ? 7 : 30
    return lastNDays(days).map((k) => ({ label: formatDate(k, days > 10 ? { day: 'numeric' } : { weekday: 'short' }), value: entries.find((e) => e.date === k)?.calories || 0 }))
  }, [asc, entries, view])

  const stats = useMemo(() => {
    const weights = asc.filter((e) => e.weight)
    const first = weights[0]?.weight
    const latest = weights[weights.length - 1]?.weight
    const kcalDays = asc.filter((e) => e.calories)
    const avgKcal = kcalDays.length ? Math.round(kcalDays.reduce((s, e) => s + e.calories, 0) / kcalDays.length) : null
    return {
      latest, change: first != null && latest != null ? +(latest - first).toFixed(1) : null,
      totalWorkouts: logs.length, avgKcal,
    }
  }, [asc, logs])

  // Goal-progress values (previously referenced without being defined → page crash)
  const goalWeight = fitness?.goalWeight ?? null
  const goalPct = useMemo(() => {
    if (!goalWeight || stats.latest == null) return null
    const start = asc.find((e) => e.weight)?.weight ?? stats.latest
    const total = Math.abs(start - goalWeight)
    if (total < 0.05) return 100
    const done = Math.min(Math.abs(start - stats.latest), total)
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)))
  }, [asc, goalWeight, stats.latest])
  const weeklyDone = useMemo(
    () => logs.filter((l) => l.date >= new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)).length,
    [logs],
  )
  const weeklyTargetCount = Math.max(1, weeklyWorkoutTarget(fitness?.experienceLevel) || 3)
  const streakPct = Math.min(100, Math.round((streak / 7) * 100))

  if (dataLoading) {
    return (
      <>
        <PageHeader title="Progress" subtitle="Loading your history…" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        <Skeleton className="mt-5 h-72 rounded-2xl" />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Weight, workouts and nutrition — how far you've come."
        badge={<Badge tone="orange"><Flame size={11} /> {streak}-day streak</Badge>}
        actions={
          <>
            <div className="flex rounded-xl border border-zinc-200 bg-white p-1 dark:border-white/[.08] dark:bg-white/[.04]">
              {VIEWS.map((v) => (
                <button key={v} onClick={() => setView(v)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${view === v ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-zinc-950' : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white'}`}>
                  {v}
                </button>
              ))}
            </div>
            <Button icon={<Plus size={15} />} onClick={() => setModal(true)}>Add Entry</Button>
          </>
        }
      />

      {entries.length === 0 && logs.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title="No progress data yet"
          description="Log your weight, calories and completed workouts — your charts and streak will build from here."
          action={<Button icon={<Plus size={15} />} onClick={() => setModal(true)}>Add your first entry</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard delay={0} icon={Scale} tone="sky" label="Latest Weight" value={stats.latest ?? '—'} unit="kg" sub={stats.change != null ? `${stats.change > 0 ? '+' : ''}${stats.change} kg since first entry` : 'Keep logging'} />
            <StatCard delay={60} icon={Dumbbell} tone="emerald" label="Total Workouts" value={stats.totalWorkouts} sub={`Current streak: ${streak} day${streak === 1 ? '' : 's'}`} />
            <StatCard delay={120} icon={Flame} tone="orange" label="Avg. Calories" value={stats.avgKcal?.toLocaleString() ?? '—'} unit="kcal" sub={target ? `Target ${target.toLocaleString()} kcal` : 'Log calories to track'} />
            <StatCard delay={180} icon={Activity} tone="violet" label="Entries Logged" value={entries.length} sub={`${view} view`} />
          </div>

          {/* Goal progress */}
          <Card className="mt-5 animate-fade-up p-6">
            <CardHeader icon={Target} title="Goal Progress" subtitle="Weekly, monthly and long-term targets" action={fitness?.goal && <Badge tone="emerald">{fitness.goal}</Badge>} />
            <div className="mt-5 grid gap-6 sm:grid-cols-3">
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Weight goal</p>
                  {goalPct != null && <p className="font-display text-sm font-bold text-emerald-500">{goalPct}%</p>}
                </div>
                {goalWeight && stats.latest ? (
                  <>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-700" style={{ width: `${goalPct}%` }} />
                    </div>
                    <p className="mt-2 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                      {stats.latest} kg now · <strong className="text-zinc-700 dark:text-zinc-200">{Math.abs((goalWeight - stats.latest)).toFixed(1)} kg to go</strong> · goal {goalWeight} kg
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-400 dark:text-zinc-500">Set a goal weight on the Progress entry form or in My Profile to track this.</p>
                )}
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">This week's target</p>
                  <p className="font-display text-sm font-bold text-emerald-500">{Math.min(100, Math.round((weeklyDone / weeklyTargetCount) * 100))}%</p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-700" style={{ width: `${Math.min(100, (weeklyDone / weeklyTargetCount) * 100)}%` }} />
                </div>
                <p className="mt-2 text-[12.5px] text-zinc-500 dark:text-zinc-400">{weeklyDone} of {weeklyTargetCount} workouts done · {fitness?.experienceLevel || 'Beginner'} level</p>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Streak milestone</p>
                  <p className="font-display text-sm font-bold text-orange-500">{streakPct}%</p>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-700" style={{ width: `${streakPct}%` }} />
                </div>
                <p className="mt-2 text-[12.5px] text-zinc-500 dark:text-zinc-400">{streak} day{streak === 1 ? '' : 's'} in a row {streak >= 7 ? '— weekly milestone crushed! 🏆' : '— next milestone: 7 days'}</p>
              </div>
            </div>
          </Card>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="animate-fade-up p-6">
              <CardHeader icon={Scale} title="Weight History" subtitle={`${view} view`} />
              <div className="mt-4">{weightData.length >= 2 ? <LineChart data={weightData} unit="kg" /> : <p className="grid h-36 place-items-center text-sm text-zinc-400">Add at least two weight entries to see the trend.</p>}</div>
            </Card>
            <Card className="animate-fade-up p-6" style={{ animationDelay: '80ms' }}>
              <CardHeader icon={CalendarDays} title="Workout Consistency" subtitle={view === 'Weekly' ? 'Sessions per day' : view === 'Monthly' ? 'Sessions per week' : 'Sessions per month'} />
              <div className="mt-4"><BarChart data={consistencyData} unit="workouts" /></div>
            </Card>
            <Card className="animate-fade-up p-6 lg:col-span-2" style={{ animationDelay: '140ms' }}>
              <CardHeader icon={Flame} title="Nutrition Progress" subtitle={`Calories ${view === 'All-time' ? '(monthly avg)' : ''} vs. your target`} />
              <div className="mt-4">{nutritionData.length ? <BarChart data={nutritionData} target={target} unit="kcal" /> : <p className="grid h-36 place-items-center text-sm text-zinc-400">Log calories to see your nutrition progress.</p>}</div>
            </Card>
          </div>

          {/* History */}
          <Card className="mt-5 animate-fade-up overflow-hidden">
            <div className="border-b border-zinc-100 p-5 dark:border-white/[.06]">
              <CardHeader icon={Ruler} title="Entry History" subtitle="Most recent first" />
            </div>
            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:bg-zinc-900">
                  <tr>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-3 py-3">Weight</th>
                    <th className="px-3 py-3">Calories</th>
                    <th className="px-3 py-3">Protein</th>
                    <th className="px-3 py-3">Workout</th>
                    <th className="px-5 py-3 text-right">Meas.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-white/[.04]">
                  {entries.map((e) => (
                    <tr key={e.id} className="transition hover:bg-zinc-50 dark:hover:bg-white/[.03]">
                      <td className="px-5 py-3 font-semibold text-zinc-800 dark:text-zinc-100">{formatDate(e.date, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{e.weight ? `${e.weight} kg` : '—'}</td>
                      <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{e.calories ? e.calories.toLocaleString() : '—'}</td>
                      <td className="px-3 py-3 text-zinc-500 dark:text-zinc-400">{e.protein ? `${e.protein} g` : '—'}</td>
                      <td className="px-3 py-3">
                        {e.workoutCompleted || logs.some((l) => l.date === e.date)
                          ? <span className="inline-flex items-center gap-1 text-emerald-500"><Check size={14} strokeWidth={3} /> Done</span>
                          : <span className="text-zinc-300 dark:text-zinc-600">—</span>}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {e.measurements
                          ? <span className="text-xs text-zinc-400">{Object.entries(e.measurements).filter(([, v]) => v).map(([k, v]) => `${k[0].toUpperCase()}${v}`).join(' · ')}</span>
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-3 text-[12.5px] text-zinc-500 dark:border-white/[.06] dark:bg-white/[.03] dark:text-zinc-400">
        <Info size={14} className="mt-0.5 shrink-0 text-sky-400" />
        All entries are stored privately in Firestore under your UID. Charts are wellness estimates, not clinical measurements.
      </div>

      <AddEntryModal open={modal} onClose={() => setModal(false)} />
    </>
  )
}
