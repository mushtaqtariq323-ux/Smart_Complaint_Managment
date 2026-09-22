/**
 * AI Coach secure API server.
 *   React → /api/chat (this server) → Groq API
 * The Groq API key lives ONLY here (server-side env). The browser never sees it.
 *
 * Auth: Firebase ID tokens are verified against Google's public JWKs —
 * no service-account credentials required. Firestore history is written
 * THROUGH THE USER'S OWN TOKEN (REST), so Firestore security rules still
 * fully apply: users can only ever touch their own chatHistory.
 */
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { createRequire } from 'node:module'
// firebase-admin is CommonJS — its exports do NOT surface through ESM named
// imports (initializeApp would be undefined). Load it via createRequire.
const require = createRequire(import.meta.url)
const admin = require('firebase-admin')
import { buildMessages, sanitizeFitnessContext, sanitizeHistory } from './systemPrompt.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* ── tiny .env loader (no dependency) ─────────────────────────────── */
const envPath = path.join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'smart-complaint-system-3531b'
const PORT = Number(process.env.PORT || 8787)
const GROQ_KEY = (process.env.GROQ_API_KEY || '').trim()
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b'
const GROQ_FALLBACK_MODELS = (process.env.GROQ_FALLBACK_MODELS || 'openai/gpt-oss-20b,qwen/qwen3.8-27b')
  .split(',').map((m) => m.trim()).filter(Boolean)
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`

const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'))
const app = express()
app.use(express.json({ limit: '256kb' }))

/* ── Firebase Admin SDK — server-side only, initialized EXACTLY once ──
   Token VERIFICATION only needs the projectId (Admin SDK checks the RS256
   signature against Google's public certs for THIS project). No service-account
   private key is required or stored anywhere, and nothing is exposed to the
   frontend. Same project as the Firebase client config (smart-complaint-system-3531b). */
let adminReady = false
try {
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: PROJECT_ID })
  }
  adminReady = true
  console.log(`[auth] Firebase Admin initialized for project "${PROJECT_ID}" — verifyIdToken ACTIVE`)
} catch (e) {
  console.error('[auth] Firebase Admin init FAILED — will use direct JWKS verification:', e?.code || e?.name || 'unknown')
}

/* ── helpers ──────────────────────────────────────────────────────── */
const httpErr = (status, code, message) => Object.assign(new Error(message), { status, code })
const fail = (res, status, code, message) => res.status(status).json({ code, message })

async function verifyUser(req) {
  const header = req.headers.authorization || ''
  let token = header.startsWith('Bearer ') ? header.slice(7) : null
  // The public preview proxy strips the Authorization header from browser
  // requests. Fall back to the SAME real Firebase ID token sent in the body —
  // verified identically below. Never a uid, never a bypass.
  if (!token && typeof req.body?.idToken === 'string' && req.body.idToken.length > 20) {
    token = req.body.idToken
  }
  // SAFE debug line: never log the token itself, only presence/path
  console.log(`[auth] ${req.method} /api/chat → token: ${header ? 'authorization-header' : (token ? 'request-body (header stripped by proxy)' : 'MISSING')}`)
  if (!token) throw httpErr(401, 'UNAUTHORIZED', 'Your session could not be verified. Please sign in again.')
  // UID is ALWAYS derived from the verified Firebase ID token —
  // never from the request body.
  try {
    if (adminReady) {
      const decoded = await admin.auth().verifyIdToken(token) // Admin SDK path
      console.log(`[auth] ✔ Admin verifyIdToken OK → uid=${decoded.uid} aud=${decoded.aud} via=admin`)
      return { uid: decoded.uid, email: decoded.email || null, token }
    }
    throw new Error('admin-unavailable')
  } catch (err) {
    // SAFE error category — codes only, never token contents or secrets
    console.error(`[auth] admin path failed: ${err?.code || err?.name || 'unknown'}`)
    if (err?.code === 'auth/id-token-expired' || /expired/i.test(err?.message || '')) {
      throw httpErr(401, 'UNAUTHORIZED', 'Your session has expired — please log in again.')
    }
    // Fallback: identical RS256 verification straight against Google's JWKS
    // (covers transient failures fetching Admin SDK public certs).
    try {
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: `https://securetoken.google.com/${PROJECT_ID}`,
        audience: PROJECT_ID,
      })
      console.log(`[auth] ✔ JWKS verify OK → uid=${payload.sub} aud=${payload.aud} via=jwks-fallback`)
      return { uid: payload.sub, email: payload.email || null, token }
    } catch (err2) {
      console.error(`[auth] JWKS fallback failed: ${err2?.code || err2?.name || 'unknown'} (project=${PROJECT_ID})`)
      throw httpErr(401, 'UNAUTHORIZED', 'Your session has expired — please log in again.')
    }
  }
}

