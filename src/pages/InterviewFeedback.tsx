import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, TrendingUp, MessageSquare, Download, Home, Calendar } from 'lucide-react'

interface FeedbackData {
  overallScore: number
  communication: number
  technical: number
  confidence: number
  clarity: number
  strengths: string[]
  improvements: string[]
  detailedFeedback: string
  recommendations: string[]
}

export const InterviewFeedback: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<FeedbackData | null>(null)

  useEffect(() => {
    // Simulate AI processing and feedback generation
    setTimeout(() => {
      setFeedback({
        overallScore: 78,
        communication: 82,
        technical: 75,
        confidence: 80,
        clarity: 76,
        strengths: [
          "Excellent communication skills and clear articulation",
          "Strong technical knowledge in relevant areas",
          "Confident presentation and professional demeanor",
          "Good examples and specific details in responses"
        ],
        improvements: [
          "Could provide more specific examples for behavioral questions",
          "Consider structuring answers using the STAR method",
          "Work on reducing filler words during responses",
          "Prepare more questions to ask the interviewer"
        ],
        detailedFeedback: "Your interview performance showed strong potential with several standout qualities. Your communication skills were particularly impressive, demonstrating clarity and professionalism throughout the session. Your technical responses showed solid understanding of core concepts, though there's room for more detailed explanations in some areas. Your confidence level was appropriate and you maintained good eye contact with the camera. Overall, this was a solid interview performance that positions you well for consideration.",
        recommendations: [
          "Practice the STAR method for behavioral questions",
          "Research common industry-specific technical questions",
          "Prepare thoughtful questions about the company culture",
          "Work on storytelling techniques to make examples more engaging",
          "Consider taking a public speaking or presentation course"
        ]
      })
      setLoading(false)
    }, 3000)
  }, [])

  const downloadFeedbackReport = () => {
    if (!feedback) return
    
    const content = `
INTERVIEW FEEDBACK REPORT

Overall Score: ${feedback.overallScore}/100

SKILL BREAKDOWN:
- Communication: ${feedback.communication}/100
- Technical Knowledge: ${feedback.technical}/100
- Confidence: ${feedback.confidence}/100
- Clarity: ${feedback.clarity}/100

STRENGTHS:
${feedback.strengths.map(s => `• ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${feedback.improvements.map(i => `• ${i}`).join('\n')}

DETAILED FEEDBACK:
${feedback.detailedFeedback}

RECOMMENDATIONS:
${feedback.recommendations.map(r => `• ${r}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'interview_feedback_report.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 80) return 'Good'
    if (score >= 70) return 'Average'
    if (score >= 60) return 'Below Average'
    return 'Needs Improvement'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Interview</h2>
          <p className="text-gray-600">Our AI is processing your responses and generating personalized feedback...</p>
        </motion.div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Feedback</h2>
          <p className="text-gray-600 mb-4">We couldn't load your interview feedback. Please try again.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Feedback Report</h1>
          <p className="text-lg text-gray-600">
            Here's your detailed performance analysis and recommendations for improvement
          </p>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreColor(feedback.overallScore)}`}>
                  <span className="text-3xl font-bold">{feedback.overallScore}</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2">
                <Star className="h-8 w-8 text-yellow-400 fill-current" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Overall Score: {getScoreLabel(feedback.overallScore)}
          </h2>
          <p className="text-gray-600">
            You scored {feedback.overallScore} out of 100 points
          </p>
        </motion.div>

        {/* Skill Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Skill Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Communication', score: feedback.communication },
              { label: 'Technical Knowledge', score: feedback.technical },
              { label: 'Confidence', score: feedback.confidence },
              { label: 'Clarity', score: feedback.clarity }
            ].map((skill, index) => (
              <div key={skill.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{skill.label}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(skill.score)}`}>
                    {skill.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.score}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-3 rounded-full ${
                      skill.score >= 80 ? 'bg-green-500' :
                      skill.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {feedback.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <div className="flex items-center mb-4">
              <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
            </div>
            <ul className="space-y-3">
              {feedback.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{improvement}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Detailed Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Detailed Feedback</h3>
          <p className="text-gray-700 leading-relaxed">{feedback.detailedFeedback}</p>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedback.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <span className="text-gray-700">{recommendation}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={downloadFeedbackReport}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Download className="h-5 w-5" />
            <span>Download Report</span>
          </button>
          
          <button
            onClick={() => navigate('/schedule-interview')}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Calendar className="h-5 w-5" />
            <span>Schedule Another Interview</span>
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <Home className="h-5 w-5" />
            <span>Back to Home</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}