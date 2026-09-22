import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings as SettingsIcon, Bell, KeyRound, Sun, Moon, LogOut, ShieldCheck, Check, Lock,
} from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'
import { Input, PasswordInput } from '@/components/ui/Input'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { updateUserDoc } from '@/services/firestore'
import { doChangePassword, doResetPassword, doLogout } from '@/services/auth'
import { authErrorMessage } from '@/utils/authErrors'
import { isStrongPassword } from '@/utils/validate'

const NOTIFICATION_KEYS = [
  { key: 'workoutReminders', label: 'Workout reminders', desc: 'Nudges to keep today\u2019s session on track' },
  { key: 'mealReminders', label: 'Meal reminders', desc: 'Gentle prompts around meal times' },
  { key: 'weeklyReport', label: 'Weekly report', desc: 'Summary of weight, workouts & nutrition' },
  { key: 'progressAlerts', label: 'Progress milestones', desc: 'Streaks and goal achievements' },
]

function ChangePasswordCard() {
  const { user } = useAuth()
  const toast = useToast()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => { setForm((f) => ({ ...f, [k]: e.target.value })); setErrors((er) => ({ ...er, [k]: undefined })) }

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!form.current) er.current = 'Enter your current password.'
    if (!isStrongPassword(form.next)) er.next = 'At least 8 characters with a letter and a number.'
    if (form.confirm !== form.next) er.confirm = 'Passwords do not match.'
    setErrors(er)
    if (Object.keys(er).length) return
    setSaving(true)
    try {
      await doChangePassword(user, form.current, form.next)
      toast.success('Your password has been updated.', 'Password changed')
      setForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(authErrorMessage(err))
      if (['auth/wrong-password', 'auth/invalid-credential', 'auth/invalid-login-credentials'].includes(err.code)) setErrors({ current: 'Current password is incorrect.' })
    } finally { setSaving(false) }
  }

  const sendReset = async () => {
    try {
      await doResetPassword(user.email)
      toast.success(`Reset link sent to ${user.email}.`, 'Check your inbox')
    } catch (err) { toast.error(authErrorMessage(err)) }
  }

  return (
    <Card className="animate-fade-up p-6" style={{ animationDelay: '120ms' }}>
      <CardHeader icon={KeyRound} title="Password & Security" subtitle="Change your password (Firebase Authentication)" />
      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        <PasswordInput label="Current password" value={form.current} onChange={set('current')} error={errors.current} autoComplete="current-password" />
        <div className="grid gap-4 sm:grid-cols-2 [&>*]:min-w-0">
          <PasswordInput label="New password" value={form.next} onChange={set('next')} error={errors.next} autoComplete="new-password" />
          <PasswordInput label="Confirm new password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" loading={saving} icon={<Lock size={15} />}>Update password</Button>
          <button type="button" onClick={sendReset} className="text-[13px] font-semibold text-emerald-500 transition hover:text-emerald-400">
            Or email me a reset link instead
          </button>
        </div>
      </form>
    </Card>
  )
}

export default function Settings() {
  const { user, profile, fitness, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const toast = useToast()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  const notifications = profile?.settings?.notifications || {}
  const setNotification = async (key, value) => {
    try {
      await updateUserDoc(user.uid, { settings: { ...(profile?.settings || {}), notifications: { ...notifications, [key]: value } } })
      toast.success('Preference saved.')
    } catch { toast.error('Could not save the preference.') }
  }

  const doLogoutClick = async () => {
    setLoggingOut(true)
    try {
      await logout()
      toast.success('Logged out. Stay strong! 💪')
      navigate('/')
    } catch { toast.error('Could not log out. Try again.') } finally { setLoggingOut(false) }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Make the app yours — appearance, notifications and security." />

      <div className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0 [&>*]:max-w-full">
        <Card className="animate-fade-up p-6">
          <CardHeader icon={SettingsIcon} title="Profile Settings" subtitle="Your identity & fitness data" />
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-zinc-50 px-4 py-3 dark:border-white/[.06] dark:bg-white/[.03]">
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{profile?.name || 'Athlete'}</p>
                <p className="text-xs text-zinc-400">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>Edit profile</Button>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-zinc-50 px-4 py-3 dark:border-white/[.06] dark:bg-white/[.03]">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{fitness?.goal || 'No goal set'} · {fitness?.workoutPreference || '—'} · {fitness?.experienceLevel || '—'}</p>
                <p className="text-xs text-zinc-400">Fitness preferences — goal, activity, experience & food</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>Edit</Button>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/[.06] px-4 py-3 text-[12.5px] leading-relaxed text-emerald-700 dark:text-emerald-300">
              <ShieldCheck size={15} className="mt-0.5 shrink-0" />
              Firestore rules restrict every read/write to request.auth.uid === your UID.
            </div>
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: '60ms' }}>
          <CardHeader icon={isDark ? Moon : Sun} title="Appearance" subtitle="Dark or light — your call" />
          <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-200/70 bg-zinc-50 px-4 py-3.5 dark:border-white/[.06] dark:bg-white/[.03]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-lime-400/20 to-emerald-500/15 text-emerald-500">
                {isDark ? <Moon size={17} /> : <Sun size={17} />}
              </span>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{isDark ? 'Dark mode' : 'Light mode'}</p>
                <p className="text-xs text-zinc-400">{isDark ? 'Easy on the eyes at night' : 'Bright & crisp'}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${isDark ? 'bg-gradient-to-r from-lime-400 to-emerald-500' : 'bg-zinc-300'}`}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${isDark ? 'left-[26px]' : 'left-1'}`} />
            </button>
          </div>
        </Card>

        <Card className="animate-fade-up p-6" style={{ animationDelay: '100ms' }}>
          <CardHeader icon={Bell} title="Notification Settings" subtitle="Saved to your account" />
          <div className="mt-2 divide-y divide-zinc-100 dark:divide-white/[.05]">
            {NOTIFICATION_KEYS.map(({ key, label, desc }) => (
              <Toggle key={key} checked={!!notifications[key]} onChange={(v) => setNotification(key, v)} label={label} description={desc} />
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <ChangePasswordCard />
          <Card className="animate-fade-up border-rose-300/50 p-6 dark:border-rose-500/20" style={{ animationDelay: '160ms' }}>
            <CardHeader icon={LogOut} title="Session" subtitle="Log out of this device" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400">Signed in as <strong className="text-zinc-700 dark:text-zinc-200">{user?.email}</strong></p>
              <Button variant="danger" loading={loggingOut} icon={<LogOut size={15} />} onClick={doLogoutClick}>Logout</Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-zinc-200/80 bg-white/60 px-4 py-3 text-[12.5px] text-zinc-500 dark:border-white/[.06] dark:bg-white/[.03] dark:text-zinc-400">
        <Check size={14} className="shrink-0 text-emerald-500" />
        All changes are stored in Firestore under your UID, and authentication is handled by Firebase.
      </div>
    </>
  )
}
