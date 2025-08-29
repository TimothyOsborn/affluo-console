import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

const UsersContainer = styled.div`
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

const PlaceholderCard = styled(Card)`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`

const PlaceholderIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.lg};
`

const PlaceholderTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl2};
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.md};
`

const PlaceholderText = styled.p`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`

const UsersPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId } = useParams<{ companyId: string }>()

  return (
    <UsersContainer>
      <PageHeader>
        <PageTitle>Users & Teams</PageTitle>
        <Button variant="primary">
          Add User
        </Button>
      </PageHeader>

      <PlaceholderCard elevation={2}>
        <PlaceholderIcon>👥</PlaceholderIcon>
        <PlaceholderTitle>Users & Teams Management</PlaceholderTitle>
        <PlaceholderText>
          This page will allow you to manage users, teams, and role-based access control for your organization.
        </PlaceholderText>
        <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center' }}>
          <Button variant="outlined">
            Manage Users
          </Button>
          <Button variant="outlined">
            Manage Teams
          </Button>
        </div>
      </PlaceholderCard>
    </UsersContainer>
  )
}

export default UsersPage
