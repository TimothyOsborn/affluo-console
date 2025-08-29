import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Input from '../components/UI/Input'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import { createCompanyApi } from '../services/api'

const FormsContainer = styled.div`
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

const SearchContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`

const FormsTable = styled(Card)`
  overflow: hidden;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.background};
`

const TableRow = styled.tr`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}05;
  }
`

const TableHeaderCell = styled.th`
  padding: ${props => props.theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const TableCell = styled.td`
  padding: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textPrimary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`

const StatusBadge = styled.span<{ status: string }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background-color: ${props.theme.colors.success}20;
          color: ${props.theme.colors.success};
        `
      case 'draft':
        return `
          background-color: ${props.theme.colors.warning}20;
          color: ${props.theme.colors.warning};
        `
      case 'archived':
        return `
          background-color: ${props.theme.colors.textDisabled}20;
          color: ${props.theme.colors.textDisabled};
        `
      default:
        return `
          background-color: ${props.theme.colors.background};
          color: ${props.theme.colors.textSecondary};
        `
    }
  }}
`

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`

const ActionButton = styled(Button)`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${props => props.theme.spacing.md};
`

const EmptyStateTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  margin-bottom: ${props => props.theme.spacing.sm};
  color: ${props => props.theme.colors.textPrimary};
`

const EmptyStateText = styled.p`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.xl};
`

interface Form {
  id: string
  name: string
  description: string
  status: 'active' | 'draft' | 'archived'
  createdAt: string
  updatedAt: string
  submissionsCount: number
}

const FormsPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  
  const [forms, setForms] = useState<Form[]>([])
  const [filteredForms, setFilteredForms] = useState<Form[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const loadForms = async () => {
      if (!companyId) return

      try {
        setIsLoading(true)
        const api = createCompanyApi(companyId)
        const response = await api.getForms()
        
        // Transform the data to match our interface
        const formsData: Form[] = response.data.map((form: any) => ({
          id: form.id,
          name: form.name || form.title || 'Untitled Form',
          description: form.description || 'No description',
          status: form.status || 'draft',
          createdAt: form.createdAt || new Date().toISOString(),
          updatedAt: form.updatedAt || new Date().toISOString(),
          submissionsCount: form.submissionsCount || 0,
        }))

        setForms(formsData)
        setFilteredForms(formsData)
      } catch (error) {
        console.error('Failed to load forms:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadForms()
  }, [companyId])

  useEffect(() => {
    // Filter forms based on search term and status
    let filtered = forms

    if (searchTerm) {
      filtered = filtered.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(form => form.status === statusFilter)
    }

    setFilteredForms(filtered)
  }, [forms, searchTerm, statusFilter])

  const handleCreateForm = () => {
    navigate(`/companies/${companyId}/forms/new`)
  }

  const handleViewForm = (formId: string) => {
    navigate(`/companies/${companyId}/forms/${formId}`)
  }

  const handleEditForm = (formId: string) => {
    navigate(`/companies/${companyId}/forms/${formId}/edit`)
  }

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      return
    }

    try {
      const api = createCompanyApi(companyId!)
      await api.deleteForm(formId)
      setForms(forms.filter(form => form.id !== formId))
    } catch (error) {
      console.error('Failed to delete form:', error)
      alert('Failed to delete form. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <LoadingContainer>
        <LoadingSpinner size="large" />
      </LoadingContainer>
    )
  }

  return (
    <FormsContainer>
      <PageHeader>
        <PageTitle>Forms</PageTitle>
        <Button variant="primary" onClick={handleCreateForm}>
          Create New Form
        </Button>
      </PageHeader>

      <SearchContainer>
        <Input
          placeholder="Search forms..."
          value={searchTerm}
          onChange={setSearchTerm}
          size="medium"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: theme.spacing.sm,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
            color: theme.colors.textPrimary,
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </SearchContainer>

      <FormsTable elevation={2}>
        {filteredForms.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Submissions</TableHeaderCell>
                <TableHeaderCell>Last Updated</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <strong>{form.name}</strong>
                  </TableCell>
                  <TableCell>{form.description}</TableCell>
                  <TableCell>
                    <StatusBadge status={form.status}>
                      {form.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{form.submissionsCount}</TableCell>
                  <TableCell>{formatDate(form.updatedAt)}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton
                        variant="text"
                        size="small"
                        onClick={() => handleViewForm(form.id)}
                      >
                        View
                      </ActionButton>
                      <ActionButton
                        variant="text"
                        size="small"
                        onClick={() => handleEditForm(form.id)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="text"
                        size="small"
                        onClick={() => handleDeleteForm(form.id)}
                      >
                        Delete
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState>
            <EmptyStateIcon>📋</EmptyStateIcon>
            <EmptyStateTitle>No forms found</EmptyStateTitle>
            <EmptyStateText>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first form.'}
            </EmptyStateText>
            {!searchTerm && statusFilter === 'all' && (
              <Button variant="primary" onClick={handleCreateForm}>
                Create Your First Form
              </Button>
            )}
          </EmptyState>
        )}
      </FormsTable>
    </FormsContainer>
  )
}

export default FormsPage