/* simple per-user rate limit: 25 requests / minute */
const buckets = new Map()
function rateLimit(uid) {
  const now = Date.now()
  const b = buckets.get(uid)
  if (!b || now > b.resetAt) {
    buckets.set(uid, { count: 1, resetAt: now + 60_000 })
    return
  }
  b.count += 1
  if (b.count > 25) throw httpErr(429, 'RATE_LIMITED', 'You are sending messages too quickly — please wait a moment and try again.')
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function groqOnce(model, messages) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 60_000)
  let res
  try {
    const body = { model, messages, temperature: 0.7, top_p: 0.95, max_tokens: 2000 }
    // gpt-oss models are reasoning models — keep the thinking budget small for chat
    if (model.includes('gpt-oss')) body.reasoning_effort = 'low'
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
  } catch {
    throw httpErr(504, 'AI_TIMEOUT', 'The AI coach took too long to respond. Please try again.')
  } finally {
    clearTimeout(timer)
  }
  if (res.status === 401 || res.status === 403) throw httpErr(502, 'AI_CONFIG_ERROR', 'The AI service rejected its credentials — the server GROQ_API_KEY looks invalid.')
  if (res.status === 429) throw httpErr(429, 'AI_RATE_LIMITED', 'The AI coach is very busy right now. Please try again in a few seconds.')
  if (res.status === 404 || res.status === 400) throw httpErr(502, 'AI_MODEL_UNAVAILABLE', `Model ${model} is unavailable.`)
  if (!res.ok) throw httpErr(502, 'AI_UPSTREAM_ERROR', 'The AI service had a hiccup. Please try again.')
  const data = await res.json().catch(() => null)
  const reply = data?.choices?.[0]?.message?.content?.trim()
  if (!reply) throw httpErr(502, 'AI_EMPTY_RESPONSE', 'The AI coach returned an empty response. Please rephrase and try again.')
  return reply
}

async function callGroq(messages) {
  let lastErr
  const models = [GROQ_MODEL, ...(process.env.GROQ_FALLBACK_MODELS || 'openai/gpt-oss-20b,qwen/qwen3.8-27b').split(',').map((m) => m.trim()).filter(Boolean)]
  for (const model of models) {
    // up to 2 attempts per model; on persistent limits move on — Groq quotas
    // are PER MODEL, so fallback models have separate rate-limit buckets
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        return await groqOnce(model, messages)
      } catch (err) {
        lastErr = err
        if (err.code === 'AI_MODEL_UNAVAILABLE') break // deprecated model → next one
        const transient = err.code === 'AI_RATE_LIMITED' || err.code === 'AI_UPSTREAM_ERROR' || err.code === 'AI_TIMEOUT'
        if (transient && attempt === 0) { await sleep(2200); continue }
        if (transient) break // exhausted this model's quota → try next model
        throw err
      }
    }
  }
  throw lastErr
}

/* Firestore REST writes — executed WITH the user's own ID token so their
   security rules stay in charge of everything they can or cannot write. */
const fsFields = (obj) => {
  const f = {}
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') f[k] = { stringValue: v }
    else if (typeof v === 'number') f[k] = { doubleValue: v }
    else if (v instanceof Date) f[k] = { timestampValue: v.toISOString() }
  }
  return f
}

async function fsSaveMessage(user, uid, cid, msg) {
  const url = `${FS_BASE}/chatHistory/${uid}/conversations/${cid}/messages`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: fsFields({ ...msg, createdAt: new Date() }) }),
  })
  if (!res.ok) throw new Error(`firestore ${res.status}`)
}

async function fsTouchConversation(user, uid, cid, title) {
  // updateMask is REQUIRED on REST PATCH — without it the whole doc is replaced
  const mask = title ? '?updateMask.fieldPaths=title&updateMask.fieldPaths=updatedAt' : '?updateMask.fieldPaths=updatedAt'
  const url = `${FS_BASE}/chatHistory/${uid}/conversations/${cid}${mask}`
  const fields = { updatedAt: new Date() }
  if (title) fields.title = title.slice(0, 80)
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: fsFields(fields) }),
  })
  if (!res.ok) throw new Error(`firestore ${res.status}`)
}

