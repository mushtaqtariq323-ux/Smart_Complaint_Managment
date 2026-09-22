import { useMemo, useState } from 'react'
import {
  UtensilsCrossed, RefreshCw, Info, User, Coffee, Sun, MoonStar, Cookie, Flame, Wheat, Droplets, Beef,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ProgressRing from '@/components/ui/ProgressRing'
import { EmptyState, Skeleton } from '@/components/ui/Feedback'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { generateDietPlan } from '@/services/ai/dietGenerator'

const MEAL_ICONS = { breakfast: Coffee, lunch: Sun, dinner: MoonStar, snacks: Cookie }

const MEAL_TONES = {
  breakfast: 'text-amber-500 bg-amber-500/10',
  lunch: 'text-emerald-500 bg-emerald-500/10',
  dinner: 'text-violet-500 bg-violet-500/10',
  snacks: 'text-sky-500 bg-sky-500/10',
}

export default function Diet() {
  const { fitness } = useAuth()
  const { dietPlan, dataLoading, saveDiet } = useData()
  const toast = useToast()
  const [generating, setGenerating] = useState(false)

  const targets = dietPlan?.targets
  const totals = dietPlan?.totals
  const rings = useMemo(() => (targets ? [
    { label: 'Protein', value: totals?.p || 0, target: targets.protein, color: '#38bdf8' },
    { label: 'Carbs', value: totals?.c || 0, target: targets.carbs, color: '#fbbf24' },
    { label: 'Fats', value: totals?.f || 0, target: targets.fats, color: '#fb7185' },
  ] : []), [targets, totals])

  const generate = async () => {
    if (!fitness) return
    setGenerating(true)
    try {
      const fresh = generateDietPlan(fitness)
      await saveDiet(fresh)
      toast.success('Fresh AI meal plan generated! 🍽️')
    } catch { toast.error('Could not generate a new meal plan.') } finally { setTimeout(() => setGenerating(false), 600) }
  }

  if (dataLoading) {
    return (
      <>
        <PageHeader title="Diet Plan" subtitle="Loading your nutrition guidance…" />
        <div className="grid gap-4 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
      </>
    )
  }

  if (!dietPlan) {
    return (
      <>
        <PageHeader title="Diet Plan" subtitle="General wellness nutrition guidance." />
        <EmptyState
          icon={UtensilsCrossed}
          title="No diet plan yet"
          description={fitness
            ? 'Generate meal suggestions matched to your goal, calories, food preferences and allergies.'
            : 'Complete your fitness onboarding first — your nutrition targets and meals follow automatically.'}
          action={fitness
            ? <Button icon={<RefreshCw size={15} />} onClick={generate}>Generate AI Diet Plan</Button>
            : <Button icon={<User size={15} />} onClick={() => window.location.assign('/onboarding')}>Complete Onboarding</Button>}
        />
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Diet Plan"
        subtitle={`For ${fitness?.goal || 'your goal'} · ${dietPlan.preference} · matched to your estimated calorie needs`}
        badge={<Badge tone="sky"><Info size={11} /> Wellness guidance</Badge>}
        actions={<Button variant="outline" loading={generating} icon={<RefreshCw size={15} />} onClick={generate}>Regenerate Plan</Button>}
      />

      {/* Targets */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="animate-fade-up flex items-center justify-around p-6">
          <ProgressRing value={targets ? Math.min(100, Math.round(((totals?.kcal || 0) / targets.calories) * 100)) : 0} size={118} stroke={11} color="#f97316">
            <div className="text-center">
              <p className="font-display text-xl font-bold text-zinc-900 dark:text-white">{(totals?.kcal || 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">of {targets?.calories.toLocaleString()} kcal</p>
            </div>
          </ProgressRing>
          <div className="space-y-3">
            {rings.map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex justify-between gap-6 text-xs">
                  <span className="font-semibold text-zinc-600 dark:text-zinc-300">{m.label}</span>
                  <span className="text-zinc-400">{m.value}/{m.target}g</span>
                </div>
                <div className="h-2 w-36 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="animate-fade-up p-6 lg:col-span-2" style={{ animationDelay: '80ms' }}>
          <CardHeader icon={Flame} title="Daily Targets" subtitle="Auto-calculated from your profile (estimates)" />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: Flame, label: 'Calories', v: targets?.calories, u: 'kcal', c: 'text-orange-500 bg-orange-500/10' },
              { icon: Beef, label: 'Protein', v: targets?.protein, u: 'g', c: 'text-sky-500 bg-sky-500/10' },
              { icon: Wheat, label: 'Carbs', v: targets?.carbs, u: 'g', c: 'text-amber-500 bg-amber-500/10' },
              { icon: Droplets, label: 'Fats', v: targets?.fats, u: 'g', c: 'text-rose-500 bg-rose-500/10' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-zinc-200/70 bg-zinc-50 p-4 text-center dark:border-white/[.06] dark:bg-white/[.03]">
                <span className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${s.c}`}><s.icon size={16} /></span>
                <p className="mt-2 font-display text-lg font-bold text-zinc-900 dark:text-white">{s.v?.toLocaleString()}<span className="text-xs text-zinc-400"> {s.u}</span></p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>
          {(dietPlan.allergies?.length > 0) && (
            <p className="mt-4 text-[13px] text-zinc-500 dark:text-zinc-400">
              <Info size={13} className="mr-1 inline text-emerald-500" />
              Excluding your allergies: <span className="font-semibold text-zinc-700 dark:text-zinc-200">{dietPlan.allergies.join(', ')}</span>
            </p>
          )}
        </Card>
      </div>

      {/* Meals */}
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {Object.entries(dietPlan.meals).map(([key, meal], i) => {
          const Icon = MEAL_ICONS[key] || UtensilsCrossed
          return (
            <Card key={key} className="animate-fade-up p-6" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${MEAL_TONES[key]}`}><Icon size={18} /></span>
                  <div>
                    <h3 className="font-display text-[15px] font-bold text-zinc-900 dark:text-white">{meal.label}</h3>
                    <p className="text-xs text-zinc-400">{meal.items.length} item{meal.items.length === 1 ? '' : 's'} · ~{meal.kcal} kcal</p>
                  </div>
                </div>
                <div className="hidden gap-1.5 sm:flex">
                  <Badge tone="sky">P {meal.p}g</Badge>
                  <Badge tone="amber">C {meal.c}g</Badge>
                  <Badge tone="rose">F {meal.f}g</Badge>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {meal.items.map((item) => (
                  <li key={item.id} className="rounded-xl border border-zinc-200/70 bg-zinc-50 px-3.5 py-2.5 dark:border-white/[.06] dark:bg-white/[.03]">
                    <div className="flex items-center justify-between gap-3">
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{item.name}</span>
                      <span className="shrink-0 text-xs font-bold text-orange-500">{item.kcal} kcal</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-3 text-[11.5px] text-zinc-400">
                      <span className="truncate">{item.portion}</span>
                      <span className="shrink-0">P {item.p}g · C {item.c}g · F {item.f}g</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </div>

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-3 text-[12.5px] leading-relaxed text-zinc-500 dark:border-white/[.06] dark:bg-white/[.03] dark:text-zinc-400">
        <Info size={14} className="mt-0.5 shrink-0 text-sky-400" />
        This plan offers general wellness-oriented nutrition guidance based on your goal and estimated calorie needs. It does not diagnose or treat any medical condition — consult a registered dietitian or physician for personalized medical nutrition therapy.
      </div>
    </>
  )
}
