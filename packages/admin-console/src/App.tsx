import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import LoginPage from './pages/LoginPage'
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
const LazyListsPage = React.lazy(() => import('./pages/ListsPage'))
const LazyListBuilderPage = React.lazy(() => import('./pages/ListBuilderPage'))

function App() {
  const { isAuthenticated, isLoading, user } = useAuth()

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

  // Get company ID from authenticated user
  const companyId = user?.companyId || 'company-1'

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<LoadingSpinner size="large" />}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<LazyDashboardPage />} />
            <Route path="/forms" element={<Navigate to={`/companies/${companyId}/forms`} replace />} />
            <Route path="/forms/new" element={<Navigate to={`/companies/${companyId}/forms/new`} replace />} />
            <Route path="/forms/:formId" element={<Navigate to={`/companies/${companyId}/forms/:formId`} replace />} />
            <Route path="/forms/:formId/edit" element={<Navigate to={`/companies/${companyId}/forms/:formId/edit`} replace />} />
            <Route path="/submissions" element={<Navigate to={`/companies/${companyId}/submissions`} replace />} />
            <Route path="/submissions/:submissionId" element={<Navigate to={`/companies/${companyId}/submissions/:submissionId`} replace />} />
                             <Route path="/users" element={<Navigate to={`/companies/${companyId}/users`} replace />} />
                 <Route path="/lists" element={<Navigate to={`/companies/${companyId}/lists`} replace />} />
                 <Route path="/companies/:companyId/forms" element={<LazyFormsPage />} />
                 <Route path="/companies/:companyId/forms/new" element={<LazyFormBuilderPage />} />
                 <Route path="/companies/:companyId/forms/:formId" element={<LazyFormViewPage />} />
                 <Route path="/companies/:companyId/forms/:formId/edit" element={<LazyFormBuilderPage />} />
                 <Route path="/companies/:companyId/submissions" element={<LazySubmissionsPage />} />
                 <Route path="/companies/:companyId/submissions/:submissionId" element={<LazySubmissionViewPage />} />
                 <Route path="/companies/:companyId/users" element={<LazyUsersPage />} />
                 <Route path="/companies/:companyId/lists" element={<LazyListsPage />} />
                 <Route path="/companies/:companyId/lists/new" element={<LazyListBuilderPage />} />
                 <Route path="/companies/:companyId/lists/:listId" element={<LazyListBuilderPage />} />
                 <Route path="/companies/:companyId/lists/:listId/edit" element={<LazyListBuilderPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}

export default App