/* Best-effort: fetch the user's own profile if the client sent no context */
async function fsFetchProfileContext(user, uid) {
  try {
    const out = {}
    for (const col of ['users', 'fitnessProfiles']) {
      const r = await fetch(`${FS_BASE}/${col}/${uid}`, { headers: { Authorization: `Bearer ${user.token}` } })
      if (!r.ok) continue
      const d = await r.json()
      const fields = d.fields || {}
      const flat = {}
      for (const [k, v] of Object.entries(fields)) {
        if (v.stringValue != null) flat[k] = v.stringValue
        else if (v.doubleValue != null) flat[k] = v.doubleValue
        else if (v.integerValue != null) flat[k] = Number(v.integerValue)
        else if (v.booleanValue != null) flat[k] = v.booleanValue
      }
      Object.assign(out, flat)
    }
    delete out.settings
    return sanitizeFitnessContext(out)
  } catch {
    return null
  }
}

/* ── routes ───────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: GROQ_MODEL, groqConfigured: !!GROQ_KEY })
})

app.post('/api/chat', async (req, res, next) => {
  try {
    const user = await verifyUser(req)
    rateLimit(user.uid)

    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : ''
    if (!message) return fail(res, 400, 'INVALID_MESSAGE', 'Please type a message first.')
    if (message.length > 4000) return fail(res, 400, 'INVALID_MESSAGE', 'That message is too long — please split it into a shorter one.')

    const conversationId = typeof req.body?.conversationId === 'string' && /^[a-zA-Z0-9_-]{6,64}$/.test(req.body.conversationId)
      ? req.body.conversationId
      : null
    if (!conversationId) return fail(res, 400, 'INVALID_CONVERSATION', 'Missing conversation id.')

    let fitnessContext = sanitizeFitnessContext(req.body?.fitnessContext)
    if (!fitnessContext) fitnessContext = await fsFetchProfileContext(user, user.uid)

    const history = sanitizeHistory(req.body?.conversationHistory)
    const messages = buildMessages(fitnessContext, history, message)
    if (history.length === 0) {
      // Brand-new chat → ask the model to name this conversation with a marker
      // line; we strip it from the reply and store it as the chat title.
      messages.push({
        role: 'system',
        content:
          'This is the FIRST message of a new chat. Per your CHAT TITLE rule, begin your reply ' +
          'with the <<TITLE:...>> line (2-5 words, user\'s language), then a blank line, then the answer.',
      })
    }

    if (!GROQ_KEY) {
      return fail(res, 503, 'AI_NOT_CONFIGURED',
        'The AI coach is not connected yet — add your Groq API key as GROQ_API_KEY in the project .env file and restart the server. Everything else already works.')
    }

    let reply = await callGroq(messages)

    // Pull the auto-generated chat title out of the first reply, if present
    let chatTitle = null
    const tm = reply.match(/^\s*<<TITLE:(.+?)>>\s*\n?/i)
    if (tm) {
      chatTitle = tm[1].trim().slice(0, 60)
      reply = reply.slice(tm[0].length).trimStart()
    }

    // Persist user + assistant messages through the user's own token.
    let saved = true
    try {
      const language = typeof req.body?.language === 'string' ? req.body.language.slice(0, 24) : 'auto'
      await fsTouchConversation(user, user.uid, conversationId, chatTitle || (history.length === 0 ? message : null))
      await fsSaveMessage(user, user.uid, conversationId, { role: 'user', content: message.slice(0, 4000), language })
      await fsSaveMessage(user, user.uid, conversationId, { role: 'assistant', content: reply, language })
    } catch {
      saved = false // client keeps local echoes and retries client-side
    }

    res.json({ reply, conversationId, saved, model: GROQ_MODEL })
  } catch (err) {
    if (err.status) return fail(res, err.status, err.code, err.message)
    next(err)
  }
})

/* JSON 404 + error handler (never leak stack traces) */
app.use('/api', (_req, res) => fail(res, 404, 'NOT_FOUND', 'Unknown API route.'))
app.use((err, _req, res, _next) => {
  console.error('[api]', err.message)
  fail(res, 500, 'SERVER_ERROR', 'Something went wrong on the server. Please try again.')
})

/* Production: serve the built frontend if present */
const distDir = path.join(__dirname, '..', 'dist')
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) return res.sendFile(path.join(distDir, 'index.html'))
    next()
  })
}

/* Local / dedicated hosting: start the HTTP listener.
   Netlify Functions: the app is exported below and wrapped with
   serverless-http instead — no listener inside Lambda. */
if (!process.env.AWS_LAMBDA_JS_RUNTIME && !process.env.NETLIFY) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Coach API listening on http://0.0.0.0:${PORT} · model: ${GROQ_MODEL} · groq key: ${GROQ_KEY ? 'configured ✔' : 'MISSING (chat will return AI_NOT_CONFIGURED)'}`)
  })
}

export default app
