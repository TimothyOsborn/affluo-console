import React from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

const FormViewContainer = styled.div`
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

const FormViewPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId, formId } = useParams<{ companyId: string; formId: string }>()
  const navigate = useNavigate()

  const handleEditForm = () => {
    navigate(`/companies/${companyId}/forms/${formId}/edit`)
  }

  const handleViewSubmissions = () => {
    navigate(`/companies/${companyId}/submissions?formId=${formId}`)
  }

  return (
    <FormViewContainer>
      <PageHeader>
        <PageTitle>Form Details</PageTitle>
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <Button variant="outlined" onClick={handleViewSubmissions}>
            View Submissions
          </Button>
          <Button variant="primary" onClick={handleEditForm}>
            Edit Form
          </Button>
        </div>
      </PageHeader>

      <PlaceholderCard elevation={2}>
        <PlaceholderIcon>📋</PlaceholderIcon>
        <PlaceholderTitle>Form View Page</PlaceholderTitle>
        <PlaceholderText>
          This page will display the form details, preview, and submission statistics.
        </PlaceholderText>
        <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={handleEditForm}>
            Edit Form
          </Button>
          <Button variant="outlined" onClick={handleViewSubmissions}>
            View Submissions
          </Button>
        </div>
      </PlaceholderCard>
    </FormViewContainer>
  )
}

export default FormViewPage
