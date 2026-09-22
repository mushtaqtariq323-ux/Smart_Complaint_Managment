import { FOODS, ALLERGEN_SYNONYMS } from '@/data/foods'
import { calcMacroTargets } from '@/utils/calculate'

/** Heuristic "AI" diet planner — builds a day of meals from targets, preferences & allergies. */

const MEAL_ORDER = ['breakfast', 'lunch', 'dinner', 'snacks']
const SPLIT = { breakfast: 0.25, lunch: 0.35, dinner: 0.30, snacks: 0.10 }
const MEAL_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' }

const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const allergenKeysFrom = (allergies = []) => {
  const keys = new Set()
  const tokens = []
  allergies.forEach((raw) => {
    String(raw).toLowerCase().split(/[\s,]+/).forEach((tok) => {
      if (!tok) return
      tokens.push(tok)
      if (ALLERGEN_SYNONYMS[tok]) keys.add(ALLERGEN_SYNONYMS[tok])
      if (tok.endsWith('s') && ALLERGEN_SYNONYMS[tok.slice(0, -1)]) keys.add(ALLERGEN_SYNONYMS[tok.slice(0, -1)])
    })
  })
  return { keys, tokens }
}

const isBlocked = (food, keys, tokens) => {
  if (food.allergens.some((a) => keys.has(a))) return true
  const name = food.name.toLowerCase()
  return tokens.some((t) => t.length >= 4 && name.includes(t))
}

const round5 = (n) => Math.max(0.5, Math.round(n * 2) / 2)

const buildMeal = (meal, budget, pool, attempt) => {
  const base = pool.filter((f) => f.meal === meal)
  if (!base.length) return { label: MEAL_LABEL[meal], items: [], kcal: 0, p: 0, c: 0, f: 0 }
  // rotate the pool so each regeneration offers fresh combinations
  const rotated = [...base.slice(attempt % base.length), ...base.slice(0, attempt % base.length)]
  const chosen = shuffle(rotated).slice(0, 4)
  // greedy pick to approach the calorie budget
  const picked = [chosen[0]]
  let total = chosen[0].kcal
  for (let i = 1; i < chosen.length && total < budget * 0.85; i += 1) {
    picked.push(chosen[i])
    total += chosen[i].kcal
  }
  // fine-tune with portion scaling
  const rawScale = budget / Math.max(total, 1)
  const scale = rawScale >= 0.92 && rawScale <= 1.08 ? 1 : round5(Math.min(1.5, Math.max(0.5, rawScale)))
  const items = picked.map((f) => ({
    id: f.id,
    name: f.name,
    portion: scale === 1 ? f.portion : `${f.portion} × ${scale}`,
    kcal: Math.round(f.kcal * scale),
    p: Math.round(f.p * scale),
    c: Math.round(f.c * scale),
    f: Math.round(f.f * scale),
  }))
  return {
    label: MEAL_LABEL[meal],
    items,
    kcal: items.reduce((s, i) => s + i.kcal, 0),
    p: items.reduce((s, i) => s + i.p, 0),
    c: items.reduce((s, i) => s + i.c, 0),
    f: items.reduce((s, i) => s + i.f, 0),
  }
}

export function generateDietPlan(fitness, attempt = Math.floor(Math.random() * 7)) {
  const targets = calcMacroTargets(fitness) || { calories: 2000, protein: 125, carbs: 225, fats: 67 }
  const vegOnly = fitness.foodPreferences === 'Vegetarian'
  const { keys, tokens } = allergenKeysFrom(fitness.allergies || [])
  const pool = FOODS.filter((food) => (vegOnly ? food.veg : true) && !isBlocked(food, keys, tokens))

  const meals = {}
  MEAL_ORDER.forEach((meal) => {
    meals[meal] = buildMeal(meal, targets.calories * SPLIT[meal], pool, attempt)
  })

  const totals = MEAL_ORDER.reduce(
    (acc, meal) => ({
      kcal: acc.kcal + meals[meal].kcal,
      p: acc.p + meals[meal].p,
      c: acc.c + meals[meal].c,
      f: acc.f + meals[meal].f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  )

  return {
    targets,
    meals,
    totals,
    preference: fitness.foodPreferences || 'Other',
    allergies: fitness.allergies || [],
    generatedAt: new Date().toISOString(),
  }
}
