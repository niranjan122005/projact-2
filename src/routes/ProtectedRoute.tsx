import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader } from '../components/common/States'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <Loader label="Checking your session…" />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
