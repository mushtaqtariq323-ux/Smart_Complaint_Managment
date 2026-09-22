import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User, Check } from 'lucide-react'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import { Input, PasswordInput } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { doSignup, doUpdateDisplayName, doLogout } from '@/services/auth'
import { ensureUserDoc } from '@/services/firestore'
import { authErrorMessage } from '@/utils/authErrors'
import { isValidEmail, isStrongPassword, nameValid, passwordChecks } from '@/utils/validate'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { lockSignup, unlockSignup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })) }

  const validate = () => {
    const er = {}
    if (!nameValid(form.name)) er.name = 'Please enter your full name (at least 2 characters).'
    if (!isValidEmail(form.email)) er.email = 'Enter a valid email address.'
    if (!isStrongPassword(form.password)) er.password = 'At least 8 characters with a letter and a number.'
    if (form.confirm !== form.password) er.confirm = 'Passwords do not match.'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const checks = passwordChecks(form.password)

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    lockSignup() // keep PublicOnly from bouncing while the account is being created
    try {
      const cred = await doSignup(form.email.trim(), form.password)
      // Secondary steps must never block the account from being usable.
      try { await doUpdateDisplayName(cred.user, form.name.trim()) } catch { /* non-fatal */ }
      let profileSaved = true
      try { await ensureUserDoc(cred.user, { name: form.name.trim() }) } catch { profileSaved = false }
      await doLogout()
      unlockSignup()
      if (profileSaved) {
        toast.success('Account created! Please log in to continue.', 'Welcome aboard 🎉')
      } else {
        toast.warning(
          'Account created, but the profile document could not be written — deploy firestore.rules from the project root, then log in.',
          'Almost there',
        )
      }
      navigate('/login', { state: { email: form.email.trim() } })
    } catch (error) {
      unlockSignup()
      toast.error(authErrorMessage(error))
      if (error.code === 'auth/email-already-in-use') setErrors({ email: 'This email is already registered.' })
      if (error.code === 'auth/weak-password') setErrors({ password: 'Please choose a stronger password.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your journey — your Fitness Coach is waiting."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-emerald-500 transition hover:text-emerald-400">Login</Link></>}
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input label="Full Name" icon={User} placeholder="e.g. Ahmed Raza" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
        <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
        <div>
          <PasswordInput label="Password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Create a strong password" autoComplete="new-password" />
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {[['8+ characters', checks.length], ['A letter', checks.letter], ['A number', checks.number]].map(([label, ok]) => (
              <span key={label} className={`inline-flex items-center gap-1 text-[11.5px] font-medium ${ok ? 'text-emerald-500' : 'text-zinc-400 dark:text-zinc-500'}`}>
                <Check size={11} strokeWidth={3.5} /> {label}
              </span>
            ))}
          </div>
        </div>
        <PasswordInput label="Confirm Password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} placeholder="Repeat your password" autoComplete="new-password" />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Create Account</Button>
        <p className="text-center text-[11.5px] leading-relaxed text-zinc-400 dark:text-zinc-500">
          By creating an account you agree that all guidance is for general wellness purposes and not medical advice.
        </p>
      </form>
    </AuthLayout>
  )
}
