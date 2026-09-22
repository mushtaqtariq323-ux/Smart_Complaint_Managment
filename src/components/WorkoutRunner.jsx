import { useEffect, useRef, useState } from 'react'
import { Check, Timer, Play, Square, Flame, PartyPopper } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Badge, { DIFF_TONE } from '@/components/ui/Badge'
import { useToast } from '@/context/ToastContext'
import { useData } from '@/context/DataContext'
import { todayKey } from '@/utils/dates'

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/** Guided workout session: checklist + elapsed timer + optional rest countdown, logs completion to Firestore. */
export default function WorkoutRunner({ open, onClose, day, title }) {
  const [done, setDone] = useState({})
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(true)
  const [rest, setRest] = useState(0)
  const [finished, setFinished] = useState(false)
  const timer = useRef(null)
  const toast = useToast()
  const { logWorkout } = useData()
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) { setDone({}); setElapsed(0); setRunning(true); setRest(0); setFinished(false) }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    timer.current = setInterval(() => {
      if (running) setElapsed((e) => e + 1)
      setRest((r) => (r > 0 ? r - 1 : 0))
    }, 1000)
    return () => clearInterval(timer.current)
  }, [open, running])

  if (!day) return null
  const exercises = day.exercises || []
  const completedCount = exercises.filter((e) => done[e.id || e.name]).length
  const pct = exercises.length ? Math.round((completedCount / exercises.length) * 100) : 0

  const finish = async () => {
    setSaving(true)
    try {
      await logWorkout({
        date: todayKey(),
        name: title || day.focus,
        focus: day.focus,
        duration: Math.max(1, Math.round(elapsed / 60)) || day.duration,
        exercisesTotal: exercises.length,
        exercisesDone: completedCount,
      })
      setFinished(true)
      toast.success(`Workout logged — ${completedCount}/${exercises.length} exercises. Great work! 🔥`)
    } catch {
      toast.error('Could not save your workout log. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={finished ? 'Session complete!' : (title || day.focus)} subtitle={finished ? undefined : `${day.day} · ${day.duration} min · ${exercises.length} exercises`}>
      {finished ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950 shadow-glow-lime animate-scale-in">
            <PartyPopper size={34} />
          </span>
          <h4 className="mt-5 font-display text-xl font-bold text-zinc-900 dark:text-white">Well done, athlete! 🔥</h4>
          <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            {completedCount}/{exercises.length} exercises · {fmt(elapsed)} elapsed. Your streak and weekly progress have been updated.
          </p>
          <Button className="mt-6" onClick={onClose}>Back to plans</Button>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-white/[.05]">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Elapsed</p>
                <p className="font-display text-lg font-bold tabular-nums text-zinc-900 dark:text-white">{fmt(elapsed)}</p>
              </div>
              {rest > 0 && (
                <div className="animate-pulse-soft rounded-xl bg-orange-500/15 px-3 py-1.5 text-orange-500">
                  <p className="text-[10px] font-bold uppercase tracking-wider">Rest</p>
                  <p className="font-display text-base font-bold tabular-nums">{fmt(rest)}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setRunning((r) => !r)} className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-white/10 dark:hover:text-white" aria-label={running ? 'Pause timer' : 'Resume timer'}>
                {running ? <Square size={15} /> : <Play size={15} />}
              </button>
              <span className="font-display text-sm font-bold text-emerald-500">{pct}%</span>
            </div>
          </div>
          <div className="mb-5 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>

          <ul className="max-h-[46vh] space-y-2.5 overflow-y-auto pr-1 scrollbar-thin">
            {exercises.map((ex, idx) => {
              const key = ex.id || `${ex.name}-${idx}`
              const isDone = !!done[key]
              return (
                <li key={key} className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${isDone ? 'border-emerald-400/40 bg-emerald-400/[.07]' : 'border-zinc-200 bg-white dark:border-white/[.07] dark:bg-white/[.03]'}`}>
                  <button
                    onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all ${isDone ? 'border-emerald-500 bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950' : 'border-zinc-300 text-transparent hover:border-emerald-400 dark:border-zinc-600'}`}
                    aria-label={`Mark ${ex.name} ${isDone ? 'incomplete' : 'complete'}`}
                  >
                    <Check size={14} strokeWidth={3.5} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${isDone ? 'text-zinc-400 line-through dark:text-zinc-500' : 'text-zinc-900 dark:text-white'}`}>{ex.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      {ex.sets} × {ex.reps !== '—' ? `${ex.reps} reps` : ex.duration}
                    </p>
                  </div>
                  <button
                    onClick={() => setRest(parseInt(ex.rest) || 60)}
                    className="chip border-orange-500/30 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                    title={`Start ${ex.rest} rest timer`}
                  >
                    <Timer size={12} /> {ex.rest}
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" loading={saving} icon={<Flame size={15} />} onClick={finish}>
              Finish & Log
            </Button>
          </div>
        </>
      )}
    </Modal>
  )
}
