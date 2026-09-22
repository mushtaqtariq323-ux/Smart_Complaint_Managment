import { isValidElement } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2.5',
  lg: 'px-5 py-3 text-[15px]',
}

export default function Button({
  variant = 'primary', size = 'md', loading = false, icon: Icon,
  className = '', children, disabled, ...props
}) {
  // `icon` accepts either a component (rendered with sizing) or a ready <Icon /> element
  let iconNode = null
  if (loading) iconNode = <Loader2 size={16} className="animate-spin" />
  else if (Icon) iconNode = isValidElement(Icon) ? Icon : <Icon size={16} className="shrink-0" />

  return (
    <button
      className={`${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {iconNode}
      {children}
    </button>
  )
}
