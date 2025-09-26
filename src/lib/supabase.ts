import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sample data for testing when database tables don't exist
export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary_range: '$120,000 - $160,000',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks.',
    requirements: ['5+ years of React experience', 'Strong TypeScript skills', 'Experience with modern build tools', 'Knowledge of responsive design'],
    benefits: ['Health insurance', 'Flexible working hours', 'Remote work options', '401k matching'],
    posted_date: '2024-01-15',
    application_deadline: '2024-02-15',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'full-time',
    salary_range: '$100,000 - $140,000',
    description: 'Join our product team to drive the development of innovative solutions. You will work closely with engineering and design teams to deliver exceptional user experiences.',
    requirements: ['3+ years product management experience', 'Strong analytical skills', 'Experience with Agile methodologies', 'Excellent communication skills'],
    benefits: ['Equity package', 'Unlimited PTO', 'Learning budget', 'Team retreats'],
    posted_date: '2024-01-10',
    application_deadline: '2024-02-10',
    created_at: '2024-01-10T09:00:00Z'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    type: 'contract',
    salary_range: '$80 - $120/hour',
    description: 'We need a talented UX Designer to help create intuitive and engaging user experiences for our clients. You will be involved in the entire design process from research to prototyping.',
    requirements: ['Portfolio showcasing UX work', 'Proficiency in Figma/Sketch', 'User research experience', 'Understanding of accessibility principles'],
    benefits: ['Flexible schedule', 'Remote work', 'Professional development', 'Creative freedom'],
    posted_date: '2024-01-12',
    application_deadline: '2024-02-12',
    created_at: '2024-01-12T14:00:00Z'
  }
]

export type Job = {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary_range: string
  description: string
  requirements: string[]
  benefits: string[]
  posted_date: string
  application_deadline: string
  created_at: string
}

export type Application = {
  id: string
  user_id: string
  job_id: string
  resume_url: string
  cover_letter: string
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'hired'
  applied_at: string
}

export type Interview = {
  id: string
  application_id: string
  scheduled_date: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  feedback_score?: number
  feedback_report?: string
  created_at: string
}