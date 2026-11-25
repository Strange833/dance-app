export type UserRole = 'dancer' | 'teacher' | 'admin'

export interface User {
  id: string
  role: UserRole
  name: string
  phone?: string
  email?: string
  avatar_url?: string
  city?: string
  created_at: string
}

export interface DancerProfile {
  user_id: string
  level: 'never' | 'beginner' | 'intermediate' | 'advanced'
  goals: string[]
  formats: string[]
  preferred_times: string[]
  budget_min?: number
  budget_max?: number
  city?: string
  notes?: string
  updated_at: string
}

export interface TeacherProfile {
  user_id: string
  bio: string
  video_url?: string
  experience: string
  education: string
  formats: ('offline' | 'online')[]
  locations: string[]
  price_individual: number
  price_group: number
  price_trial: number
  cancellation_hours: number
  auto_confirm: boolean
  is_visible: boolean
  verification_status: 'pending' | 'approved' | 'rejected'
  updated_at: string
}

export interface DanceStyle {
  id: string
  name: string
  is_active: boolean
}

export interface TeacherStyle {
  teacher_id: string
  style_id: string
  levels: ('never' | 'beginner' | 'intermediate' | 'advanced')[]
}

export interface Slot {
  id: string
  teacher_id: string
  style_id: string
  starts_at: string
  duration_minutes: number
  format: 'offline' | 'online'
  location?: string
  online_url?: string
  price: number
  max_participants: number
  confirmation_mode: 'auto' | 'manual'
  created_at: string
}

export interface Booking {
  id: string
  slot_id: string
  dancer_id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'completed'
  created_at: string
  cancelled_at?: string
  cancel_reason?: string
  is_late_cancellation: boolean
}

export interface BookingHistory {
  id: string
  booking_id: string
  action: 'created' | 'rescheduled' | 'cancelled' | 'confirmed' | 'completed'
  author_id: string
  created_at: string
}

export interface Chat {
  id: string
  dancer_id: string
  teacher_id: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  author_id: string
  text: string
  attachment_url?: string
  status: 'sent' | 'delivered' | 'read'
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  rating: number
  criteria_ratings?: {
    teaching: number
    atmosphere: number
    punctuality: number
  }
  text: string
  teacher_reply?: string
  moderation_status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface Favorite {
  dancer_id: string
  teacher_id: string
  created_at: string
}

export interface Complaint {
  id: string
  author_id: string
  target_type: 'review' | 'message' | 'profile'
  target_id: string
  reason: string
  status: 'pending' | 'resolved' | 'dismissed'
  resolution?: string
  created_at: string
}

// Survey types
export interface SurveyQuestion {
  id: string
  text: string
  type: 'multi_select' | 'single_select' | 'range' | 'text' | 'city'
  required: boolean
  order: number
  options?: string[]
  survey_type: 'registration' | 'login'
}

export interface SurveyAnswer {
  user_id: string
  question_id: string
  value: string
  survey_type: 'registration' | 'login'
  created_at: string
}

// Extended types for UI
export interface TeacherCard extends TeacherProfile {
  user: User
  styles: (DanceStyle & { levels: string[] })[]
  avg_rating: number
  reviews_count: number
  distance_km?: number
}

export interface SlotWithTeacher extends Slot {
  teacher: TeacherCard
  style: DanceStyle
  booked_count: number
  is_booked_by_me: boolean
  my_booking?: Booking
}

export interface ChatWithLastMessage extends Chat {
  other_user: User
  last_message?: Message
  unread_count: number
}