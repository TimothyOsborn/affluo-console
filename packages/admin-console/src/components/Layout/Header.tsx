import React from 'react'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../UI/Button'

interface HeaderProps {
  onMenuClick: () => void
  user: {
    username: string
    email: string
    role: string
    companyName: string
  }
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.shadow1};
  min-height: 64px;
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  color: ${props => props.theme.colors.textPrimary};
  transition: background-color ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const CompanyName = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const AppName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  @media (max-width: 480px) {
    display: none;
  }
`

const UserName = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
`

const UserRole = styled.span`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const Header: React.FC<HeaderProps> = ({ onMenuClick, user }) => {
  const { theme } = useTheme()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </MenuButton>
        
        <CompanyInfo>
          <CompanyName>{user.companyName}</CompanyName>
          <AppName>Form Admin Console</AppName>
        </CompanyInfo>
      </LeftSection>

      <RightSection>
        <UserInfo>
          <UserName>{user.username}</UserName>
          <UserRole>{user.role}</UserRole>
        </UserInfo>
        
        <UserAvatar>
          {getUserInitials(user.username)}
        </UserAvatar>
        
        <Button
          variant="text"
          size="small"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </RightSection>
    </HeaderContainer>
  )
}

export default Header
