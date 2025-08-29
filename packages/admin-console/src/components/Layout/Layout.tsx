import React, { useState } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import Sidebar from './Sidebar'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background};
`

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarOpen ? '280px' : '0'};
  transition: margin-left ${props => props.theme.transitions.normal};
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const ContentArea = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.md};
  }
  
  @media (max-width: 480px) {
    padding: ${props => props.theme.spacing.sm};
  }
`

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (!user) {
    return <>{children}</>
  }

  return (
    <LayoutContainer>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        companyId={user.companyId}
      />
      <MainContent sidebarOpen={sidebarOpen}>
        <Header 
          onMenuClick={toggleSidebar}
          user={user}
        />
        <ContentArea>
          {children}
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

export default Layout
