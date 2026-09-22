/**
 * Netlify Function — wraps the SAME Express API (server/index.js) so the
 * frontend code never changes: it still calls /api/chat and /api/health.
 *
 * Netlify rewrite (netlify.toml):  /api/* → /.netlify/functions/api/:splat
 * The function event keeps the ORIGINAL path (/api/chat), so all Express
 * routes match as-is.
 *
 * Required environment variable (Netlify UI → Site settings → Environment):
 *   GROQ_API_KEY   — server-side only, never exposed to the browser.
 */
import serverless from 'serverless-http'
import app from '../../server/index.js'

export const handler = serverless(app)
