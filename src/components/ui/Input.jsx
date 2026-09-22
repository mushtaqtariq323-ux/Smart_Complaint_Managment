import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function Input({ label, error, icon: Icon, hint, className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />}
        <input id={id} className={`field ${Icon ? 'pl-10' : ''} ${error ? 'field-error' : ''}`} {...props} />
      </div>
      {error ? <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
        : hint ? <p className="mt-1.5 text-xs text-zinc-400 dark:text-zinc-500">{hint}</p> : null}
    </div>
  )
}

export function PasswordInput({ label, error, value, onChange, placeholder, autoComplete = 'current-password' }) {
  const [show, setShow] = useState(false)
  const id = useId()
  return (
    <div>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`field pr-11 ${error ? 'field-error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-white/10 dark:hover:text-zinc-200"
          aria-label={show ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  )
}

export function Select({ label, options = [], error, className = '', ...props }) {
  const id = useId()
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="label">{label}</label>}
      <select id={id} className={`field appearance-none ${error ? 'field-error' : ''}`} {...props}>
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value
          const lab = typeof o === 'string' ? o : o.label
          return <option key={val} value={val}>{lab}</option>
        })}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  )
}
