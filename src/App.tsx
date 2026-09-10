import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/Login/LoginPage'
import { AdminLoginPage } from './pages/Login/AdminLoginPage'
import { ForgotPasswordPage } from './pages/Login/ForgotPasswordPage'
import { AppLayout } from './components/common/AppLayout'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { RoleRoute } from './routes/RoleRoute'
import { DashboardPage } from './pages/Dashboard/DashboardPage'
import { ReportsPage } from './pages/Dashboard/ReportsPage'
import { TicketsListPage } from './pages/Tickets/TicketsListPage'
import { CreateTicketPage } from './pages/Tickets/CreateTicketPage'
import { TicketDetailsPage } from './pages/Tickets/TicketDetailsPage'
import { UserManagementPage } from './pages/Users/UserManagementPage'
import { CategoryManagementPage } from './pages/Categories/CategoryManagementPage'
import { ProfilePage } from './pages/Profile/ProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsListPage />} />
          <Route path="/tickets/new" element={<CreateTicketPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route element={<RoleRoute allow={['Admin']} />}>
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/categories" element={<CategoryManagementPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
