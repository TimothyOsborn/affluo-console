import React from 'react'
import styled from 'styled-components'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  companyId: string
}

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background-color: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.shadow2};
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  transition: transform ${props => props.theme.transitions.normal};
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 100%;
    max-width: 320px;
  }
`

const SidebarHeader = styled.div`
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
`

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`

const Nav = styled.nav`
  padding: ${props => props.theme.spacing.md} 0;
`

const NavSection = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const NavSectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  color: ${props => props.theme.colors.textPrimary};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.normal};
  border-left: 3px solid transparent;
  
  &:hover {
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background-color: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
    border-left-color: ${props => props.theme.colors.primary};
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: -2px;
  }
`

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const NavText = styled.span`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: 500;
`

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all ${props => props.theme.transitions.normal};
  z-index: 999;
  
  @media (min-width: 769px) {
    display: none;
  }
`

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, companyId }) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const menuItems = [
    {
      section: 'Overview',
      items: [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          )
        }
      ]
    },
    {
      section: 'Forms',
      items: [
        {
          label: 'All Forms',
          path: `/companies/${companyId}/forms`,
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
          )
        },
        {
          label: 'Create Form',
          path: `/companies/${companyId}/forms/new`,
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          )
        }
      ]
    },
    {
      section: 'Data',
      items: [
        {
          label: 'Submissions',
          path: `/companies/${companyId}/submissions`,
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          )
        }
      ]
    }
  ]

  // Add user management section for admin users
  if (user?.role === 'COMPANY_ADMIN') {
    menuItems.push({
      section: 'Administration',
      items: [
        {
          label: 'Users & Teams',
          path: `/companies/${companyId}/users`,
          icon: (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.7 2.26V15h-1.5v6H20zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v6h1.5v7h4z"/>
            </svg>
          )
        }
      ]
    })
  }

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onToggle} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <Logo>
            <LogoIcon>F</LogoIcon>
            <span>Forms</span>
          </Logo>
        </SidebarHeader>
        
        <Nav>
          {menuItems.map((section, sectionIndex) => (
            <NavSection key={sectionIndex}>
              <NavSectionTitle>{section.section}</NavSectionTitle>
              {section.items.map((item, itemIndex) => (
                <NavItem
                  key={itemIndex}
                  to={item.path}
                  className={isActive(item.path) ? 'active' : ''}
                >
                  <NavIcon>{item.icon}</NavIcon>
                  <NavText>{item.label}</NavText>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Nav>
      </SidebarContainer>
    </>
  )
}

export default Sidebar
