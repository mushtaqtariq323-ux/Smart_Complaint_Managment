import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/Feedback'

/**
 * Gate for protected pages. While Firebase auth / profile state is resolving,
 * ONLY a branded loader is rendered — protected content is never flashed.
 */
export function Protected({ children, requireOnboarded = true }) {
  const { user, authLoading, profile, profileLoading } = useAuth()
  const location = useLocation()

  if (authLoading || (user && profileLoading)) return <PageLoader />
  if (!user) {
    // keep any remembered-login hash (#u=…) so the login page comes up prefilled
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    return <Navigate to={`/login${hash}`} state={{ from: location.pathname }} replace />
  }
  if (requireOnboarded && profile && profile.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

/** Wrapper for /login, /signup, /forgot-password — signed-in users go to the dashboard. */
export function PublicOnly({ children }) {
  const { user, authLoading, signupLock } = useAuth()

  if (authLoading) return <PageLoader />
  if (user && !signupLock) return <Navigate to="/dashboard" replace />
  return children
}
