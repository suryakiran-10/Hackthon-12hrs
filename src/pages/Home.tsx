import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, DollarSign, Clock, Filter, Download } from 'lucide-react'
import { supabase, Job, sampleJobs } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLocation, setFilterLocation] = useState('')
  const [filterType, setFilterType] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
      
      if (error) {
        console.warn('Database not set up, using sample data:', error.message)
        setJobs(sampleJobs)
      } else {
        setJobs(data || [])
      }
    } catch (error) {
      console.warn('Database not set up, using sample data:', error)
      setJobs(sampleJobs)
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = !filterLocation || job.location.toLowerCase().includes(filterLocation.toLowerCase())
    const matchesType = !filterType || job.type === filterType
    
    return matchesSearch && matchesLocation && matchesType
  })

  const downloadJobDescription = async (job: Job, format: 'pdf' | 'docx' | 'txt') => {
    // This would typically call an API endpoint to generate the file
    const content = `${job.title}\n${job.company}\n\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}\n\nBenefits:\n${job.benefits.join('\n')}`
    
    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${job.title.replace(/\s+/g, '_')}_job_description.txt`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // For PDF and DOCX, you'd typically call your backend API
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing opportunities and take the next step in your career
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="remote">Remote</option>
            </select>
          </div>
          
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Search Jobs
          </button>
        </div>
      </motion.div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 cursor-pointer"
            onClick={() => navigate(`/job/${job.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-blue-600 font-medium mb-1">{job.company}</p>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {job.location}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    downloadJobDescription(job, 'txt')
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Download as TXT"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.type === 'full-time' ? 'bg-green-100 text-green-700' :
                job.type === 'part-time' ? 'bg-yellow-100 text-yellow-700' :
                job.type === 'contract' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {job.type}
              </span>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{job.salary_range}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {job.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(job.posted_date).toLocaleDateString()}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Details →
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}