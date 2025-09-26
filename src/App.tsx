import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Layout } from './components/Layout'
import { Auth } from './pages/Auth'
import { Home } from './pages/Home'
import { JobDetails } from './pages/JobDetails'
import { InterviewScheduling } from './pages/InterviewScheduling'
import { Interview } from './pages/Interview'
import { InterviewFeedback } from './pages/InterviewFeedback'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? <Layout>{children}</Layout> : <Navigate to="/auth" />
}

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" /> : <Auth />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/job/:id"
        element={
          <ProtectedRoute>
            <JobDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule-interview"
        element={
          <ProtectedRoute>
            <InterviewScheduling />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id/feedback"
        element={
          <ProtectedRoute>
            <InterviewFeedback />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App