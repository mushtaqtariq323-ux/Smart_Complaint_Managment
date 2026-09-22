import { EXERCISES } from '@/data/exercises'
import { isMuscleGoal, isFatLossGoal } from '@/utils/calculate'

/** Heuristic "AI" workout planner — personalizes a weekly split from the user's fitness profile. */

const DIFF_LABEL = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
const maxLevelFor = (exp) => ({ Beginner: 1, Intermediate: 2, Advanced: 3 }[exp] || 1)

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const poolFor = (preference) =>
  EXERCISES.filter((e) => (preference === 'Gym Workout' ? e.place !== 'home' : e.place !== 'gym'))

const FOCUS_GROUPS = {
  'Full Body A': ['legs', 'chest', 'back', 'core', 'cardio'],
  'Full Body B': ['back', 'legs', 'shoulders', 'core', 'cardio'],
  'Full Body C': ['chest', 'legs', 'back', 'arms', 'core'],
  'Upper Body': ['chest', 'back', 'shoulders', 'arms', 'core'],
  'Lower Body': ['legs', 'glutes', 'legs', 'core'],
  'Push Day': ['chest', 'shoulders', 'arms', 'chest', 'core'],
  'Pull Day': ['back', 'arms', 'back', 'core'],
  'Leg Day': ['legs', 'glutes', 'legs', 'core'],
  'Cardio & Core': ['cardio', 'core', 'cardio', 'core'],
  Cardio: ['cardio', 'cardio', 'legs'],
}

const SPLITS = {
  3: ['Full Body A', 'Rest', 'Full Body B', 'Rest', 'Full Body C', 'Cardio & Core', 'Rest'],
  4: ['Upper Body', 'Lower Body', 'Rest', 'Full Body B', 'Cardio & Core', 'Rest', 'Rest'],
  5: ['Push Day', 'Pull Day', 'Leg Day', 'Full Body C', 'Cardio & Core', 'Rest', 'Rest'],
}

const GOAL_REPS = {
  'Weight Loss': [12, 15],
  'Muscle Gain': [8, 12],
  'Maintain Weight': [10, 14],
  'Improve Fitness': [10, 15],
  Strength: [4, 6],
  // Legacy values
  'Weight Gain': [8, 12],
  'Muscle Building': [8, 12],
  Maintenance: [10, 14],
  'General Fitness': [10, 15],
}

const sessionMinutes = (activityLevel) =>
  ({ Sedentary: 30, 'Lightly Active': 35, 'Moderately Active': 45, 'Very Active': 50 }[activityLevel] || 40)

const estMinutes = (ex, pres) => {
  const rest = Number(ex.rest) || 60
  if (ex.units === 'time') {
    if (ex.durSec >= 600) return Math.round(ex.durSec / 60)
    return Math.max(3, Math.round((pres.sets * (ex.durSec + rest)) / 60))
  }
  return Math.max(3, Math.round((pres.sets * (40 + rest)) / 60))
}

const buildPrescription = (ex, fitness) => {
  const exp = fitness.experienceLevel || 'Beginner'
  const goal = fitness.goal || 'Improve Fitness'
  const maxLevel = maxLevelFor(exp)
  const effLevel = Math.min(ex.level, maxLevel)
  const rest = isMuscleGoal(goal) ? Math.max(ex.rest, goal === 'Strength' ? 105 : 75) : isFatLossGoal(goal) ? Math.min(ex.rest, 60) : ex.rest
  if (ex.units === 'time') {
    const sets = ex.durSec >= 600 ? 1 : Math.max(2, ex.sets - (exp === 'Beginner' ? 1 : 0))
    return { sets, reps: '—', duration: ex.durSec >= 600 ? `${Math.round(ex.durSec / 60)} min` : `${sets} × ${ex.durSec}s`, rest: `${rest}s`, group: ex.groups[0], level: effLevel }
  }
  const range = GOAL_REPS[goal] || GOAL_REPS['General Fitness']
  const sets = exp === 'Beginner' ? Math.max(2, ex.sets - 1) : ex.sets
  return { sets, reps: `${range[0]}–${range[1]}`, duration: '—', rest: `${rest}s`, group: ex.groups[0], level: effLevel }
}

const makePlannedExercise = (ex, fitness) => {
  const pres = buildPrescription(ex, fitness)
  return {
    id: ex.id,
    name: ex.name,
    sets: pres.sets,
    reps: pres.reps,
    rest: pres.rest,
    duration: pres.duration,
    difficulty: DIFF_LABEL[pres.level],
    group: pres.group,
    estMin: estMinutes(ex, pres),
    instructions: ex.instructions,
  }
}

const pickForGroup = (group, pool, maxLevel, used) => {
  const candidates = shuffle(pool.filter((e) => e.groups.includes(group) && !used.has(e.id) && e.level <= maxLevel))
  return candidates[0] || null
}

