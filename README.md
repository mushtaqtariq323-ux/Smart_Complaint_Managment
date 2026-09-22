# AI Fitness Coach

Modern, premium fitness web app — personalized workouts, diet guidance, body
analysis, progress tracking and a 24/7 AI Fitness Coach chat that answers in
English, Urdu, Hindi or Sindhi (Roman included). **User panel only.**

## Tech

- **Frontend:** React 18 + Vite + Tailwind CSS + react-router
- **Auth & data:** Firebase Authentication + Firestore (per-user security rules — see `firestore.rules`)
- **AI coach:** Groq API (`openai/gpt-oss-120b` + fallback models), called from the backend only
- **Deploy:** Netlify (static frontend + `/api/*` serverless function — same repo)

## Run locally

```bash
npm install
npm run dev:all      # API on :8787 + Vite on :5173
```

`npm run dev` → frontend only · `npm run server` → API only · `npm run build` → production build.

## Environment

Copy `.env.example` → `.env` and fill:

| Var | Where it's used | Notes |
|---|---|---|
| `VITE_FIREBASE_*` | Browser (Firebase web SDK) | Web API keys are public identifiers — safe to expose |
| `GROQ_API_KEY` | **Server only** | NEVER prefix with `VITE_` — the browser must never see it |
| `GROQ_MODEL` / `GROQ_FALLBACK_MODELS` | Server | optional |

## Deploy to Netlify

1. Push this repo to GitHub (`.env` is git-ignored — your secrets stay local).
2. Netlify → *Add new site* → *Import from GitHub*.
3. Build settings are auto-read from `netlify.toml`
   (`npm run build`, publish `dist`, functions in `netlify/functions`).
4. **Site settings → Environment variables → add `GROQ_API_KEY`** (and optionally
   `GROQ_MODEL`). Without it the app works but the coach replies with a
   friendly "not connected" message.
5. Deploy. The AI chat is served by the same site through
   `/api/* → netlify/functions/api` — no CORS, no extra service.

## Firebase setup (once)

- Enable **Authentication → Email/Password**.
- Create a **Firestore** database and deploy the security rules:
  `firebase deploy --only firestore:rules` (or paste `firestore.rules` in the console).
  Every read/write is scoped to `request.auth.uid`.

## Health check

`GET /api/health` → `{ ok: true, groqConfigured: true }`

> All BMI/calorie outputs are estimates and general wellness guidance — not medical advice.
