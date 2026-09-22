import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [profile, setProfile] = useState(null)       // users/{uid}
  const [fitness, setFitness] = useState(null)       // fitnessProfiles/{uid}
  const [profileLoading, setProfileLoading] = useState(true)
  const [dbError, setDbError] = useState(false)       // Firestore reads/writes being blocked
  const [signupLock, setSignupLock] = useState(false) // prevents /signup redirect race during account creation

  // Some preview iframes (opaque origin) BLOCK localStorage/IndexedDB — Firebase
  // then degrades to in-memory sessions and a page reload loses the login.
  // Silent restore isn't possible there (no storage, no custom-token signing),
  // so we remember WHO was logged in via the URL hash (#u=…&n=…) and the login
  // page comes up prefilled after a reload. Normal browsers are unaffected.
  const storageBlocked = useMemo(() => {
    try { localStorage.setItem('__afc_probe', '1'); localStorage.removeItem('__afc_probe'); return false } catch { return true }
  }, [])

  useEffect(() => {
    if (!user || !storageBlocked) return
    const p = new URLSearchParams()
    if (user.email) p.set('u', user.email)
    if (user.displayName) p.set('n', user.displayName)
    try { window.history.replaceState(null, '', `#${p.toString()}`) } catch { /* ignore */ }
  }, [user, storageBlocked])

  const clearLoginHash = () => {
    try { window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch { /* ignore */ }
  }

  // Persistent authentication state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
      if (!u) {
        setProfile(null)
        setFitness(null)
        setProfileLoading(false)
        setDbError(false)
      }
    })
  }, [])

  // Live-subscribe the user's Firestore documents (scoped to their UID)
  const watchdogRef = useRef(null)
  useEffect(() => {
    if (!user) return undefined
    setProfileLoading(true)
    let pending = 2
    let settled = false
    const done = () => {
      if (settled) return
      pending -= 1
      if (pending <= 0) { settled = true; clearTimeout(watchdogRef.current); setProfileLoading(false) }
    }

    // Authoritative storage-access probe + self-heal. If this direct read/write is
    // denied, the project's security rules are blocking this user's own documents.
    ;(async () => {
      try {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)
        if (!snap.exists()) {
          await setDoc(ref, {
            name: user.displayName || 'Athlete',
            email: user.email || '',
            onboardingCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      } catch {
        setDbError(true)
      }
    })()

    const u1 = onSnapshot(doc(db, 'users', user.uid),
      (s) => { setProfile(s.exists() ? { id: s.id, ...s.data() } : null); done() },
      () => { setDbError(true); done() })
    // Watchdog: if neither profile listener has settled after 12s, the Firestore
    // channel is being silently blocked (security rules) — surface it clearly.
    const watchdog = setTimeout(() => setDbError(true), 12000)
    const u2 = onSnapshot(doc(db, 'fitnessProfiles', user.uid),
      (s) => { setFitness(s.exists() ? { id: s.id, ...s.data() } : null); done() },
      () => { setDbError(true); done() })
    watchdogRef.current = watchdog
    return () => { clearTimeout(watchdog); u1(); u2() }
  }, [user])

  const value = useMemo(() => ({
    user,
    authLoading,
    profile,
    fitness,
    profileLoading,
    dbError,
    loading: authLoading || (!!user && profileLoading),
    signupLock,
    lockSignup: () => setSignupLock(true),
    unlockSignup: () => setSignupLock(false),
    logout: () => {
      // clear remembered-login hash + open-conversation pointer
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch { /* ignore */ }
      try { localStorage.removeItem('afc-active-conversation') } catch { /* ignore */ }
      return signOut(auth)
    },
  }), [user, authLoading, profile, fitness, profileLoading, dbError, signupLock])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
