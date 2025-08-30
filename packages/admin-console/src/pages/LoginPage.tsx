import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import Card from '../components/UI/Card'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}20 0%, ${props => props.theme.colors.secondary}20 100%);
`

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${props => props.theme.spacing.xl};
`

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.primary};
`

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xl2};
  font-weight: bold;
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl3};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0 0 ${props => props.theme.spacing.sm} 0;
`

const Subtitle = styled.p`
  font-size: ${props => props.theme.typography.fontSize.base};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
  min-height: 1.2em;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const LoginPage: React.FC = () => {
  const { theme } = useTheme()
  const { login, error, clearError, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<{
    username?: string
    password?: string
  }>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error when user starts typing
    if (validationErrors[field as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError()
    }
  }

  const validateForm = () => {
    const errors: { username?: string; password?: string } = {}

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Login form submitted with:', formData)
    
    if (!validateForm()) {
      return
    }

    try {
      const credentials = {
        username: formData.username,
        password: formData.password
      }
      console.log('Calling login with credentials:', credentials)
      await login(credentials)
    } catch (error) {
      console.log('Login error in LoginPage:', error)
      // Error is handled by the auth context
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  return (
    <LoginContainer>
      <LoginCard elevation={3}>
        <LoginHeader>
          <Logo>
            <LogoIcon>F</LogoIcon>
            <span>Forms</span>
          </Logo>
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
        </LoginHeader>

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              label="Username"
              value={formData.username}
              onChange={(value) => handleInputChange('username', value)}
              placeholder="Enter your username"
              error={validationErrors.username}
              disabled={isLoading}
              autoComplete="username"
              onKeyPress={handleKeyPress}
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              placeholder="Enter your password"
              error={validationErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
              onKeyPress={handleKeyPress}
            />
          </FormGroup>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingContainer>
                <LoadingSpinner size="small" />
                Signing in...
              </LoadingContainer>
            ) : (
              'Sign In'
            )}
          </Button>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  )
}

export default LoginPage
