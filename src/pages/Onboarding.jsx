import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  User, Target, Zap, Dumbbell, UtensilsCrossed, Check, ArrowLeft, ArrowRight, Sparkles,
  Armchair, Footprints, Bike, Flame, Leaf, Drumstick, Utensils, Scale, Ruler, Cake, TrendingUp,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import TagInput from '@/components/ui/TagInput'
import { PageLoader } from '@/components/ui/Feedback'
import { useAuth } from '@/context/AuthContext'
import { useData } from '@/context/DataContext'
import { useToast } from '@/context/ToastContext'
import { saveFitnessProfile, updateUserDoc } from '@/services/firestore'
import { generateWorkoutPlan } from '@/services/ai/workoutGenerator'
import { generateDietPlan } from '@/services/ai/dietGenerator'
import { GENDERS, GOALS, ACTIVITY_LEVELS, WORKOUT_PREFERENCES, EXPERIENCE_LEVELS, FOOD_PREFERENCES } from '@/utils/calculate'

const STEPS = [
  { id: 'personal', title: 'Personal Information', icon: User, desc: 'This powers your BMI and calorie estimates.' },
  { id: 'goal', title: 'Your Fitness Goal', icon: Target, desc: 'Plans are built around what you want to achieve.' },
  { id: 'activity', title: 'Activity Level', icon: Zap, desc: 'How active are you outside of workouts?' },
  { id: 'training', title: 'Training Style', icon: Dumbbell, desc: 'Where and how do you like to train?' },
  { id: 'food', title: 'Food & Allergies', icon: UtensilsCrossed, desc: 'Your diet plan matches these preferences.' },
  { id: 'review', title: 'Review & Generate', icon: Sparkles, desc: 'Confirm and we\u2019ll build your plans.' },
]

const ACTIVITY_OPTS = [
  { v: 'Sedentary', icon: Armchair, d: 'Mostly sitting, little movement' },
  { v: 'Lightly Active', icon: Footprints, d: 'Light walking, 1–2 light days' },
  { v: 'Moderately Active', icon: Bike, d: 'Active 3–5 days a week' },
  { v: 'Very Active', icon: Flame, d: 'Intense training most days' },
]

const GOAL_ICONS = {
  'Weight Loss': Scale,
  'Muscle Gain': TrendingUp,
  'Maintain Weight': Check,
  'Improve Fitness': Flame,
  Strength: Dumbbell,
  // legacy values (previously saved profiles)
  'Weight Gain': TrendingUp,
  'Muscle Building': Dumbbell,
  Maintenance: Check,
  'General Fitness': Flame,
}

