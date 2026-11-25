import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { TeacherCard } from '../types'

interface HomePageProps {
  // Add any props if needed
}

export function HomePage({}: HomePageProps) {
  const { user } = useAuth()
  const [recommendedTeachers, setRecommendedTeachers] = useState<TeacherCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedTeachers = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        // In a real app, you would fetch based on user preferences
        const { data, error } = await supabase
          .from('teachers_view')
          .select('*')
          .order('avg_rating', { ascending: false })
          .limit(4)

        if (error) throw error
        setRecommendedTeachers(data)
      } catch (error) {
        console.error('Error fetching recommended teachers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedTeachers()
  }, [user])

  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dance Teacher</h1>
        <p className="text-xl text-gray-600">Discover professional dance instructors and book your classes</p>
      </section>

      {user && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedTeachers.map((teacher) => (
                <Link
                  key={teacher.user_id}
                  to={`/teacher/${teacher.user_id}`}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-40 bg-gray-200">
                    {teacher.user.avatar_url && (
                      <img
                        src={teacher.user.avatar_url}
                        alt={teacher.user.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{teacher.user.name}</h3>
                    <p className="text-sm text-gray-600">
                      {teacher.styles.map(style => style.name).join(', ')}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{teacher.avg_rating.toFixed(1)} ({teacher.reviews_count})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="bg-indigo-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start Dancing?</h2>
        <p className="text-gray-600 mb-6">Find the perfect dance teacher for your needs and book your first class today.</p>
        <div className="flex justify-center gap-4">
          <Link
            to={user ? '/search' : '/register'}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {user ? 'Find a Teacher' : 'Get Started'}
          </Link>
          {!user && (
            <Link
              to="/login"
              className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}