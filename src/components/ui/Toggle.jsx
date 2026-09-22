export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</span>
        {description && <span className="mt-0.5 block text-[12.5px] text-zinc-500 dark:text-zinc-400">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? 'bg-gradient-to-r from-lime-400 to-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </label>
  )
}
