import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Ruler, Scale, Flame, Target, Zap, Info, ArrowRight, Gauge } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import ProgressRing from '@/components/ui/ProgressRing'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { calcBMI, bmiCategory, BMI_CATEGORIES, calcBMR, calcTDEE, calcCalorieTarget, calcMacroTargets, healthyWeightRange } from '@/utils/calculate'
import { Skeleton } from '@/components/ui/Feedback'

export default function BodyAnalysis() {
  const { fitness } = useAuth()
  const { entries, dataLoading } = useData()

  const weight = useMemo(() => entries.find((e) => e.weight)?.weight ?? fitness?.weight ?? null, [entries, fitness])
  const bmi = weight && fitness?.height ? calcBMI(weight, fitness.height) : null
  const cat = bmiCategory(bmi)
  const bmr = fitness ? calcBMR({ ...fitness, weight }) : null
  const tdee = fitness ? calcTDEE({ ...fitness, weight }) : null
  const target = fitness ? calcCalorieTarget({ ...fitness, weight }) : null
  const macros = fitness ? calcMacroTargets({ ...fitness, weight }) : null
  const range = fitness?.height ? healthyWeightRange(fitness.height) : null

  if (dataLoading) {
    return (
      <>
        <PageHeader title="Body Analysis" subtitle="Loading your estimates…" />
        <div className="grid gap-5 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl" />
          <div className="grid gap-4 lg:col-span-2"><Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-40 rounded-2xl" /></div>
        </div>
      </>
    )
  }

  if (!fitness) {
    return (
      <>
        <PageHeader title="Body Analysis" />
        <Card className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Complete your fitness profile first — then your analysis will appear here.
        </Card>
      </>
    )
  }

  // Marker position on the 15–35 BMI scale
  const bmiPos = bmi != null ? Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100)) : 0

  return (
    <>
      <PageHeader
        title="Body Analysis"
        subtitle="Wellness estimates computed from your profile — for guidance, not diagnosis."
        badge={<Badge tone="sky"><Info size={11} /> Estimates</Badge>}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* BMI ring */}
        <Card className="animate-fade-up flex flex-col items-center p-7">
          <ProgressRing
            value={bmi != null ? Math.min(100, (bmi / 40) * 100) : 0}
            size={168} stroke={13}
            color={cat.color}
            label={bmi ?? '—'}
            sub="BMI"
          >
            <div className="text-center">
              <p className="font-display text-4xl font-bold text-zinc-900 dark:text-white">{bmi ?? '—'}</p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-zinc-400">BMI</p>
            </div>
          </ProgressRing>
          <Badge tone={cat.tone} className="mt-4 !px-4 !py-1.5 !text-[13px]">{cat.label}</Badge>
          <div className="mt-6 w-full">
            <div className="relative h-3 w-full overflow-hidden rounded-full">
              <div className="absolute inset-0 flex">
                <span className="h-full bg-sky-400" style={{ width: '17.5%' }} />
                <span className="h-full bg-emerald-400" style={{ width: '32.5%' }} />
                <span className="h-full bg-amber-400" style={{ width: '25%' }} />
                <span className="h-full bg-rose-400" style={{ width: '25%' }} />
              </div>
              {bmi != null && (
                <span className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-zinc-900 shadow-lg transition-all duration-700 dark:border-zinc-900 dark:bg-white" style={{ left: `${bmiPos}%` }} />
              )}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              <span>Under</span><span>Healthy</span><span>Over</span><span>Obese</span>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <StatCard delay={0} icon={Ruler} tone="sky" label="Height" value={fitness.height} unit="cm" />
            <StatCard delay={60} icon={Scale} tone="emerald" label="Weight" value={weight ?? '—'} unit="kg" sub={entries.find((e) => e.weight) ? 'Latest logged' : 'From profile'} />
            <StatCard delay={120} icon={Flame} tone="orange" label="Est. Daily Need" value={tdee?.toLocaleString() ?? '—'} unit="kcal" sub={`BMR ≈ ${bmr?.toLocaleString() ?? '—'} kcal`} />
            <StatCard delay={180} icon={Target} tone="violet" label="Goal Target" value={target?.toLocaleString() ?? '—'} unit="kcal" sub={fitness.goal} />
          </div>

          <Card className="animate-fade-up p-6" style={{ animationDelay: '120ms' }}>
            <CardHeader icon={Gauge} title="Body Overview" subtitle="Everything your plans are built on" />
            <dl className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {[
                ['Fitness Goal', fitness.goal, Target],
                ['Activity Level', fitness.activityLevel, Zap],
                ['Healthy Weight Range', range ? `${range.min}–${range.max} kg` : '—', Scale],
                ['Experience Level', fitness.experienceLevel, Activity],
              ].map(([label, value, Icon]) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-zinc-50 px-4 py-3 dark:border-white/[.06] dark:bg-white/[.03]">
                  <Icon size={16} className="shrink-0 text-emerald-500" />
                  <dt className="text-[13px] text-zinc-500 dark:text-zinc-400">{label}</dt>
                  <dd className="ml-auto truncate text-[13px] font-bold text-zinc-900 dark:text-white">{value}</dd>
                </div>
              ))}
            </dl>
            {macros && (
              <div className="mt-5 grid grid-cols-4 gap-3">
                {[['Calories', macros.calories, 'kcal', 'text-orange-500'], ['Protein', macros.protein, 'g', 'text-sky-500'], ['Carbs', macros.carbs, 'g', 'text-amber-500'], ['Fats', macros.fats, 'g', 'text-rose-500']].map(([l, v, u, c]) => (
                  <div key={l} className="rounded-xl border border-zinc-200/70 p-3 text-center dark:border-white/[.06]">
                    <p className={`font-display text-lg font-bold ${c}`}>{v.toLocaleString()}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{l} ({u})</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="animate-fade-up p-6" style={{ animationDelay: '180ms' }}>
            <CardHeader icon={Info} title="About these numbers" />
            <p className="mt-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Your BMI and calorie figures are <strong className="text-zinc-700 dark:text-zinc-200">estimates for general wellness purposes only</strong> — they are <strong className="text-zinc-700 dark:text-zinc-200">not medical diagnoses</strong> and don't account for body composition, bone density or health conditions. Always consult a qualified professional for personal medical guidance.
            </p>
            <Link to="/diet" className="btn-outline mt-4 px-4 py-2 text-[13px]">See your nutrition guidance <ArrowRight size={14} /></Link>
          </Card>
        </div>
      </div>
    </>
  )
}
