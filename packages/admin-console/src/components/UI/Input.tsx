import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'

interface InputProps {
  label?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  variant?: 'outlined' | 'filled'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  className?: string
  onFocus?: () => void
  onBlur?: () => void
  autoComplete?: string
  name?: string
  id?: string
}

const InputContainer = styled.div<{
  fullWidth: boolean
  hasError: boolean
  isFocused: boolean
  hasValue: boolean
  disabled: boolean
  variant: string
}>`
  position: relative;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  font-family: ${props => props.theme.typography.fontFamily};
  
  ${props => props.disabled && `
    opacity: 0.6;
    pointer-events: none;
  `}
`

const InputWrapper = styled.div<{
  variant: string
  isFocused: boolean
  hasError: boolean
  hasValue: boolean
  disabled: boolean
}>`
  position: relative;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  
  ${props => {
    if (props.variant === 'outlined') {
      return `
        border: 2px solid ${props.hasError ? props.theme.colors.error : 
                           props.isFocused ? props.theme.colors.primary : 
                           props.theme.colors.border};
        background-color: ${props.theme.colors.surface};
        
        ${props.isFocused && `
          border-color: ${props.theme.colors.primary};
          box-shadow: 0 0 0 2px ${props.theme.colors.primary}20;
        `}
      `
    } else {
      return `
        border: none;
        border-bottom: 2px solid ${props.hasError ? props.theme.colors.error : 
                                  props.isFocused ? props.theme.colors.primary : 
                                  props.theme.colors.border};
        background-color: ${props.theme.colors.background};
        border-radius: ${props.theme.borderRadius.md} ${props.theme.borderRadius.md} 0 0;
        
        ${props.isFocused && `
          border-bottom-color: ${props.theme.colors.primary};
          background-color: ${props.theme.colors.primary}05;
        `}
      `
    }
  }}
`

const StyledInput = styled.input<{
  variant: string
  size: string
  hasLabel: boolean
  isFocused: boolean
  hasValue: boolean
}>`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  color: ${props => props.theme.colors.textPrimary};
  transition: all ${props => props.theme.transitions.normal};
  
  /* Size variants */
  padding: ${props => {
    const basePadding = props.theme.spacing.md
    const labelPadding = props.hasLabel ? props.theme.spacing.lg : basePadding
    
    switch (props.size) {
      case 'small':
        return `${props.theme.spacing.sm} ${basePadding} ${labelPadding} ${basePadding}`
      case 'large':
        return `${props.theme.spacing.lg} ${basePadding} ${labelPadding} ${basePadding}`
      default:
        return `${basePadding} ${basePadding} ${labelPadding} ${basePadding}`
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

  &::placeholder {
    color: ${props => props.theme.colors.textDisabled};
    opacity: ${props => props.isFocused || props.hasValue ? 0 : 1};
    transition: opacity ${props => props.theme.transitions.normal};
  }

  &:focus {
    outline: none;
  }
`

const FloatingLabel = styled.label<{
  isFocused: boolean
  hasValue: boolean
  size: string
  variant: string
}>`
  position: absolute;
  left: ${props => props.theme.spacing.md};
  color: ${props => props.isFocused ? props.theme.colors.primary : props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.normal};
  pointer-events: none;
  background-color: ${props => props.variant === 'outlined' ? props.theme.colors.surface : 'transparent'};
  
  /* Position and size based on state */
  ${props => {
    const isActive = props.isFocused || props.hasValue
    const baseTop = props.theme.spacing.md
    const activeTop = props.variant === 'outlined' ? `-${props.theme.spacing.sm}` : `-${props.theme.spacing.md}`
    
    return `
      top: ${isActive ? activeTop : baseTop};
      font-size: ${isActive ? props.theme.typography.fontSize.sm : props.theme.typography.fontSize.base};
      transform: ${isActive ? 'translateY(-50%)' : 'none'};
      padding: ${isActive && props.variant === 'outlined' ? `0 ${props.theme.spacing.xs}` : '0'};
    `
  }}
`

const HelperText = styled.div<{
  hasError: boolean
  size: string
}>`
  margin-top: ${props => props.theme.spacing.xs};
  margin-left: ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.textSecondary};
  min-height: 1.2em;
`

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled = false,
  required = false,
  error,
  helperText,
  variant = 'outlined',
  size = 'medium',
  fullWidth = false,
  className,
  onFocus,
  onBlur,
  autoComplete,
  name,
  id,
}) => {
  const { theme } = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value)
  }

  const hasValue = value.length > 0
  const hasError = !!error

  return (
    <InputContainer
      fullWidth={fullWidth}
      hasError={hasError}
      isFocused={isFocused}
      hasValue={hasValue}
      disabled={disabled}
      variant={variant}
      className={className}
    >
      <InputWrapper
        variant={variant}
        isFocused={isFocused}
        hasError={hasError}
        hasValue={hasValue}
        disabled={disabled}
      >
        <StyledInput
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          variant={variant}
          size={size}
          hasLabel={!!label}
          isFocused={isFocused}
          hasValue={hasValue}
          aria-describedby={error || helperText ? `${id}-helper` : undefined}
          aria-invalid={hasError}
        />
        {label && (
          <FloatingLabel
            htmlFor={id}
            isFocused={isFocused}
            hasValue={hasValue}
            size={size}
            variant={variant}
          >
            {label}
            {required && <span style={{ color: theme.colors.error }}> *</span>}
          </FloatingLabel>
        )}
      </InputWrapper>
      {(error || helperText) && (
        <HelperText
          id={`${id}-helper`}
          hasError={hasError}
          size={size}
        >
          {error || helperText}
        </HelperText>
      )}
    </InputContainer>
  )
}

export default Input
