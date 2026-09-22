import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, KeyRound, UserRound } from 'lucide-react'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import { Input, PasswordInput } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { doLogin, doSetPersistence } from '@/services/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/firebase'
import { authErrorMessage } from '@/utils/authErrors'
import { isValidEmail } from '@/utils/validate'

function rememberedLogin() {
  // When browser storage is unavailable (some preview iframes), AuthContext
  // remembers the last account in the URL hash: #u=<email>&n=<name>
  try {
    const p = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    if (p.get('u')) return { email: p.get('u'), name: p.get('n') || '' }
  } catch { /* ignore */ }
  return null
}

export default function Login() {
  const location = useLocation()
  const remembered = rememberedLogin()
  const [form, setForm] = useState({
    email: remembered?.email || location.state?.email || '',
    password: '',
    remember: true,
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })) }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!isValidEmail(form.email)) er.email = 'Enter a valid email address.'
    if (!form.password) er.password = 'Please enter your password.'
    setErrors(er)
    if (Object.keys(er).length) return
    setLoading(true)
    try {
      await doSetPersistence(form.remember)
      const cred = await doLogin(form.email.trim(), form.password)
      // Route by onboarding status
      let target = '/dashboard'
      try {
        const snap = await getDoc(doc(db, 'users', cred.user.uid))
        if (snap.exists() && snap.data().onboardingCompleted === false) target = '/onboarding'
      } catch { /* fall through to dashboard guard */ }
      toast.success(`Welcome back${cred.user.displayName ? `, ${cred.user.displayName.split(' ')[0]}` : ''}! 👋`, 'Logged in')
      try { window.history.replaceState(null, '', window.location.pathname + window.location.search) } catch { /* ignore */ }
      navigate(location.state?.from && location.state.from !== '/login' ? location.state.from : target, { replace: true })
    } catch (error) {
      toast.error(authErrorMessage(error))
      if (['auth/user-not-found', 'auth/invalid-email'].includes(error.code)) setErrors({ email: 'No account found with this email.' })
      if (['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(error.code)) setErrors({ password: 'Incorrect email or password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue your fitness journey."
      footer={<>Don't have an account? <Link to="/signup" className="font-semibold text-emerald-500 transition hover:text-emerald-400">Sign Up</Link></>}
    >
      {remembered?.email && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[.07] px-3.5 py-2.5 text-[13px] text-zinc-600 dark:text-zinc-300">
          <UserRound size={14} className="shrink-0 text-emerald-500" />
          <span className="truncate">Continuing as <strong className="font-semibold">{remembered.name || remembered.email}</strong> — enter your password to continue.</span>
        </div>
      )}
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <div>
          <PasswordInput label="Password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Your password" />
          <div className="mt-2.5 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-[13px] font-medium text-zinc-500 dark:text-zinc-400">
              <button
                type="button"
                role="switch"
                aria-checked={form.remember}
                onClick={() => setForm((f) => ({ ...f, remember: !f.remember }))}
                className={`relative h-5 w-9 rounded-full transition-colors duration-300 ${form.remember ? 'bg-gradient-to-r from-lime-400 to-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${form.remember ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
              Remember me
            </label>
            <Link to="/forgot-password" state={{ email: form.email }} className="inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-500 transition hover:text-emerald-400">
              <KeyRound size={12} /> Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>Login</Button>
      </form>
    </AuthLayout>
  )
}
