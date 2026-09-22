import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  subscribeDoc, subscribeProgress, subscribeWorkoutLogs,
  saveWorkoutPlan, saveDietPlan, upsertProgressEntry, addWorkoutLog, removeWorkoutLog,
} from '@/services/firestore'
import { todayKey } from '@/utils/dates'

const DataContext = createContext(null)

/**
 * Central live-data layer for the signed-in user.
 * Subscribes (scoped to their UID): workout plan, diet plan, progress entries, workout logs.
 */
export function DataProvider({ children }) {
  const { user } = useAuth()
  const [plan, setPlan] = useState(null)        // workouts/{uid}
  const [dietPlan, setDietPlan] = useState(null) // dietPlans/{uid}
  const [entries, setEntries] = useState([])     // progress/{uid}/entries  (newest first)
  const [logs, setLogs] = useState([])           // workouts/{uid}/logs     (newest first)
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState(false) // Firestore access blocked

  useEffect(() => {
    if (!user) { setPlan(null); setDietPlan(null); setEntries([]); setLogs([]); setDataLoading(false); setDataError(false); return undefined }
    setDataLoading(true)
    setDataError(false)
    let pending = 4
    // Watchdog: healthy listeners settle in 1–3s. If none has reported after 12s,
    // the Firestore channel is being silently blocked (security rules) — surface it.
    let blocked = false
    const watchdog = setTimeout(() => { blocked = true; setDataError(true); setDataLoading(false) }, 12000)
    const settle = () => { if (!blocked) { pending -= 1; if (pending <= 0) { clearTimeout(watchdog); setDataLoading(false) } } }
    const done = settle
    const fail = () => { if (!blocked) { clearTimeout(watchdog); setDataError(true) } settle() }

    const unsubs = [
      subscribeDoc('workouts', user.uid, (d) => { setPlan(d); done() }, fail),
      subscribeDoc('dietPlans', user.uid, (d) => { setDietPlan(d); done() }, fail),
      subscribeProgress(user.uid, (list) => { setEntries(list); done() }, fail),
      subscribeWorkoutLogs(user.uid, (list) => { setLogs(list); done() }, fail),
    ]
    return () => { clearTimeout(watchdog); unsubs.forEach((u) => u && u()) }
  }, [user])

  const todayEntry = useMemo(
    () => entries.find((e) => e.date === todayKey()) || null,
    [entries],
  )

  const actions = useMemo(() => ({
    savePlan: (p) => saveWorkoutPlan(user.uid, p),
    saveDiet: (p) => saveDietPlan(user.uid, p),
    upsertEntry: (partial) => upsertProgressEntry(user.uid, todayKey(), partial),
    logWorkout: (log) => addWorkoutLog(user.uid, log),
    unlogWorkout: (date) => removeWorkoutLog(user.uid, date),
  }), [user])

  const value = useMemo(() => ({
    plan, dietPlan, entries, logs, todayEntry, dataLoading, dataError, ...actions,
  }), [plan, dietPlan, entries, logs, todayEntry, dataLoading, dataError, actions])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
