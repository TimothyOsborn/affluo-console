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

const ListBuilderContainer = styled.div`
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

const BuilderContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ListMetadata = styled(Card)`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FieldsSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const FieldItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
`

const FieldHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const FieldTitle = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`

const FieldActions = styled.div`
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

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: ${props => props.theme.spacing.sm};
  align-items: end;
`

const ItemsSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ItemsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) auto;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.primary}10;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) auto;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.sm};
  align-items: center;
`

const AddItemForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) auto;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  align-items: end;
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
`

interface ListField {
  name: string
  type: 'text' | 'number' | 'email' | 'select' | 'date'
  required: boolean
  options?: string[]
}

interface ListItem {
  id: string
  [key: string]: any
}

interface ListMetadata {
  name: string
  description: string
}

const fieldTypes = [
  { type: 'text', name: 'Text', icon: '📝' },
  { type: 'number', name: 'Number', icon: '🔢' },
  { type: 'email', name: 'Email', icon: '📧' },
  { type: 'select', name: 'Dropdown', icon: '📋' },
  { type: 'date', name: 'Date', icon: '📅' }
]

const ListBuilderPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId, listId } = useParams<{ companyId: string; listId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = !!listId
  const [isLoading, setIsLoading] = useState(false)
  const [listMetadata, setListMetadata] = useState<ListMetadata>({
    name: '',
    description: ''
  })
  const [fields, setFields] = useState<ListField[]>([])
  const [items, setItems] = useState<ListItem[]>([])
  const [newItem, setNewItem] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (isEditing && listId) {
      loadList()
    }
  }, [listId, isEditing])

  const loadList = async () => {
    if (!companyId || !listId) return
    
    try {
      setIsLoading(true)
      const api = createCompanyApi(companyId)
      const response = await api.getList(listId)
      const list = response.data
      
      setListMetadata({
        name: list.name,
        description: list.description
      })
      setFields(list.fields)
      setItems(list.items)
    } catch (error) {
      console.error('Failed to load list:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addField = () => {
    const newField: ListField = {
      name: `Field ${fields.length + 1}`,
      type: 'text',
      required: false
    }
    setFields([...fields, newField])
  }

  const updateField = (index: number, updates: Partial<ListField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    const fieldName = fields[index].name
    setFields(fields.filter((_, i) => i !== index))
    
    // Remove field from all items
    setItems(items.map(item => {
      const newItem = { ...item }
      delete newItem[fieldName]
      return newItem
    }))
    
    // Remove from new item
    const newNewItem = { ...newItem }
    delete newNewItem[fieldName]
    setNewItem(newNewItem)
  }

  const addItem = () => {
    if (fields.length === 0) {
      alert('Please add at least one field before adding items')
      return
    }

    const requiredFields = fields.filter(f => f.required)
    const missingFields = requiredFields.filter(f => !newItem[f.name] || newItem[f.name].trim() === '')
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`)
      return
    }

    const item: ListItem = {
      id: `item_${Date.now()}`,
      ...newItem
    }

    setItems([...items, item])
    setNewItem({})
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const handleSave = async () => {
    if (!listMetadata.name.trim()) {
      alert('Please enter a list name')
      return
    }

    if (fields.length === 0) {
      alert('Please add at least one field to your list')
      return
    }

    try {
      setIsLoading(true)
      const api = createCompanyApi(companyId!)

      const listData = {
        name: listMetadata.name,
        description: listMetadata.description,
        fields,
        items
      }

      if (isEditing && listId) {
        await api.updateList(listId, listData)
      } else {
        await api.createList(listData)
      }

      navigate(`/companies/${companyId}/lists`)
    } catch (error) {
      console.error('Failed to save list:', error)
      alert('Failed to save list. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/companies/${companyId}/lists`)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <ListBuilderContainer>
      <PageHeader>
        <PageTitle>
          {isEditing ? 'Edit List' : 'Create New List'}
        </PageTitle>
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isLoading}>
            Save List
          </Button>
        </div>
      </PageHeader>

      <ListMetadata elevation={2}>
        <h3>List Details</h3>
        <MetadataGrid>
          <Input
            label="List Name"
            value={listMetadata.name}
            onChange={(value) => setListMetadata({ ...listMetadata, name: value })}
            placeholder="Enter list name..."
          />
          <Input
            label="Description"
            value={listMetadata.description}
            onChange={(value) => setListMetadata({ ...listMetadata, description: value })}
            placeholder="Enter list description..."
          />
        </MetadataGrid>
      </ListMetadata>

      <BuilderContent>
        <FieldsSection elevation={2}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>List Fields</h3>
            <Button variant="outlined" onClick={addField}>
              Add Field
            </Button>
          </div>
          
          {fields.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>📋</div>
              <p>No fields defined yet</p>
              <p>Add fields to define the structure of your list</p>
            </EmptyState>
          ) : (
            <FieldList>
              {fields.map((field, index) => (
                <FieldItem key={index}>
                  <FieldHeader>
                    <FieldTitle>
                      <span>{fieldTypes.find(ft => ft.type === field.type)?.icon}</span>
                      <Input
                        value={field.name}
                        onChange={(value) => updateField(index, { name: value })}
                        placeholder="Field name..."
                        style={{ width: '150px' }}
                      />
                    </FieldTitle>
                    <FieldActions>
                      <ActionButton onClick={() => updateField(index, { required: !field.required })}>
                        {field.required ? '★' : '☆'}
                      </ActionButton>
                      <ActionButton onClick={() => removeField(index)}>
                        🗑️
                      </ActionButton>
                    </FieldActions>
                  </FieldHeader>
                  
                  <FieldGrid>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(index, { type: e.target.value as any })}
                      style={{ padding: theme.spacing.sm, borderRadius: theme.borderRadius.sm, border: `1px solid ${theme.colors.border}` }}
                    >
                      {fieldTypes.map(ft => (
                        <option key={ft.type} value={ft.type}>{ft.name}</option>
                      ))}
                    </select>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, { required: e.target.checked })}
                      />
                      Required
                    </label>
                    
                    {field.type === 'select' && (
                      <Input
                        value={field.options?.join(', ') || ''}
                        onChange={(value) => updateField(index, { options: value.split(',').map(o => o.trim()).filter(o => o) })}
                        placeholder="Option 1, Option 2, Option 3..."
                      />
                    )}
                  </FieldGrid>
                </FieldItem>
              ))}
            </FieldList>
          )}
        </FieldsSection>

        <ItemsSection elevation={2}>
          <h3>List Items</h3>
          
          {fields.length === 0 ? (
            <EmptyState>
              <div style={{ fontSize: '32px', marginBottom: theme.spacing.sm }}>📝</div>
              <p>Add fields first to start adding items</p>
            </EmptyState>
          ) : (
            <>
              <AddItemForm>
                {fields.map((field) => (
                  <Input
                    key={field.name}
                    label={field.name}
                    value={newItem[field.name] || ''}
                    onChange={(value) => setNewItem({ ...newItem, [field.name]: value })}
                    placeholder={`Enter ${field.name.toLowerCase()}...`}
                    required={field.required}
                  />
                ))}
                <Button variant="primary" onClick={addItem}>
                  Add Item
                </Button>
              </AddItemForm>

              {items.length === 0 ? (
                <EmptyState>
                  <p>No items added yet</p>
                  <p>Add items to populate your list</p>
                </EmptyState>
              ) : (
                <ItemsTable>
                  <TableHeader>
                    {fields.map(field => (
                      <div key={field.name}>{field.name}</div>
                    ))}
                    <div>Actions</div>
                  </TableHeader>
                  
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      {fields.map(field => (
                        <div key={field.name}>{item[field.name] || '-'}</div>
                      ))}
                      <ActionButton onClick={() => removeItem(item.id)}>
                        🗑️
                      </ActionButton>
                    </TableRow>
                  ))}
                </ItemsTable>
              )}
            </>
          )}
        </ItemsSection>
      </BuilderContent>
    </ListBuilderContainer>
  )
}

export default ListBuilderPage
