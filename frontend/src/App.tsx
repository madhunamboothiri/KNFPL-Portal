import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import FirstLoginPage from './pages/FirstLoginPage'
import type { User } from './types'

function getStoredUser(): User | null {
  try { return JSON.parse(localStorage.getItem('user') ?? 'null') } catch { return null }
}

function PrivateRoute({ children, requireRole }: { children: React.ReactNode; requireRole?: string }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  const user = getStoredUser()
  if (user?.neverLogged === false) return <Navigate to="/first-login" replace />
  if (requireRole) {
    if (!user || user.role !== requireRole) return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute requireRole="SuperAdmin">
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route path="/first-login" element={<FirstLoginPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
