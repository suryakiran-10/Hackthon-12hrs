import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react'
import { supabase, Application, Interview } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { format, addDays, setHours, setMinutes } from 'date-fns'

export const InterviewScheduling: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [loading, setLoading] = useState(true)
  const [scheduling, setScheduling] = useState(false)

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user])

  const fetchApplications = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(title, company)
        `)
        .eq('user_id', user?.id)
        .eq('status', 'interview')

      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleInterview = async () => {
    if (!selectedApplication || !selectedDate || !selectedTime) return

    setScheduling(true)
    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`)
      
      const { error } = await supabase.from('interviews').insert({
        application_id: selectedApplication.id,
        scheduled_date: scheduledDateTime.toISOString(),
        duration: duration,
        status: 'scheduled'
      })

      if (error) throw error

      alert('Interview scheduled successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error scheduling interview:', error)
      alert('Error scheduling interview. Please try again.')
    } finally {
      setScheduling(false)
    }
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = setMinutes(setHours(new Date(), hour), minute)
        slots.push(format(time, 'HH:mm'))
      }
    }
    return slots
  }

  const generateDateOptions = () => {
    const dates = []
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i)
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }
    return dates
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Schedule Your Interview</h1>
        <p className="text-lg text-gray-600">
          Select an application and choose your preferred interview time
        </p>
      </motion.div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Interviews Available</h2>
          <p className="text-gray-600">You don't have any applications that are ready for interviews yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Application</h2>
            <div className="space-y-3">
              {applications.map((application: any) => (
                <div
                  key={application.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedApplication?.id === application.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <h3 className="font-semibold text-gray-900">{application.jobs.title}</h3>
                  <p className="text-sm text-gray-600">{application.jobs.company}</p>
                  <div className="flex items-center mt-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Interview Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interview Scheduling */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule Details</h2>
            
            {selectedApplication ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Interview Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a date</option>
                    {generateDateOptions().map((date) => (
                      <option key={date.toISOString()} value={format(date, 'yyyy-MM-dd')}>
                        {format(date, 'EEEE, MMMM do, yyyy')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline h-4 w-4 mr-1" />
                    Interview Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    {generateTimeSlots().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Video className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-900">AI-Powered Interview</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your interview will be conducted by our AI interviewer. Make sure you have a stable internet connection and access to camera and microphone.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleScheduleInterview}
                  disabled={!selectedDate || !selectedTime || scheduling}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {scheduling ? 'Scheduling...' : 'Schedule Interview'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Please select an application first</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}