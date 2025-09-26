import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, DollarSign, Clock, Upload, FileText, Download } from 'lucide-react'
import { supabase, Job, sampleJobs } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    if (id) {
      fetchJob()
    }
  }, [id])

  const fetchJob = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()
      
      if (error) {
        console.warn('Database not set up, using sample data:', error.message)
        const sampleJob = sampleJobs.find(job => job.id === id)
        setJob(sampleJob || null)
      } else {
        setJob(data)
      }
    } catch (error) {
      console.warn('Database not set up, using sample data:', error)
      const sampleJob = sampleJobs.find(job => job.id === id)
      setJob(sampleJob || null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleApply = async () => {
    if (!user || !job || !resumeFile) return

    setApplying(true)
    try {
      // Upload resume file
      const fileExt = resumeFile.name.split('.').pop()
      const fileName = `resume_${user.id}_${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile)

      if (uploadError) throw uploadError

      // Create application record
      const { error: applicationError } = await supabase.from('applications').insert({
        user_id: user.id,
        job_id: job.id,
        resume_url: fileName,
        cover_letter: coverLetter,
        status: 'pending'
      })

      if (applicationError) throw applicationError

      // Send confirmation email (this would call an edge function)
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          jobTitle: job.title,
          company: job.company
        })
      })

      alert('Application submitted successfully! You will receive an email confirmation shortly.')
      setShowApplicationForm(false)
    } catch (error) {
      console.error('Error applying for job:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setApplying(false)
    }
  }

  const downloadJobDescription = (format: 'pdf' | 'docx' | 'txt') => {
    if (!job) return
    
    if (format === 'txt') {
      const content = `${job.title}\n${job.company}\nLocation: ${job.location}\nType: ${job.type}\nSalary: ${job.salary_range}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}\n\nBenefits:\n${job.benefits.join('\n')}`
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${job.title.replace(/\s+/g, '_')}_job_description.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      alert(`${format.toUpperCase()} download would be implemented with backend API`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Job not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Jobs
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Jobs
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => downloadJobDescription('txt')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>TXT</span>
            </button>
            <button
              onClick={() => downloadJobDescription('pdf')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => downloadJobDescription('docx')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>DOCX</span>
            </button>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-blue-600 font-medium mb-4">{job.company}</p>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {job.salary_range}
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {job.type}
                </div>
              </div>
            </div>
            
            {!showApplicationForm && (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Apply Now
              </button>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Application Form */}
        {showApplicationForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Apply for this Position</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us why you're interested in this role..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleApply}
                  disabled={!resumeFile || applying}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}