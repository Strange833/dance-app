import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Home, Search, Calendar, MessageSquare, User, LogOut } from 'lucide-react'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
  requiredRole?: 'dancer' | 'teacher'
}

export function UserNav() {
  const { user, signOut } = useAuth()
  const location = useLocation()

  const navItems: NavItem[] = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/search', icon: <Search size={20} />, label: 'Search' },
    {
      to: '/bookings',
      icon: <Calendar size={20} />,
      label: 'Bookings',
      requiredRole: 'dancer'
    },
    {
      to: '/chats',
      icon: <MessageSquare size={20} />,
      label: 'Chats',
      requiredRole: 'dancer'
    },
    {
      to: '/teacher-dashboard',
      icon: <Calendar size={20} />,
      label: 'Dashboard',
      requiredRole: 'teacher'
    },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' }
  ]

  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true
    return user?.role === item.requiredRole
  })

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {filteredNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center flex-1 ${location.pathname === item.to ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={signOut}
            className="flex flex-col items-center justify-center flex-1 text-gray-500 hover:text-gray-900"
          >
            <LogOut size={20} />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  )
}