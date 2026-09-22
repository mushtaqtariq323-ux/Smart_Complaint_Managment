import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { DataProvider } from '@/context/DataContext'
import { Protected, PublicOnly } from '@/routes/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import { PageLoader } from '@/components/ui/Feedback'
import DashboardLayout from '@/layouts/DashboardLayout'
import ErrorBoundary from '@/components/ErrorBoundary'

import Landing from '@/pages/Landing'
import Signup from '@/pages/auth/Signup'
import Login from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Onboarding from '@/pages/Onboarding'
import Dashboard from '@/pages/Dashboard'
import BodyAnalysis from '@/pages/BodyAnalysis'
import Workout from '@/pages/Workout'
import Diet from '@/pages/Diet'
import Progress from '@/pages/Progress'
import Planner from '@/pages/Planner'
import AICoach from '@/pages/AICoach'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

/** Landing stays public, but an already signed-in user goes straight to their dashboard. */
function PublicHome() {
  const { user, authLoading } = useAuth()
  if (authLoading) return <PageLoader />
  if (user) return <Navigate to="/dashboard" replace />
  return <Landing />
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <BrowserRouter>
              <div className="app-glow" aria-hidden="true" />
              <div className="relative z-10">
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<PublicHome />} />
                  <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
                  <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
                  <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />

                  {/* Authed, pre-onboarding */}
                  <Route path="/onboarding" element={<Protected requireOnboarded={false}><Onboarding /></Protected>} />

                  {/* Protected app */}
                  <Route element={<Protected><DashboardLayout /></Protected>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/body-analysis" element={<BodyAnalysis />} />
                    <Route path="/workout" element={<Workout />} />
                    <Route path="/diet" element={<Diet />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/planner" element={<Planner />} />
                    <Route path="/ai-coach" element={<AICoach />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Route>

                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </BrowserRouter>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}
