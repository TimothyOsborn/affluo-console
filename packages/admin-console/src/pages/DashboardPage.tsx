import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import CompanySelector from '../components/UI/CompanySelector'
import { createCompanyApi } from '../services/api'

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xl};
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.md};
`

const PageTitle = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl3};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const WelcomeMessage = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StatTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xl3};
  font-weight: 700;
  color: ${props => props.theme.colors.textPrimary};
`

const StatChange = styled.div<{ isPositive: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.isPositive ? props.theme.colors.success : props.theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const RecentActivityCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  transition: background-color ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}05;
  }
`

const ActivityIcon = styled.div<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${props => props.color}20;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`

const ActivityTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const ActivityTime = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
`

const QuickActionsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ActionButton = styled(Button)`
  justify-content: flex-start;
  gap: ${props => props.theme.spacing.md};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`

interface DashboardStats {
  totalForms: number
  activeForms: number
  totalSubmissions: number
  recentSubmissions: number
}

interface ActivityItem {
  id: string
  type: 'form_created' | 'form_updated' | 'submission_received'
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

const DashboardPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>(user?.companyId)
  const [showCompanySelector, setShowCompanySelector] = useState(false)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!selectedCompanyId) return

      try {
        setIsLoading(true)
        const api = createCompanyApi(selectedCompanyId)

        // Fetch dashboard data
        const [formsResponse, submissionsResponse] = await Promise.all([
          api.getForms(),
          api.getSubmissions({ size: 10 })
        ])

        const forms = formsResponse.data
        const submissions = submissionsResponse.data

        // Calculate stats
        const dashboardStats: DashboardStats = {
          totalForms: forms.length,
          activeForms: forms.filter((form: any) => form.status === 'active').length,
          totalSubmissions: submissions.totalElements || 0,
          recentSubmissions: submissions.content?.length || 0,
        }

        setStats(dashboardStats)

        // Generate mock activity data (in real app, this would come from API)
        const mockActivity: ActivityItem[] = [
          {
            id: '1',
            type: 'submission_received',
            title: 'New submission received',
            description: 'Customer feedback form submitted by John Doe',
            timestamp: '2 minutes ago',
            icon: '📝',
            color: theme.colors.success,
          },
          {
            id: '2',
            type: 'form_updated',
            title: 'Form updated',
            description: 'Employee onboarding form was modified',
            timestamp: '1 hour ago',
            icon: '✏️',
            color: theme.colors.warning,
          },
          {
            id: '3',
            type: 'form_created',
            title: 'New form created',
            description: 'Customer satisfaction survey created',
            timestamp: '3 hours ago',
            icon: '➕',
            color: theme.colors.primary,
          },
        ]

        setRecentActivity(mockActivity)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [selectedCompanyId, theme.colors])

  const handleCompanySelect = (companyId: string) => {
    setSelectedCompanyId(companyId)
    setShowCompanySelector(false)
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="large" />
      </LoadingContainer>
    )
  }

  // Show company selector if no company is selected or if user wants to switch
  if (showCompanySelector || !selectedCompanyId) {
    return (
      <DashboardContainer>
        <CompanySelector
          onCompanySelect={handleCompanySelect}
          selectedCompanyId={selectedCompanyId}
        />
      </DashboardContainer>
    )
  }

  return (
    <DashboardContainer>
      <PageHeader>
        <div>
          <PageTitle>Dashboard</PageTitle>
          <WelcomeMessage>
            Welcome back, {user?.username}! Here's what's happening with your forms.
          </WelcomeMessage>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <Button
            variant="outlined"
            onClick={() => setShowCompanySelector(true)}
          >
            Switch Company
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.href = `/companies/${selectedCompanyId}/forms/new`}
          >
            Create New Form
          </Button>
        </div>
      </PageHeader>

      <StatsGrid>
        <StatCard elevation={2}>
          <StatHeader>
            <StatTitle>Total Forms</StatTitle>
            <StatIcon color={theme.colors.primary}>
              📋
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.totalForms || 0}</StatValue>
          <StatChange isPositive={true}>
            <span>↗</span>
            <span>+2 this week</span>
          </StatChange>
        </StatCard>

        <StatCard elevation={2}>
          <StatHeader>
            <StatTitle>Active Forms</StatTitle>
            <StatIcon color={theme.colors.success}>
              ✅
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.activeForms || 0}</StatValue>
          <StatChange isPositive={true}>
            <span>↗</span>
            <span>+1 this week</span>
          </StatChange>
        </StatCard>

        <StatCard elevation={2}>
          <StatHeader>
            <StatTitle>Total Submissions</StatTitle>
            <StatIcon color={theme.colors.secondary}>
              📊
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.totalSubmissions || 0}</StatValue>
          <StatChange isPositive={true}>
            <span>↗</span>
            <span>+15 this week</span>
          </StatChange>
        </StatCard>

        <StatCard elevation={2}>
          <StatHeader>
            <StatTitle>Recent Submissions</StatTitle>
            <StatIcon color={theme.colors.warning}>
              ⏰
            </StatIcon>
          </StatHeader>
          <StatValue>{stats?.recentSubmissions || 0}</StatValue>
          <StatChange isPositive={true}>
            <span>↗</span>
            <span>+3 today</span>
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RecentActivityCard elevation={2}>
          <h2>Recent Activity</h2>
          <ActivityList>
            {recentActivity.map((activity) => (
              <ActivityItem key={activity.id}>
                <ActivityIcon color={activity.color}>
                  {activity.icon}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityTitle>{activity.title}</ActivityTitle>
                  <div style={{ color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm }}>
                    {activity.description}
                  </div>
                  <ActivityTime>{activity.timestamp}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </RecentActivityCard>

        <QuickActionsCard elevation={2}>
          <h2>Quick Actions</h2>
          <ActionButton
            variant="outlined"
            onClick={() => window.location.href = `/companies/${selectedCompanyId}/forms/new`}
          >
            ➕ Create Form
          </ActionButton>
          <ActionButton
            variant="outlined"
            onClick={() => window.location.href = `/companies/${selectedCompanyId}/submissions`}
          >
            📊 View Submissions
          </ActionButton>
          <ActionButton
            variant="outlined"
            onClick={() => window.location.href = `/companies/${selectedCompanyId}/users`}
          >
            👥 Manage Users
          </ActionButton>
        </QuickActionsCard>
      </ContentGrid>
    </DashboardContainer>
  )
}

export default DashboardPage
