import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Logo from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <p className="mt-10 font-display text-7xl font-bold gradient-text">404</p>
      <h1 className="mt-3 font-display text-xl font-bold text-zinc-900 dark:text-white">This page took a rest day</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-7 flex gap-3">
        <Link to="/" className="btn-outline px-4 py-2.5"><Home size={15} /> Landing page</Link>
        <Link to="/dashboard" className="btn-primary px-4 py-2.5"><ArrowLeft size={15} /> Go to dashboard</Link>
      </div>
    </div>
  )
}
