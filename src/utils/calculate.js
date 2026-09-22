/** Fitness math — all outputs are ESTIMATES for general wellness purposes, not medical advice. */

export const calcBMI = (weightKg, heightCm) => {
  const h = Number(heightCm) / 100
  const w = Number(weightKg)
  if (!h || !w) return null
  return Math.round((w / (h * h)) * 10) / 10
}

export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', tone: 'sky', color: '#38bdf8' },
  { max: 25, label: 'Healthy', tone: 'emerald', color: '#34d399' },
  { max: 30, label: 'Overweight', tone: 'amber', color: '#fbbf24' },
  { max: Infinity, label: 'Obese', tone: 'rose', color: '#fb7185' },
]

export const bmiCategory = (bmi) => {
  if (bmi == null) return { label: '—', tone: 'zinc', color: '#a1a1aa', index: -1 }
  const index = BMI_CATEGORIES.findIndex((c) => bmi < c.max)
  return { ...BMI_CATEGORIES[index], index }
}

export const ACTIVITY_MULTIPLIERS = {
  Sedentary: 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
}

/** Mifflin–St Jeor Basal Metabolic Rate */
export const calcBMR = ({ weight, height, age, gender }) => {
  const w = Number(weight), h = Number(height), a = Number(age)
  if (!w || !h || !a) return null
  return Math.round(gender === 'female' ? 10 * w + 6.25 * h - 5 * a - 161 : 10 * w + 6.25 * h - 5 * a + 5)
}

export const calcTDEE = (profile) => {
  const bmr = calcBMR(profile)
  if (!bmr) return null
  const m = ACTIVITY_MULTIPLIERS[profile.activityLevel] || 1.375
  return Math.round(bmr * m)
}

const GOAL_ADJUSTMENTS = {
  // Current taxonomy
  'Weight Loss': -400,
  'Muscle Gain': 300,
  'Maintain Weight': 0,
  'Improve Fitness': 0,
  Strength: 200,
  // Legacy values kept so previously saved profiles keep working
  'Weight Gain': 350,
  'Muscle Building': 300,
  Maintenance: 0,
  'General Fitness': 0,
}

export const calcCalorieTarget = (profile) => {
  const tdee = calcTDEE(profile)
  if (!tdee) return null
  return Math.max(1200, Math.round((tdee + (GOAL_ADJUSTMENTS[profile.goal] ?? 0)) / 10) * 10)
}

const MACRO_SPLITS = {
  // Current taxonomy
  'Weight Loss': { p: 0.30, c: 0.35, f: 0.35 },
  'Muscle Gain': { p: 0.30, c: 0.45, f: 0.25 },
  'Maintain Weight': { p: 0.25, c: 0.45, f: 0.30 },
  'Improve Fitness': { p: 0.25, c: 0.45, f: 0.30 },
  Strength: { p: 0.30, c: 0.40, f: 0.30 },
  // Legacy values
  'Weight Gain': { p: 0.25, c: 0.50, f: 0.25 },
  'Muscle Building': { p: 0.30, c: 0.45, f: 0.25 },
  Maintenance: { p: 0.25, c: 0.45, f: 0.30 },
  'General Fitness': { p: 0.25, c: 0.45, f: 0.30 },
}

/** Goals focused on building muscle / strength */
export const isMuscleGoal = (goal) => ['Muscle Gain', 'Muscle Building', 'Strength', 'Weight Gain'].includes(goal)
/** Goals aiming to reduce body weight */
export const isFatLossGoal = (goal) => goal === 'Weight Loss'

export const calcMacroTargets = (profile) => {
  const cal = calcCalorieTarget(profile)
  if (!cal) return null
  const s = MACRO_SPLITS[profile.goal] || MACRO_SPLITS.Maintenance
  return {
    calories: cal,
    protein: Math.round((cal * s.p) / 4),
    carbs: Math.round((cal * s.c) / 4),
    fats: Math.round((cal * s.f) / 9),
  }
}

export const healthyWeightRange = (heightCm) => {
  const h = Number(heightCm) / 100
  if (!h) return null
  return { min: Math.round(18.5 * h * h), max: Math.round(24.9 * h * h) }
}

export const weeklyWorkoutTarget = (experienceLevel) => (
  { Beginner: 3, Intermediate: 4, Advanced: 5 }[experienceLevel] || 3
)

export const GOALS = ['Weight Loss', 'Muscle Gain', 'Maintain Weight', 'Improve Fitness', 'Strength']
export const ACTIVITY_LEVELS = ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']
export const WORKOUT_PREFERENCES = ['Home Workout', 'Gym Workout']
export const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']
export const FOOD_PREFERENCES = ['Vegetarian', 'Non-Vegetarian', 'Other']
export const GENDERS = ['Male', 'Female']
