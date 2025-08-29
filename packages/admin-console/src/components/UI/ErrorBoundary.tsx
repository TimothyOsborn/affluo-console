import React, { Component, ErrorInfo, ReactNode } from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.textPrimary};
  text-align: center;
`

const ErrorCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.shadow3};
  max-width: 600px;
  width: 100%;
`

const ErrorTitle = styled.h1`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.xl3};
  margin-bottom: ${props => props.theme.spacing.md};
`

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  line-height: 1.6;
`

const ErrorDetails = styled.details`
  margin-top: ${props => props.theme.spacing.lg};
  text-align: left;
`

const ErrorSummary = styled.summary`
  cursor: pointer;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const ErrorPre = styled.pre`
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  padding: ${props => props.theme.spacing.md};
  overflow-x: auto;
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const RetryButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: 500;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.normal};
  margin-top: ${props => props.theme.spacing.lg};

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }

  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Log error to external service (e.g., Sentry) in production
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorCard>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </ErrorMessage>
            
            <RetryButton onClick={this.handleRetry}>
              Try Again
            </RetryButton>

            {import.meta.env.DEV && this.state.error && (
              <ErrorDetails>
                <ErrorSummary>Error Details (Development Only)</ErrorSummary>
                <ErrorPre>
                  {this.state.error.toString()}
                  {this.state.errorInfo && '\n\n' + this.state.errorInfo.componentStack}
                </ErrorPre>
              </ErrorDetails>
            )}
          </ErrorCard>
        </ErrorContainer>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
