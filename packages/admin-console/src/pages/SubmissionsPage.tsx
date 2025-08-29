import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'

const SubmissionsContainer = styled.div`
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

const SubmissionsPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId } = useParams<{ companyId: string }>()

  return (
    <SubmissionsContainer>
      <PageHeader>
        <PageTitle>Submissions</PageTitle>
      </PageHeader>

      <PlaceholderCard elevation={2}>
        <PlaceholderIcon>📊</PlaceholderIcon>
        <PlaceholderTitle>Submissions Page</PlaceholderTitle>
        <PlaceholderText>
          This page will display all form submissions with filtering, search, and export capabilities.
        </PlaceholderText>
      </PlaceholderCard>
    </SubmissionsContainer>
  )
}

export default SubmissionsPage
