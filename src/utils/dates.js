export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Local YYYY-MM-DD key */
export const dateKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const todayKey = () => dateKey()

export const keyToDate = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Last n day-keys ending today, oldest first */
export const lastNDays = (n) => {
  const out = []
  for (let i = n - 1; i >= 0; i -= 1) out.push(dateKey(addDays(new Date(), -i)))
  return out
}

/** Monday-first weekday name for a date */
export const dayName = (d = new Date()) => DAY_NAMES[(d.getDay() + 6) % 7]
export const todayDayName = () => dayName()

export const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

/** Monday date-key of the week containing d */
export const weekStartKey = (d = new Date()) => {
  const x = new Date(d)
  const shift = (x.getDay() + 6) % 7
  return dateKey(addDays(x, -shift))
}

export const formatDate = (key, opts) => {
  try {
    return keyToDate(key).toLocaleDateString('en-US', opts || { month: 'short', day: 'numeric' })
  } catch { return key }
}

/** Consecutive-day workout streak ending today (or yesterday if today is not logged yet) */
export const workoutStreak = (logs = []) => {
  const set = new Set(logs.map((l) => l.date))
  let cursor = new Date()
  if (!set.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1)
    if (!set.has(dateKey(cursor))) return 0
  }
  let streak = 0
  while (set.has(dateKey(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export const isSameDay = (a, b) => dateKey(a) === dateKey(b)
