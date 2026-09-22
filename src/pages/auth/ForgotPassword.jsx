import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MailCheck, ArrowLeft } from 'lucide-react'
import AuthLayout from '@/layouts/AuthLayout'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLocation } from 'react-router-dom'
import { useToast } from '@/context/ToastContext'
import { doResetPassword } from '@/services/auth'
import { authErrorMessage } from '@/utils/authErrors'
import { isValidEmail } from '@/utils/validate'

export default function ForgotPassword() {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const toast = useToast()

  const submit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) { setError('Enter a valid email address.'); return }
    setError('')
    setLoading(true)
    try {
      await doResetPassword(email.trim())
      setSent(true)
      toast.success('Password reset email sent. Check your inbox (and spam).')
    } catch (err) {
      toast.error(authErrorMessage(err))
      if (err.code === 'auth/user-not-found') setError('No account found with this email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new password."
      footer={<Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-emerald-500 transition hover:text-emerald-400"><ArrowLeft size={14} /> Back to login</Link>}
    >
      {sent ? (
        <div className="flex flex-col items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[.06] px-6 py-9 text-center animate-scale-in">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 text-zinc-950"><MailCheck size={24} /></span>
          <h3 className="mt-4 font-display text-lg font-bold text-zinc-900 dark:text-white">Check your inbox</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            We sent a password reset link to <strong className="text-zinc-700 dark:text-zinc-200">{email}</strong>. The link expires shortly for your security.
          </p>
          <button onClick={() => setSent(false)} className="mt-5 text-[13px] font-semibold text-emerald-500 hover:text-emerald-400">Use a different email</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Input label="Email" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError('') }} error={error} autoComplete="email" />
          <Button type="submit" className="w-full" size="lg" loading={loading}>Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  )
}
