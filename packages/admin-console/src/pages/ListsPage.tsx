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

const ListsContainer = styled.div`
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

const ListsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
`

const ListCard = styled(Card)`
  cursor: pointer;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.theme.spacing.md};
`

const ListTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const ListDescription = styled.p`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  margin: ${props => props.theme.spacing.sm} 0;
`

const ListStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`

const Stat = styled.div`
  text-align: center;
`

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
`

const StatLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
`

const ListActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${props => props.theme.spacing.xs};
  border-radius: ${props => props.theme.borderRadius.sm};
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
    color: ${props => props.theme.colors.primary};
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`

interface ListItem {
  id: string
  [key: string]: any
}

interface List {
  id: string
  name: string
  description: string
  fields: {
    name: string
    type: 'text' | 'number' | 'email' | 'select' | 'date'
    required: boolean
    options?: string[]
  }[]
  items: ListItem[]
  createdAt: string
  updatedAt: string
}

const ListsPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId } = useParams<{ companyId: string }>()
  const navigate = useNavigate()
  
  const [lists, setLists] = useState<List[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (companyId) {
      loadLists()
    }
  }, [companyId])

  const loadLists = async () => {
    if (!companyId) return
    
    try {
      setIsLoading(true)
      const api = createCompanyApi(companyId)
      const response = await api.getLists()
      setLists(response.data)
    } catch (error) {
      console.error('Failed to load lists:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateList = () => {
    navigate(`/companies/${companyId}/lists/new`)
  }

  const handleEditList = (listId: string) => {
    navigate(`/companies/${companyId}/lists/${listId}/edit`)
  }

  const handleViewList = (listId: string) => {
    navigate(`/companies/${companyId}/lists/${listId}`)
  }

  const handleDeleteList = async (listId: string) => {
    if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      return
    }

    try {
      const api = createCompanyApi(companyId!)
      await api.deleteList(listId)
      await loadLists()
    } catch (error) {
      console.error('Failed to delete list:', error)
      alert('Failed to delete list. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <ListsContainer>
      <PageHeader>
        <div>
          <PageTitle>Data Lists</PageTitle>
          <p style={{ color: theme.colors.textSecondary, margin: 0 }}>
            Manage your company's data lists for use in forms
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateList}>
          Create New List
        </Button>
      </PageHeader>

      {lists.length === 0 ? (
        <EmptyState>
          <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>📋</div>
          <h3>No lists created yet</h3>
          <p>Create your first data list to use in forms</p>
          <Button variant="primary" onClick={handleCreateList} style={{ marginTop: theme.spacing.md }}>
            Create Your First List
          </Button>
        </EmptyState>
      ) : (
        <ListsGrid>
          {lists.map((list) => (
            <ListCard key={list.id} elevation={2}>
              <ListHeader>
                <div>
                  <ListTitle>{list.name}</ListTitle>
                  <ListDescription>{list.description}</ListDescription>
                </div>
                <ListActions>
                  <ActionButton onClick={() => handleViewList(list.id)} title="View">
                    👁️
                  </ActionButton>
                  <ActionButton onClick={() => handleEditList(list.id)} title="Edit">
                    ✏️
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteList(list.id)} title="Delete">
                    🗑️
                  </ActionButton>
                </ListActions>
              </ListHeader>
              
              <ListStats>
                <Stat>
                  <StatValue>{list.fields.length}</StatValue>
                  <StatLabel>Fields</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{list.items.length}</StatValue>
                  <StatLabel>Items</StatLabel>
                </Stat>
                <Stat>
                  <StatValue>{list.fields.filter(f => f.required).length}</StatValue>
                  <StatLabel>Required</StatLabel>
                </Stat>
              </ListStats>
            </ListCard>
          ))}
        </ListsGrid>
      )}
    </ListsContainer>
  )
}

export default ListsPage
