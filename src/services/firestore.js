import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot,
  collection, addDoc, query, orderBy, limit, getDocs, writeBatch, serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const ts = () => ({ updatedAt: serverTimestamp() })

/* ------------------------------ users ------------------------------ */

export const ensureUserDoc = async (user, { name } = {}) => {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      name: name || user.displayName || 'Athlete',
      email: user.email || '',
      onboardingCompleted: false,
      settings: {
        notifications: { workoutReminders: true, mealReminders: true, weeklyReport: true, progressAlerts: false },
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  } else if (name && snap.data().name !== name) {
    await updateDoc(ref, { name, ...ts() })
  }
  return ref
}

export const updateUserDoc = (uid, data) =>
  setDoc(doc(db, 'users', uid), { ...data, ...ts() }, { merge: true })

/* -------------------------- fitnessProfiles ------------------------ */

export const saveFitnessProfile = (uid, data) =>
  setDoc(doc(db, 'fitnessProfiles', uid), { ...data, ...ts() }, { merge: true })

/* ------------------------------ workouts --------------------------- */

export const saveWorkoutPlan = (uid, plan) =>
  setDoc(doc(db, 'workouts', uid), { ...plan, ...ts() })

export const addWorkoutLog = (uid, log) =>
  setDoc(doc(db, 'workouts', uid, 'logs', log.date), { ...log, createdAt: serverTimestamp() }, { merge: true })

export const removeWorkoutLog = (uid, date) =>
  deleteDoc(doc(db, 'workouts', uid, 'logs', date))

export const subscribeWorkoutLogs = (uid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'workouts', uid, 'logs'), orderBy('date', 'desc'), limit(200)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    errCb,
  )

/* ----------------------------- dietPlans --------------------------- */

export const saveDietPlan = (uid, plan) =>
  setDoc(doc(db, 'dietPlans', uid), { ...plan, ...ts() })

/* ------------------------------ progress --------------------------- */

export const upsertProgressEntry = (uid, dateKey, data) =>
  setDoc(doc(db, 'progress', uid, 'entries', dateKey), { ...data, date: dateKey, ...ts() }, { merge: true })

export const subscribeProgress = (uid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'progress', uid, 'entries'), orderBy('date', 'desc'), limit(180)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    errCb,
  )

/* ---------------------------- chatHistory -------------------------- */

export const saveChatMessage = (uid, msg) =>
  addDoc(collection(db, 'chatHistory', uid, 'messages'), { ...msg, createdAt: serverTimestamp() })

export const subscribeChat = (uid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'chatHistory', uid, 'messages'), orderBy('createdAt', 'asc'), limit(120)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    errCb,
  )

/* --------------------------- generic doc sub ----------------------- */

export const subscribeDoc = (col, uid, cb, errCb) =>
  onSnapshot(doc(db, col, uid),
    (s) => cb(s.exists() ? { id: s.id, ...s.data() } : null),
    errCb,
  )

/* ------------------- coach conversations (multi-chat) -------------- */

export const newConversationId = () =>
  `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const ensureConversation = (uid, cid, title) =>
  setDoc(doc(db, 'chatHistory', uid, 'conversations', cid), {
    title: (title || 'New chat').slice(0, 80),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })

export const subscribeConversations = (uid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'chatHistory', uid, 'conversations'), orderBy('updatedAt', 'desc'), limit(30)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
    errCb,
  )

export const subscribeConversationMessages = (uid, cid, cb, errCb) =>
  onSnapshot(
    query(collection(db, 'chatHistory', uid, 'conversations', cid, 'messages'), orderBy('createdAt', 'asc'), limit(200)),
    (s) => cb(s.docs
      .map((d) => {
        const data = d.data()
        // server saves `content`, legacy client saves used `text` — normalize BOTH
        const text = data.content ?? data.text ?? ''
        return { id: d.id, role: data.role, text, content: text, language: data.language, createdAt: data.createdAt }
      })
      .filter((m) => typeof m.text === 'string' && m.text.trim() && (m.role === 'user' || m.role === 'assistant'))),
    errCb,
  )

export const saveConversationMessage = (uid, cid, msg) =>
  addDoc(collection(db, 'chatHistory', uid, 'conversations', cid, 'messages'), {
    role: msg.role,
    content: msg.content ?? msg.text ?? '', // canonical field (matches server writes)
    language: msg.language || 'auto',
    createdAt: serverTimestamp(),
  })

/** Deletes a conversation and all of its messages (best-effort, rules permitting). */
export const deleteConversation = async (uid, cid) => {
  const msgs = await getDocs(query(collection(db, 'chatHistory', uid, 'conversations', cid, 'messages'), limit(300)))
  const batch = writeBatch(db)
  msgs.docs.forEach((d) => batch.delete(d.ref))
  batch.delete(doc(db, 'chatHistory', uid, 'conversations', cid))
  await batch.commit()
}
