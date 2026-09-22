import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, XCircle, Info, X, AlertTriangle } from 'lucide-react'

const ToastContext = createContext(null)
let idCounter = 0

const STYLES = {
  success: { icon: CheckCircle2, ring: 'ring-emerald-500/30', bar: 'from-lime-400 to-emerald-500', iconColor: 'text-emerald-500' },
  error: { icon: XCircle, ring: 'ring-rose-500/30', bar: 'from-rose-400 to-rose-600', iconColor: 'text-rose-500' },
  info: { icon: Info, ring: 'ring-sky-500/30', bar: 'from-sky-400 to-indigo-500', iconColor: 'text-sky-500' },
  warning: { icon: AlertTriangle, ring: 'ring-amber-500/30', bar: 'from-amber-400 to-orange-500', iconColor: 'text-amber-500' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback((type, message, title) => {
    const id = ++idCounter
    setToasts((t) => [...t.slice(-3), { id, type, message, title }])
    timers.current[id] = setTimeout(() => dismiss(id), 4600)
  }, [dismiss])

  const toast = useMemo(() => ({
    success: (msg, title = 'Success') => push('success', msg, title),
    error: (msg, title = 'Something went wrong') => push('error', msg, title),
    info: (msg, title = 'Heads up') => push('info', msg, title),
    warning: (msg, title = 'Warning') => push('warning', msg, title),
  }), [push])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2.5">
        {toasts.map((t) => {
          const S = STYLES[t.type] || STYLES.info
          const Icon = S.icon
          return (
            <div key={t.id} className={`pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl bg-white/95 p-3.5 shadow-xl ring-1 backdrop-blur-md animate-scale-in dark:bg-zinc-900/95 dark:shadow-black/50 ${S.ring}`}>
              <span className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${S.bar}`} style={{ position: 'absolute' }} />
              <Icon size={19} className={`mt-0.5 shrink-0 ${S.iconColor}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{t.title}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">{t.message}</p>
              </div>
              <button onClick={() => dismiss(t.id)} className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-200" aria-label="Dismiss">
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