const buildDay = (focus, targetMin, fitness) => {
  const pool = poolFor(fitness.workoutPreference)
  const maxLevel = maxLevelFor(fitness.experienceLevel)
  const groups = FOCUS_GROUPS[focus] || FOCUS_GROUPS['Full Body A']
  const used = new Set()
  const out = []
  let minutes = 0
  if (!Number.isFinite(targetMin)) return { exercises: [], duration: 30 }
  let longCardioUsed = 0
  // Round-robin the focus groups so each area gets covered before adding extras
  for (let pass = 0; pass < 3 && minutes < targetMin - 2 && out.length < 7; pass += 1) {
    for (const g of groups) {
      if (minutes >= targetMin - 2 || out.length >= 7) break
      const ex = pickForGroup(g, pool, maxLevel, used)
      if (!ex) continue
      if ((ex.durSec || 0) >= 600) {
        // at most one long cardio block per day so the session keeps variety
        if (longCardioUsed >= 1) continue
        longCardioUsed += 1
      }
      used.add(ex.id)
      const planned = makePlannedExercise(ex, fitness)
      out.push(planned)
      minutes += planned.estMin
    }
  }
  // Top up short days with unused quick exercises so every session feels complete
  if (out.length < 4) {
    const extras = shuffle(pool.filter((e) => !used.has(e.id) && e.level <= maxLevel && (e.durSec || 0) < 600))
    for (const ex of extras) {
      if (out.length >= 4) break
      used.add(ex.id)
      const planned = makePlannedExercise(ex, fitness)
      out.push(planned)
      minutes += planned.estMin
    }
  }
  return { exercises: out, duration: Math.max(15, minutes) }
}

export function generateWorkoutPlan(fitness) {
  const exp = fitness.experienceLevel || 'Beginner'
  const daysPerWeek = { Beginner: 3, Intermediate: 4, Advanced: 5 }[exp] || 3
  let split = [...SPLITS[daysPerWeek]]
  if (fitness.goal === 'Weight Loss' && split.includes('Full Body C')) {
    split[split.indexOf('Full Body C')] = 'Cardio & Core'
  }
  if (isMuscleGoal(fitness.goal) && split.includes('Cardio & Core')) {
    split[split.indexOf('Cardio & Core')] = 'Full Body C'
  }

  const target = sessionMinutes(fitness.activityLevel)
  const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const days = split.map((focus, i) => {
    if (focus === 'Rest') {
      return {
        day: DAY_NAMES[i], focus: 'Active Recovery', type: 'rest', duration: 20, difficulty: '—',
        suggestion: 'A 20–30 minute walk, gentle stretching or yoga. Recovery is when your body rebuilds stronger.',
        exercises: [],
      }
    }
    const { exercises, duration } = buildDay(focus, target, fitness)
    return {
      day: DAY_NAMES[i], focus, type: 'workout', duration, exercises,
      difficulty: DIFF_LABEL[Math.min(maxLevelFor(exp), 3)],
    }
  })

  return {
    goal: fitness.goal || 'Improve Fitness',
    preference: fitness.workoutPreference || 'Home Workout',
    experienceLevel: exp,
    daysPerWeek,
    days,
    generatedAt: new Date().toISOString(),
  }
}

/** Regenerate the same plan for a different training place ('Home Workout' | 'Gym Workout'). */
export const regenerateForPreference = (fitness, preference) =>
  generateWorkoutPlan({ ...fitness, workoutPreference: preference })

/** Swap one exercise for an unused alternative from the same muscle group. */
export function replaceExerciseInPlan(plan, dayIndex, exIndex) {
  const day = plan.days[dayIndex]
  const current = day.exercises[exIndex]
  if (!current) return plan
  const pool = poolFor(plan.preference)
  const maxLevel = maxLevelFor(plan.experienceLevel)
  const used = new Set(day.exercises.map((e) => e.id))
  let candidates = pool.filter((e) => e.groups.includes(current.group) && !used.has(e.id) && e.level <= maxLevel)
  if (!candidates.length) candidates = pool.filter((e) => !used.has(e.id) && e.level <= maxLevel)
  if (!candidates.length) return null
  const next = shuffle(candidates)[0]
  const fitness = {
    experienceLevel: plan.experienceLevel,
    goal: plan.goal,
    workoutPreference: plan.preference,
  }
  const planned = makePlannedExercise(next, fitness)
  const days = plan.days.map((d, i) => (i === dayIndex
    ? { ...d, exercises: d.exercises.map((e, j) => (j === exIndex ? planned : e)) }
    : d))
  return { ...plan, days, generatedAt: new Date().toISOString() }
}

export const todayPlanDay = (plan) => {
  if (!plan) return null
  const name = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][(new Date().getDay() + 6) % 7]
  return plan.days.find((d) => d.day === name) || null
}
