import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { TeacherProfilePage } from './pages/TeacherProfilePage'
import { BookingsPage } from './pages/BookingsPage'
import { ChatsPage } from './pages/ChatsPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { RegistrationPage } from './pages/RegistrationPage'
import { SurveyPage } from './pages/SurveyPage'
import { TeacherDashboardPage } from './pages/TeacherDashboardPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/survey" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/teacher/:id" element={<TeacherProfilePage />} />
            <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            <Route path="/chats" element={<ProtectedRoute><ChatsPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/teacher-dashboard" element={<ProtectedRoute requiredRole="teacher"><TeacherDashboardPage /></ProtectedRoute>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App