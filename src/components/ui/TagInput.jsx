import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export default function TagInput({ values = [], onChange, placeholder = 'Type and press Enter…', inputId }) {
  const [text, setText] = useState('')

  const add = () => {
    const v = text.trim()
    if (!v) return
    if (!values.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...values, v])
    setText('')
  }

  return (
    <div className="field flex min-h-[46px] flex-wrap items-center gap-1.5 !py-2">
      {values.map((v) => (
        <span key={v} className="chip border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          {v}
          <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="rounded-full p-0.5 transition hover:bg-emerald-500/20" aria-label={`Remove ${v}`}>
            <X size={11} />
          </button>
        </span>
      ))}
      <div className="flex min-w-[120px] flex-1 items-center gap-1">
        <input
          id={inputId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
            if (e.key === 'Backspace' && !text && values.length) onChange(values.slice(0, -1))
          }}
          onBlur={add}
          placeholder={values.length ? '' : placeholder}
          className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-white"
        />
        <button type="button" onClick={add} className="rounded-md p-1 text-zinc-400 transition hover:text-emerald-500" aria-label="Add">
          <Plus size={15} />
        </button>
      </div>
    </div>
  )
}
