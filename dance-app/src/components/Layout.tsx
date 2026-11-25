import { Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserNav } from './UserNav'

export function Layout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-indigo-600">Dance App</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {user && <UserNav />}
    </div>
  )
}