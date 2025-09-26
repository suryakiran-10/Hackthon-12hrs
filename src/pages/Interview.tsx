import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, VideoOff, Mic, MicOff, Camera, AlertCircle, CheckCircle } from 'lucide-react'

const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background.",
  "Why are you interested in this position?",
  "What are your greatest strengths?",
  "Describe a challenging situation you faced at work and how you handled it.",
  "Where do you see yourself in five years?",
  "Why should we hire you?",
  "Do you have any questions for us?"
]

export const Interview: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [interviewStarted, setInterviewStarted] = useState(false)
  const [interviewComplete, setInterviewComplete] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds
  const [cameraPermission, setCameraPermission] = useState(false)
  const [microphonePermission, setMicrophonePermission] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)

  useEffect(() => {
    requestMediaPermissions()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (interviewStarted && !interviewComplete && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && !interviewComplete) {
      handleCompleteInterview()
    }
    return () => clearInterval(timer)
  }, [interviewStarted, interviewComplete, timeRemaining])

  const requestMediaPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      setStream(stream)
      setCameraPermission(true)
      setMicrophonePermission(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Camera and microphone access is required for the interview. Please allow permissions and refresh the page.')
    }
  }

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const startInterview = () => {
    if (!cameraPermission || !microphonePermission) {
      alert('Please allow camera and microphone permissions to start the interview.')
      return
    }
    setInterviewStarted(true)
    setIsRecording(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleCompleteInterview()
    }
  }

  const handleCompleteInterview = () => {
    setInterviewComplete(true)
    setIsRecording(false)
    
    // Stop all media tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    
    // Simulate processing and redirect to feedback
    setTimeout(() => {
      navigate(`/interview/${id}/feedback`)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!cameraPermission || !microphonePermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <Camera className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Permission Required</h1>
          <p className="text-gray-600 mb-6">
            We need access to your camera and microphone to conduct the interview. Please allow permissions when prompted.
          </p>
          <button
            onClick={requestMediaPermissions}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Allow Access
          </button>
        </motion.div>
      </div>
    )
  }

  if (interviewComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview Complete!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for completing the interview. We're processing your responses and will share feedback shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      
      <div className="relative z-10 h-screen flex">
        {/* Video Section */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-black/50 backdrop-blur-sm p-4 flex justify-between items-center">
            <div className="text-white">
              <h1 className="text-xl font-semibold">AI Interview Session</h1>
              <p className="text-sm opacity-75">Stay focused and answer clearly</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm">Recording</span>
                </div>
              )}
              <div className="text-white font-mono">
                {formatTime(timeRemaining)}
              </div>
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 relative bg-black">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Video Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-colors ${
                  videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {videoEnabled ? (
                  <Video className="h-6 w-6 text-white" />
                ) : (
                  <VideoOff className="h-6 w-6 text-white" />
                )}
              </button>
              
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-colors ${
                  audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {audioEnabled ? (
                  <Mic className="h-6 w-6 text-white" />
                ) : (
                  <MicOff className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Interview Panel */}
        <div className="w-96 bg-white flex flex-col">
          {/* AI Avatar Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Interviewer</h3>
                <p className="text-sm text-gray-600">HR Assistant</p>
              </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="flex-1 p-6">
            {!interviewStarted ? (
              <div className="space-y-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Start?</h2>
                  <p className="text-gray-600 text-sm">
                    This interview will last 30 minutes with {INTERVIEW_QUESTIONS.length} questions. Make sure you're in a quiet environment.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Camera permission granted</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Microphone permission granted</span>
                  </div>
                </div>

                <button
                  onClick={startInterview}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Start Interview
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    Question {currentQuestion + 1} of {INTERVIEW_QUESTIONS.length}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentQuestion + 1) / INTERVIEW_QUESTIONS.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-blue-50 p-4 rounded-lg"
                  >
                    <p className="text-gray-800 font-medium">
                      {INTERVIEW_QUESTIONS[currentQuestion]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-3">
                  <button
                    onClick={nextQuestion}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {currentQuestion === INTERVIEW_QUESTIONS.length - 1 ? 'Complete Interview' : 'Next Question'}
                  </button>
                  
                  <button
                    onClick={handleCompleteInterview}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    End Interview Early
                  </button>
                </div>

                <div className="text-xs text-gray-500 mt-4">
                  <p>Tips:</p>
                  <ul className="list-disc list-inside space-y-1 mt-1">
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Maintain eye contact with the camera</li>
                    <li>Take your time to think before answering</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}