import {
  doc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, orderBy, limit, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Custom Plans — workout/diet routines the USER builds themselves
 * (e.g. "Evening 2-hour session: 40 push ups → 20 pull ups → chest").
 * The app then guides them step-by-step: complete a step, get told the next one.
 *
 * Firestore: customPlans/{uid}/plans/{planId} — security rules scope every
 * read/write to the owner's UID (see firestore.rules).
 *
 * Daily progress lives on the plan doc as doneByDay: { 'YYYY-MM-DD': [itemId,…] }
 * so every new day starts fresh automatically (no stale "done" state).
 */

export const newPlanId = () => `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
export const newItemId = () => `i_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

const cleanItems = (items = []) =>
  items
    .filter((it) => it && typeof it.name === 'string' && it.name.trim())
    .slice(0, 30)
    .map((it) => ({
      id: it.id || newItemId(),
      name: it.name.trim().slice(0, 60),
      target: typeof it.target === 'string' ? it.target.trim().slice(0, 40) : '',
      durationMin: Number.isFinite(Number(it.durationMin)) && Number(it.durationMin) > 0 ? Math.round(Number(it.durationMin)) : null,
    }))

/** Create or update a plan. Keeps only the last 7 days of doneByDay. */
export async function saveCustomPlan(uid, plan) {
  const id = plan.id || newPlanId()
  const ref = doc(db, 'customPlans', uid, 'plans', id)
  const doneByDay = { ...(plan.doneByDay || {}) }
  const cutoff = new Date(Date.now() - 7 * 864e5).toISOString().slice(0, 10)
  for (const k of Object.keys(doneByDay)) if (k < cutoff) delete doneByDay[k]
  const payload = {
    title: (plan.title || 'My Plan').trim().slice(0, 60),
    type: plan.type === 'diet' ? 'diet' : 'workout',
    time: typeof plan.time === 'string' && /^\d{2}:\d{2}$/.test(plan.time) ? plan.time : '',
    durationMin: Number(plan.durationMin) > 0 ? Math.round(Number(plan.durationMin)) : null,
    items: cleanItems(plan.items),
    doneByDay,
    updatedAt: serverTimestamp(),
  }
  if (!plan.createdAt) payload.createdAt = serverTimestamp()
  await setDoc(ref, payload, { merge: true })
  return id
}

export const deleteCustomPlan = (uid, planId) =>
  deleteDoc(doc(db, 'customPlans', uid, 'plans', planId))

/** Toggle one step of TODAY's run (complete ↔ pending). Guided flow state. */
export async function toggleStepToday(uid, plan, itemId) {
  const key = new Date().toISOString().slice(0, 10)
  const cur = plan.doneByDay?.[key] || []
  const next = cur.includes(itemId) ? cur.filter((x) => x !== itemId) : [...cur, itemId]
  await updateDoc(doc(db, 'customPlans', uid, 'plans', plan.id), {
    [`doneByDay.${key}`]: next,
    updatedAt: serverTimestamp(),
  })
  return next
}

export const subscribeCustomPlans = (uid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'customPlans', uid, 'plans'), orderBy('updatedAt', 'desc'), limit(50)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    errCb,
  )

/** Last 7 days — was the FULL plan completed that day? (for card dots) */
export const planHistory = (plan) => {
  const total = plan.items?.length || 0
  return Array.from({ length: 7 }, (_, i) => {
    const k = new Date(Date.now() - (6 - i) * 864e5).toISOString().slice(0, 10)
    const arr = plan.doneByDay?.[k] || []
    return { key: k, done: total > 0 && arr.length >= total }
  })
}

/** Consecutive full-completion days (today counts only once finished). */
export const planStreak = (plan) => {
  const total = plan.items?.length || 0
  let s = 0
  for (let i = 0; i < 90; i += 1) {
    const k = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)
    const arr = plan.doneByDay?.[k] || []
    if (total > 0 && arr.length >= total) s += 1
    else if (i === 0) continue // aaj abhi baaki hai — streak nahi tootta
    else break
  }
  return s
}

/** Which step is up next today? (first item not in today's done list) */
export const nextStep = (plan) => {
  const key = new Date().toISOString().slice(0, 10)
  const done = plan.doneByDay?.[key] || []
  return { next: plan.items?.find((it) => !done.includes(it.id)) || null, doneCount: done.length, total: plan.items?.length || 0, doneList: done }
}
