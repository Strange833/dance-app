import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { SurveyQuestion, SurveyAnswer } from '../types'

interface SurveyPageProps {
  isRegistrationSurvey?: boolean
}

export function SurveyPage({ isRegistrationSurvey = true }: SurveyPageProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          .from('survey_questions')
          .select('*')
          .eq('survey_type', isRegistrationSurvey ? 'registration' : 'login')
          .order('order', { ascending: true })

        if (error) throw error
        setQuestions(data)
      } catch (error) {
        console.error('Error fetching survey questions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [isRegistrationSurvey])

  const handleAnswerChange = (questionId: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      navigate('/')
    }
  }

  const handleSubmit = async () => {
    if (!user) return

    setSubmitting(true)
    try {
      // Prepare answers for insertion
      const answersToInsert = questions
        .filter(q => answers[q.id] !== undefined)
        .map(q => ({
          user_id: user.id,
          question_id: q.id,
          value: Array.isArray(answers[q.id]) ? answers[q.id].join(',') : answers[q.id],
          survey_type: isRegistrationSurvey ? 'registration' : 'login'
        }))

      // Insert answers
      if (answersToInsert.length > 0) {
        const { error } = await supabase
          .from('survey_answers')
          .upsert(answersToInsert, { onConflict: 'user_id,question_id,survey_type' })

        if (error) throw error
      }

      // Navigate based on survey type
      if (isRegistrationSurvey) {
        if (user.role === 'teacher') {
          navigate('/teacher-dashboard')
        } else {
          navigate('/')
        }
      } else {
        navigate('/')
      }
    } catch (error) {
      console.error('Error submitting survey:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Loading survey...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Survey Not Available</h2>
        <p className="text-gray-600 mb-6">There are no questions in this survey.</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRegistrationSurvey ? 'Welcome Survey' : 'Quick Survey'}
          </h2>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {currentQuestion.text}
          {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
        </h3>

        {currentQuestion.type === 'multi_select' && (
          <div className="space-y-3">
            {currentQuestion.options?.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={(answers[currentQuestion.id] as string[])?.includes(option) || false}
                  onChange={(e) => {
                    const currentAnswers = (answers[currentQuestion.id] as string[]) || []
                    if (e.target.checked) {
                      handleAnswerChange(currentQuestion.id, [...currentAnswers, option])
                    } else {
                      handleAnswerChange(
                        currentQuestion.id,
                        currentAnswers.filter(a => a !== option)
                      )
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'single_select' && (
          <div className="space-y-3">
            {currentQuestion.options?.map(option => (
              <label key={option} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  checked={(answers[currentQuestion.id] as string) === option}
                  onChange={() => handleAnswerChange(currentQuestion.id, option)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {currentQuestion.type === 'text' && (
          <textarea
            value={(answers[currentQuestion.id] as string) || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
          />
        )}
      </div>

      <div className="flex justify-between">
        {currentQuestionIndex > 0 ? (
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}

        <div className="flex space-x-4">
          {currentQuestionIndex < questions.length - 1 && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentQuestion.required && !answers[currentQuestion.id]}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${currentQuestion.required && !answers[currentQuestion.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  )
}