import React from 'react'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'

interface CardProps {
  children: React.ReactNode
  elevation?: 1 | 2 | 3 | 4 | 5
  padding?: 'none' | 'small' | 'medium' | 'large'
  className?: string
  onClick?: () => void
  interactive?: boolean
}

const CardContainer = styled.div<{
  elevation: number
  padding: string
  interactive: boolean
}>`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => {
    switch (props.elevation) {
      case 1:
        return props.theme.shadows.shadow1
      case 2:
        return props.theme.shadows.shadow2
      case 3:
        return props.theme.shadows.shadow3
      case 4:
        return props.theme.shadows.shadow4
      case 5:
        return props.theme.shadows.shadow5
      default:
        return props.theme.shadows.shadow1
    }
  }};
  transition: all ${props => props.theme.transitions.normal};
  overflow: hidden;
  
  /* Padding variants */
  padding: ${props => {
    switch (props.padding) {
      case 'none':
        return '0'
      case 'small':
        return props.theme.spacing.md
      case 'large':
        return props.theme.spacing.xl
      default:
        return props.theme.spacing.lg
    }
  }};

  /* Interactive state */
  ${props => props.interactive && `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${props.elevation === 1 ? props.theme.shadows.shadow2 :
                   props.elevation === 2 ? props.theme.shadows.shadow3 :
                   props.elevation === 3 ? props.theme.shadows.shadow4 :
                   props.elevation === 4 ? props.theme.shadows.shadow5 :
                   props.theme.shadows.shadow5};
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: ${props.theme.shadows.shadow1};
    }
  `}

  /* Focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`

const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  padding = 'medium',
  className,
  onClick,
  interactive = false,
}) => {
  return (
    <CardContainer
      elevation={elevation}
      padding={padding}
      interactive={interactive}
      className={className}
      onClick={onClick}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
    >
      {children}
    </CardContainer>
  )
}

export default Card
