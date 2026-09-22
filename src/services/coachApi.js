import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

const BASE = '/api'

/**
 * Resolves ONLY once Firebase Auth state is settled and a user exists.
 * This closes the restore race where auth.currentUser is briefly null
 * while Firebase is hydrating the session from IndexedDB.
 * Returns null if there is genuinely no signed-in user.
 */
const waitForUser = (timeoutMs = 8000) =>
  new Promise((resolve) => {
    if (auth.currentUser) return resolve(auth.currentUser)
    const timer = setTimeout(() => { unsub(); resolve(null) }, timeoutMs)
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) { clearTimeout(timer); unsub(); resolve(u) }
    })
  })

/**
 * Talks to the secure backend (/api/chat), which verifies the Firebase ID token
 * (Firebase Admin SDK), builds the system prompt + fitness context, calls Groq
 * and persists history. The Groq API key never reaches the browser.
 */
export async function sendCoachChat({ message, conversationHistory = [], fitnessContext = null, conversationId, language = 'auto' }) {
  const user = await waitForUser()
  if (!user) {
    // Genuinely signed out → never send an unauthenticated request.
    window.location.assign('/login')
    throw Object.assign(new Error('Please log in to chat with your coach.'), { code: 'UNAUTHORIZED' })
  }

  const call = (token) =>
    fetch(`${BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      // The same real Firebase ID token is ALSO placed in the body because the
      // public preview proxy strips the Authorization header from some browser
      // requests. Server verifies it exactly the same way (Admin SDK).
      body: JSON.stringify({ message, conversationHistory, fitnessContext, conversationId, language, idToken: token }),
    })

  let res
  try {
    res = await call(await user.getIdToken())
    // One silent retry with a FORCED-fresh token if the backend says expired
    // (handles the >1h session case; never force-refreshes otherwise).
    if (res.status === 401) {
      res = await call(await user.getIdToken(true))
    }
  } catch {
    throw Object.assign(new Error('Network problem — please check your connection and try again.'), { code: 'NETWORK' })
  }

  let data = null
  try { data = await res.json() } catch { /* non-JSON error page */ }

  if (!res.ok || !data?.reply) {
    const code = data?.code || (res.status === 401 ? 'UNAUTHORIZED' : 'SERVER_ERROR')
    const message = data?.message || DEFAULTS[code] || 'Fitness Coach could not respond right now. Please try again.'
    throw Object.assign(new Error(message), { code, status: res.status })
  }
  return data // { reply, conversationId, saved }
}

const DEFAULTS = {
  UNAUTHORIZED: 'Your session has expired — please log in again.',
  RATE_LIMITED: 'You are sending messages too quickly — take a breath and try again in a moment.',
  AI_NOT_CONFIGURED: 'Fitness Coach is not connected yet — the server needs a GROQ_API_KEY in the .env file.',
  INVALID_MESSAGE: 'That message could not be sent — please rephrase it.',
}