function OptionGrid({ options, value, onChange, cols = 'sm:grid-cols-2', withIcons = false }) {
  return (
    <div className={`grid gap-3 ${cols}`}>
      {options.map((o) => {
        const label = typeof o === 'string' ? o : o.v
        const desc = typeof o === 'string' ? null : o.d
        const Icon = withIcons ? (GOAL_ICONS[label] || Check) : null
        const active = value === label
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 active:scale-[.98]
              ${active
                ? 'border-emerald-400 bg-gradient-to-r from-lime-400/15 to-emerald-500/10 shadow-glow-lime'
                : 'border-zinc-200 bg-white hover:border-emerald-300 dark:border-white/[.08] dark:bg-white/[.03] dark:hover:border-emerald-400/40'}`}
          >
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${active ? 'bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950' : 'bg-zinc-100 text-zinc-400 dark:bg-white/[.06] dark:text-zinc-500'}`}>
              {Icon ? <Icon size={16} /> : <Check size={16} className={active ? 'opacity-100' : 'opacity-40'} />}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm font-semibold ${active ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-800 dark:text-zinc-200'}`}>{label}</span>
              {desc && <span className="mt-0.5 block text-xs text-zinc-400 dark:text-zinc-500">{desc}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

const METAS = { age: 'Age', gender: 'Gender', height: 'Height (cm)', weight: 'Weight (kg)', goal: 'Fitness Goal', goalWeight: 'Goal Weight', activityLevel: 'Activity Level', workoutPreference: 'Workout Preference', experienceLevel: 'Experience Level', foodPreferences: 'Food Preference' }

export default function Onboarding() {
  const { user, profile, fitness, loading } = useAuth()
  const { savePlan, saveDiet } = useData()
  const toast = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState({
    age: '', gender: 'Male', height: '', weight: '',
    goal: '', goalWeight: '', activityLevel: '', workoutPreference: 'Home Workout',
    experienceLevel: '', foodPreferences: '', allergies: [],
  })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => { setData((d) => ({ ...d, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })) }
  const setVal = (k) => (v) => { setData((d) => ({ ...d, [k]: v })); setErrors((er) => ({ ...er, [k]: undefined })) }

  const validate = () => {
    const er = {}
    const s = STEPS[step].id
    if (s === 'personal') {
      const age = Number(data.age), h = Number(data.height), w = Number(data.weight)
      if (!age || age < 10 || age > 90) er.age = 'Enter an age between 10 and 90.'
      if (!h || h < 120 || h > 230) er.height = 'Enter height in cm (120–230).'
      if (!w || w < 25 || w > 300) er.weight = 'Enter weight in kg (25–300).'
    }
    if (s === 'goal' && !data.goal) er.goal = 'Pick the goal that fits you best.'
    if (s === 'activity' && !data.activityLevel) er.activityLevel = 'Select your typical activity level.'
    if (s === 'training' && !data.experienceLevel) er.experienceLevel = 'Select your experience level.'
    if (s === 'food' && !data.foodPreferences) er.foodPreferences = 'Select a food preference.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)) }
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const finish = async () => {
    setSaving(true)
    const clean = {
      age: Number(data.age),
      gender: data.gender,
      height: Number(data.height),
      weight: Number(data.weight),
      goal: data.goal,
      goalWeight: data.goalWeight ? Number(data.goalWeight) : null,
      activityLevel: data.activityLevel,
      workoutPreference: data.workoutPreference,
      experienceLevel: data.experienceLevel,
      foodPreferences: data.foodPreferences,
      allergies: data.allergies,
    }
    const results = { profile: false, workout: false, diet: false, flag: false }
    try { await saveFitnessProfile(user.uid, clean); results.profile = true } catch { /* rules/network */ }
    try { await savePlan(generateWorkoutPlan(clean)); results.workout = true } catch { /* rules/network */ }
    try { await saveDiet(generateDietPlan(clean)); results.diet = true } catch { /* rules/network */ }
    try { await updateUserDoc(user.uid, { onboardingCompleted: true }); results.flag = true } catch { /* rules/network */ }

    if (results.profile && results.workout && results.diet && results.flag) {
      toast.success('Your AI plans are ready. Welcome to day one! 🔥', 'Onboarding complete')
      navigate('/dashboard', { replace: true })
    } else if (results.profile || results.workout || results.diet || results.flag) {
      toast.warning('Some data could not be saved — check your connection or Firestore rules. You can retry from My Profile.', 'Partially saved')
      navigate('/dashboard', { replace: true })
    } else {
      toast.error('Nothing could be saved to Firestore — your security rules are blocking writes. Deploy firestore.rules from the project root, then try again.')
      setSaving(false)
    }
  }

  const pct = Math.round(((step + 1) / STEPS.length) * 100)
  const StepIcon = STEPS[step].icon
  const summary = useMemo(() => Object.entries(METAS).filter(([k]) => data[k] !== '' && data[k] != null).map(([k, label]) => [label, Array.isArray(data[k]) ? data[k].join(', ') || 'None' : data[k]]), [data])

  if (loading) return <PageLoader label="Preparing your onboarding…" />
  if (profile?.onboardingCompleted) return <Navigate to="/dashboard" replace />

  return (
    <div className="flex min-h-screen flex-col px-5 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <Logo />
          <span className="text-[13px] font-semibold text-zinc-400">{pct}% complete</span>
        </div>

        {/* Stepper */}
        <div className="mb-8 flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[.08]">
              <div className={`h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-500 transition-all duration-500 ${i <= step ? 'w-full' : 'w-0'}`} />
            </div>
          ))}
        </div>

        <div key={step} className="card animate-fade-up p-6 sm:p-8">
          <div className="mb-6 flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950 shadow-glow-lime">
              <StepIcon size={22} />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold text-zinc-900 dark:text-white">{STEPS[step].title}</h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{STEPS[step].desc}</p>
            </div>
          </div>

          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Age" icon={Cake} type="number" min="10" max="90" placeholder="e.g. 24" value={data.age} onChange={set('age')} error={errors.age} />
              <Select label="Gender" icon={User} options={GENDERS} value={data.gender} onChange={set('gender')} />
              <Input label="Height (cm)" icon={Ruler} type="number" min="120" max="230" placeholder="e.g. 170" value={data.height} onChange={set('height')} error={errors.height} />
              <Input label="Weight (kg)" icon={Scale} type="number" min="25" max="300" placeholder="e.g. 68" value={data.weight} onChange={set('weight')} error={errors.weight} />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <OptionGrid options={GOALS} value={data.goal} onChange={setVal('goal')} withIcons />
              {errors.goal && <p className="text-xs font-medium text-rose-500">{errors.goal}</p>}
              <Input label="Goal Weight (kg) — optional" icon={Target} type="number" placeholder="e.g. 62" value={data.goalWeight} onChange={set('goalWeight')} hint="Used to show progress toward your target." />
            </div>
          )}

          {step === 2 && (
            <div>
              <OptionGrid options={ACTIVITY_OPTS} value={data.activityLevel} onChange={setVal('activityLevel')} />
              {errors.activityLevel && <p className="mt-3 text-xs font-medium text-rose-500">{errors.activityLevel}</p>}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="label">Workout Preference</p>
                <OptionGrid options={WORKOUT_PREFERENCES} value={data.workoutPreference} onChange={setVal('workoutPreference')} />
              </div>
              <div>
                <p className="label">Experience Level</p>
                <OptionGrid options={EXPERIENCE_LEVELS} value={data.experienceLevel} onChange={setVal('experienceLevel')} />
                {errors.experienceLevel && <p className="mt-3 text-xs font-medium text-rose-500">{errors.experienceLevel}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <p className="label">Food Preference</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[[FOOD_PREFERENCES[0], Leaf], [FOOD_PREFERENCES[1], Drumstick], [FOOD_PREFERENCES[2], Utensils]].map(([label, Icon]) => {
                    const active = data.foodPreferences === label
                    return (
                      <button key={label} type="button" onClick={() => setVal('foodPreferences')(label)}
                        className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all active:scale-[.98] ${active ? 'border-emerald-400 bg-gradient-to-b from-lime-400/15 to-emerald-500/10 shadow-glow-lime' : 'border-zinc-200 bg-white hover:border-emerald-300 dark:border-white/[.08] dark:bg-white/[.03]'}`}>
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? 'bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950' : 'bg-zinc-100 text-zinc-400 dark:bg-white/[.06]'}`}><Icon size={18} /></span>
                        <span className={`text-[13px] font-semibold ${active ? 'text-emerald-600 dark:text-emerald-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{label}</span>
                      </button>
                    )
                  })}
                </div>
                {errors.foodPreferences && <p className="mt-3 text-xs font-medium text-rose-500">{errors.foodPreferences}</p>}
              </div>
              <div>
                <p className="label">Food Allergies</p>
                <TagInput values={data.allergies} onChange={(v) => setData((d) => ({ ...d, allergies: v }))} placeholder="e.g. peanuts, milk, shellfish — press Enter to add" />
                <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">We'll exclude these from your meal suggestions.</p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {summary.map(([label, v]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm dark:border-white/[.07] dark:bg-white/[.03]">
                    <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
                    <span className="truncate font-semibold text-zinc-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 rounded-xl border border-sky-500/25 bg-sky-500/[.06] px-4 py-3 text-[13px] leading-relaxed text-sky-700 dark:text-sky-300">
                On confirm we'll generate your personalized workout & diet plans and save everything securely to your account. All figures are general wellness estimates, not medical advice.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={back} disabled={step === 0 || saving}><ArrowLeft size={15} /> Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Continue <ArrowRight size={15} /></Button>
            ) : (
              <Button onClick={finish} loading={saving} icon={<Sparkles size={15} />}>Generate My Plans</Button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Step {step + 1} of {STEPS.length} · {user?.email}
        </p>
      </div>
    </div>
  )
}
