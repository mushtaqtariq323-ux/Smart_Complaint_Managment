import { useEffect, useMemo, useState } from 'react'
import { User, Mail, Cake, Ruler, Scale, Target, Zap, Dumbbell, GraduationCap, UtensilsCrossed, Save, ShieldCheck, Award } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Input, Select } from '@/components/ui/Input'
import TagInput from '@/components/ui/TagInput'
import { Skeleton } from '@/components/ui/Feedback'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { updateUserDoc, saveFitnessProfile } from '@/services/firestore'
import {
  GENDERS, GOALS, ACTIVITY_LEVELS, WORKOUT_PREFERENCES, EXPERIENCE_LEVELS, FOOD_PREFERENCES,
} from '@/utils/calculate'

export default function Profile() {
  const { user, profile, fitness, loading } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile && fitness) {
      setForm({
        name: profile.name || '',
        email: user?.email || '',
        age: fitness.age ?? '',
        gender: fitness.gender || 'Male',
        height: fitness.height ?? '',
        weight: fitness.weight ?? '',
        goal: fitness.goal || '',
        goalWeight: fitness.goalWeight ?? '',
        activityLevel: fitness.activityLevel || '',
        workoutPreference: fitness.workoutPreference || '',
        experienceLevel: fitness.experienceLevel || '',
        foodPreferences: fitness.foodPreferences || '',
        allergies: fitness.allergies || [],
      })
    }
  }, [profile, fitness, user])

  const memberSince = useMemo(() => {
    try {
      const d = profile?.createdAt?.toDate?.() || null
      return d ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null
    } catch { return null }
  }, [profile])

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })) }

  const save = async () => {
    const er = {}
    if (!form.name || form.name.trim().length < 2) er.name = 'Name must be at least 2 characters.'
    const age = Number(form.age), h = Number(form.height), w = Number(form.weight)
    if (!age || age < 10 || age > 90) er.age = 'Age must be 10–90.'
    if (!h || h < 120 || h > 230) er.height = 'Height must be 120–230 cm.'
    if (!w || w < 25 || w > 300) er.weight = 'Weight must be 25–300 kg.'
    setErrors(er)
    if (Object.keys(er).length) return

    setSaving(true)
    try {
      await updateUserDoc(user.uid, { name: form.name.trim() })
      await saveFitnessProfile(user.uid, {
        age, gender: form.gender,
        height: h, weight: w,
        goal: form.goal,
        goalWeight: form.goalWeight ? Number(form.goalWeight) : null,
        activityLevel: form.activityLevel,
        workoutPreference: form.workoutPreference,
        experienceLevel: form.experienceLevel,
        foodPreferences: form.foodPreferences,
        allergies: form.allergies,
      })
      toast.success('Profile saved. Your plans will use this updated info.', 'Changes saved')
    } catch {
      toast.error('Could not save changes. Check your connection and try again.')
    } finally { setSaving(false) }
  }

  if (loading || !form) {
    return (
      <>
        <PageHeader title="My Profile" subtitle="Loading your details…" />
        <div className="grid gap-5 lg:grid-cols-2"><Skeleton className="h-72 rounded-2xl" /><Skeleton className="h-72 rounded-2xl" /></div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="My Profile"
        subtitle="Your account and fitness information — everything here personalizes your plans."
        badge={memberSince && <Badge tone="emerald"><Award size={11} /> Member since {memberSince}</Badge>}
        actions={<Button icon={<Save size={15} />} loading={saving} onClick={save}>Save Changes</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="animate-fade-up p-6">
          <CardHeader icon={User} title="Account" subtitle="Basic identity & login details" />
          <div className="mt-5 space-y-4">
            <Input label="Full Name" icon={User} value={form.name} onChange={set('name')} error={errors.name} />
            <Input
              label="Email" icon={Mail} value={form.email} readOnly
              hint="Email is your login ID and can't be changed here."
              className="opacity-80"
            />
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[.06] px-4 py-3 text-[12.5px] leading-relaxed text-emerald-700 dark:text-emerald-300">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              Your data lives in Firestore under your unique UID — no other user can read or modify it.
            </div>
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: '80ms' }}>
          <CardHeader icon={Ruler} title="Body Metrics" subtitle="Used for BMI & calorie estimates" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Input label="Age" icon={Cake} type="number" value={form.age} onChange={set('age')} error={errors.age} />
            <Select label="Gender" icon={User} options={GENDERS} value={form.gender} onChange={set('gender')} />
            <Input label="Height (cm)" icon={Ruler} type="number" value={form.height} onChange={set('height')} error={errors.height} />
            <Input label="Weight (kg)" icon={Scale} type="number" value={form.weight} onChange={set('weight')} error={errors.weight} />
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: '140ms' }}>
          <CardHeader icon={Target} title="Fitness Profile" subtitle="Drives your workout & diet plans" />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Select label="Fitness Goal" icon={Target} options={GOALS} value={form.goal} onChange={set('goal')} />
            <Input label="Goal Weight (kg) — optional" icon={Scale} type="number" value={form.goalWeight ?? ''} onChange={set('goalWeight')} />
            <Select label="Activity Level" icon={Zap} options={ACTIVITY_LEVELS} value={form.activityLevel} onChange={set('activityLevel')} />
            <Select label="Workout Preference" icon={Dumbbell} options={WORKOUT_PREFERENCES} value={form.workoutPreference} onChange={set('workoutPreference')} />
            <Select label="Experience Level" icon={GraduationCap} options={EXPERIENCE_LEVELS} value={form.experienceLevel} onChange={set('experienceLevel')} />
            <Select label="Food Preference" icon={UtensilsCrossed} options={FOOD_PREFERENCES} value={form.foodPreferences} onChange={set('foodPreferences')} />
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: '200ms' }}>
          <CardHeader icon={UtensilsCrossed} title="Food Allergies" subtitle="We filter these out of your diet plan" />
          <div className="mt-5">
            <TagInput values={form.allergies} onChange={(v) => setForm((f) => ({ ...f, allergies: v }))} placeholder="e.g. peanuts, milk, shellfish" />
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Press Enter or comma to add. Examples: peanuts, dairy, gluten, eggs, soy, fish, shellfish.</p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button icon={<Save size={15} />} loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
