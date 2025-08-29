import React from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

const SubmissionViewContainer = styled.div`
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

const SubmissionViewPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId, submissionId } = useParams<{ companyId: string; submissionId: string }>()
  const navigate = useNavigate()

  const handleBackToSubmissions = () => {
    navigate(`/companies/${companyId}/submissions`)
  }

  return (
    <SubmissionViewContainer>
      <PageHeader>
        <PageTitle>Submission Details</PageTitle>
        <Button variant="outlined" onClick={handleBackToSubmissions}>
          Back to Submissions
        </Button>
      </PageHeader>

      <PlaceholderCard elevation={2}>
        <PlaceholderIcon>📝</PlaceholderIcon>
        <PlaceholderTitle>Submission View Page</PlaceholderTitle>
        <PlaceholderText>
          This page will display the detailed view of a specific form submission with all the submitted data.
        </PlaceholderText>
        <Button variant="outlined" onClick={handleBackToSubmissions}>
          Back to Submissions
        </Button>
      </PlaceholderCard>
    </SubmissionViewContainer>
  )
}

export default SubmissionViewPage
