import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import FormsPage from './pages/FormsPage'
import FormBuilderPage from './pages/FormBuilderPage'
import FormViewPage from './pages/FormViewPage'
import SubmissionsPage from './pages/SubmissionsPage'
import SubmissionViewPage from './pages/SubmissionViewPage'
import UsersPage from './pages/UsersPage'
import LoadingSpinner from './components/UI/LoadingSpinner'
import ErrorBoundary from './components/UI/ErrorBoundary'
import './App.css'

// Lazy load pages for code splitting
const LazyDashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const LazyFormsPage = React.lazy(() => import('./pages/FormsPage'))
const LazyFormBuilderPage = React.lazy(() => import('./pages/FormBuilderPage'))
const LazyFormViewPage = React.lazy(() => import('./pages/FormViewPage'))
const LazySubmissionsPage = React.lazy(() => import('./pages/SubmissionsPage'))
const LazySubmissionViewPage = React.lazy(() => import('./pages/SubmissionViewPage'))
const LazyUsersPage = React.lazy(() => import('./pages/UsersPage'))

function App() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="app-loading">
        <LoadingSpinner size="large" />
        <p>Loading application...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner size="large" />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<LazyDashboardPage />} />
            <Route path="/companies/:companyId/forms" element={<LazyFormsPage />} />
            <Route path="/companies/:companyId/forms/new" element={<LazyFormBuilderPage />} />
            <Route path="/companies/:companyId/forms/:formId" element={<LazyFormViewPage />} />
            <Route path="/companies/:companyId/forms/:formId/edit" element={<LazyFormBuilderPage />} />
            <Route path="/companies/:companyId/submissions" element={<LazySubmissionsPage />} />
            <Route path="/companies/:companyId/submissions/:submissionId" element={<LazySubmissionViewPage />} />
            <Route path="/companies/:companyId/users" element={<LazyUsersPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
