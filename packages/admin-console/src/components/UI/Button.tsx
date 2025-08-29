import React, { useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
}

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`

const ButtonContainer = styled.button<{
  variant: string
  size: string
  disabled: boolean
  fullWidth: boolean
  loading: boolean
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: 500;
  cursor: ${props => props.disabled || props.loading ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.transitions.normal};
  overflow: hidden;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  min-width: ${props => props.size === 'small' ? '64px' : props.size === 'large' ? '120px' : '88px'};
  
  /* Size variants */
  padding: ${props => {
    switch (props.size) {
      case 'small':
        return `${props.theme.spacing.sm} ${props.theme.spacing.md}`
      case 'large':
        return `${props.theme.spacing.lg} ${props.theme.spacing.xl}`
      default:
        return `${props.theme.spacing.md} ${props.theme.spacing.lg}`
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'small':
        return props.theme.typography.fontSize.sm
      case 'large':
        return props.theme.typography.fontSize.lg
      default:
        return props.theme.typography.fontSize.base
    }
  }};

  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: white;
          box-shadow: ${props.theme.shadows.shadow1};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primaryDark};
            box-shadow: ${props.theme.shadows.shadow2};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.shadow1};
          }
        `
      case 'secondary':
        return `
          background-color: ${props.theme.colors.secondary};
          color: white;
          box-shadow: ${props.theme.shadows.shadow1};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.secondaryDark};
            box-shadow: ${props.theme.shadows.shadow2};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.shadow1};
          }
        `
      case 'outlined':
        return `
          background-color: transparent;
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primary}10;
            border-color: ${props.theme.colors.primaryDark};
          }
        `
      case 'text':
        return `
          background-color: transparent;
          color: ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${props.theme.colors.primary}10;
          }
        `
      default:
        return ''
    }
  }}

  /* Disabled state */
  ${props => props.disabled && `
    opacity: 0.6;
    background-color: ${props.theme.colors.textDisabled} !important;
    color: ${props.theme.colors.textSecondary} !important;
    box-shadow: none !important;
    transform: none !important;
  `}

  /* Focus styles */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }

  /* Loading state */
  ${props => props.loading && `
    pointer-events: none;
  `}
`

const Ripple = styled.span<{ x: number; y: number }>`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transform: scale(0);
  animation: ${ripple} 0.6s linear;
  pointer-events: none;
  width: 20px;
  height: 20px;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
`

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className,
}) => {
  const { theme } = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    // Create ripple effect
    const button = buttonRef.current
    if (button) {
      const rect = button.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      }
      
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }

    onClick?.(event)
  }

  return (
    <ButtonContainer
      ref={buttonRef}
      variant={variant}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      loading={loading}
      onClick={handleClick}
      type={type}
      className={className}
    >
      {loading && <LoadingSpinner />}
      {children}
      {ripples.map(ripple => (
        <Ripple key={ripple.id} x={ripple.x} y={ripple.y} />
      ))}
    </ButtonContainer>
  )
}

export default Button
