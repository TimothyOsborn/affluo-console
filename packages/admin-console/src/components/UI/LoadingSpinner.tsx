import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerContainer = styled.div<{ size: string; color: string }>`
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  border: 2px solid ${props => props.color}20;
  border-top: 2px solid ${props => props.color};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color, 
  className 
}) => {
  const { theme } = useTheme()
  
  const sizeMap = {
    small: '16px',
    medium: '24px',
    large: '32px'
  }
  
  const spinnerColor = color || theme.colors.primary

  return (
    <SpinnerContainer 
      size={sizeMap[size]} 
      color={spinnerColor}
      className={className}
      role="status"
      aria-label="Loading"
    />
  )
}

export default LoadingSpinner
