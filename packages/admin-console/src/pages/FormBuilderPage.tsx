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

const FormBuilderContainer = styled.div`
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

const FormMetadata = styled(Card)`
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

const BuilderContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${props => props.theme.spacing.xl};
  min-height: 600px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const Toolbox = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`

const ToolboxTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const FieldType = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: grab;
  transition: all ${props => props.theme.transitions.normal};
  user-select: none;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
  
  &:active {
    cursor: grabbing;
  }
  
  &.dragging {
    opacity: 0.5;
  }
`

const FieldTypeName = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs};
`

const FieldTypeDescription = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`

const Canvas = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  min-height: 600px;
`

const CanvasTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
  color: ${props => props.theme.colors.textPrimary};
  margin: 0;
`

const DropZone = styled.div`
  flex: 1;
  border: 2px dashed ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  transition: all ${props => props.theme.transitions.normal};
  padding: ${props => props.theme.spacing.lg};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
  
  &.drag-over {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
  }
`

const PlaceholderText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  width: 100%;
`

const FormField = styled.div`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background-color: ${props => props.theme.colors.background};
  cursor: move;
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &.dragging {
    opacity: 0.5;
  }
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

const FieldPreview = styled.div`
  padding: ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
`

interface FormField {
  id: string
  type: string
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
  dataSource?: {
    type: 'list' | 'manual'
    listId?: string
    listField?: string
  }
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

interface FormMetadata {
  title: string
  description: string
  allowAnonymous: boolean
  requireApproval: boolean
}

const FormBuilderPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId, formId } = useParams<{ companyId: string; formId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = !!formId
  const [isLoading, setIsLoading] = useState(false)
  const [formMetadata, setFormMetadata] = useState<FormMetadata>({
    title: '',
    description: '',
    allowAnonymous: true,
    requireApproval: false
  })
  const [fields, setFields] = useState<FormField[]>([])
  const [draggedField, setDraggedField] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [lists, setLists] = useState<any[]>([])
  const [showDataSourceModal, setShowDataSourceModal] = useState(false)
  const [selectedField, setSelectedField] = useState<FormField | null>(null)

  const fieldTypes = [
    {
      type: 'text',
      name: 'Text Input',
      description: 'Single line text input',
      icon: '📝'
    },
    {
      type: 'textarea',
      name: 'Text Area',
      description: 'Multi-line text input',
      icon: '📄'
    },
    {
      type: 'number',
      name: 'Number Input',
      description: 'Numeric input field',
      icon: '🔢'
    },
    {
      type: 'email',
      name: 'Email Input',
      description: 'Email address input',
      icon: '📧'
    },
    {
      type: 'select',
      name: 'Dropdown',
      description: 'Select from options',
      icon: '📋'
    },
    {
      type: 'checkbox',
      name: 'Checkbox',
      description: 'Multiple choice selection',
      icon: '☑️'
    },
    {
      type: 'radio',
      name: 'Radio Buttons',
      description: 'Single choice selection',
      icon: '🔘'
    },
    {
      type: 'date',
      name: 'Date Picker',
      description: 'Date selection',
      icon: '📅'
    }
  ]

  useEffect(() => {
    if (isEditing && formId) {
      loadForm()
    }
    if (companyId) {
      loadLists()
    }
  }, [formId, isEditing, companyId])

  const loadLists = async () => {
    if (!companyId) return
    
    try {
      const api = createCompanyApi(companyId)
      const response = await api.getLists()
      setLists(response.data)
    } catch (error) {
      console.error('Failed to load lists:', error)
    }
  }

  const loadForm = async () => {
    if (!companyId || !formId) return
    
    try {
      setIsLoading(true)
      const api = createCompanyApi(companyId)
      const response = await api.getForm(formId)
      const form = response.data
      
      setFormMetadata({
        title: form.title || '',
        description: form.description || '',
        allowAnonymous: form.settings?.allowAnonymous ?? true,
        requireApproval: form.settings?.requireApproval ?? false
      })
      
      // Convert form schema to fields
      if (form.schema?.properties) {
        const formFields: FormField[] = Object.entries(form.schema.properties).map(([key, prop]: [string, any]) => ({
          id: key,
          type: prop.type || 'text',
          label: prop.title || key,
          required: form.schema.required?.includes(key) || false,
          placeholder: prop.placeholder,
          options: prop.enum,
          validation: {
            min: prop.minimum,
            max: prop.maximum,
            pattern: prop.pattern
          }
        }))
        setFields(formFields)
      }
    } catch (error) {
      console.error('Failed to load form:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, fieldType: string) => {
    e.dataTransfer.setData('fieldType', fieldType)
    setDraggedField(fieldType)
  }

  const handleDragEnd = () => {
    setDraggedField(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const fieldType = e.dataTransfer.getData('fieldType')
    if (fieldType) {
      addField(fieldType)
    }
  }

  const addField = (type: string) => {
    const fieldType = fieldTypes.find(ft => ft.type === type)
    if (!fieldType) return

    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `${fieldType.name} ${fields.length + 1}`,
      required: false,
      placeholder: `Enter ${fieldType.name.toLowerCase()}...`
    }

    setFields([...fields, newField])
  }

  const removeField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId))
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)
    setFields(newFields)
  }

  const renderFieldPreview = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return <input type={field.type} placeholder={field.placeholder} disabled />
      case 'textarea':
        return <textarea placeholder={field.placeholder} disabled />
      case 'select':
        return (
          <select disabled>
            <option>{field.placeholder || 'Select an option...'}</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'checkbox':
        return <input type="checkbox" disabled />
      case 'radio':
        return <input type="radio" disabled />
      case 'date':
        return <input type="date" disabled />
      default:
        return <input type="text" placeholder={field.placeholder} disabled />
    }
  }

  const handleSave = async () => {
    if (!formMetadata.title.trim()) {
      alert('Please enter a form title')
      return
    }

    if (fields.length === 0) {
      alert('Please add at least one field to your form')
      return
    }

    try {
      setIsLoading(true)
      const api = createCompanyApi(companyId!)

      // Convert fields to JSON schema
      const properties: any = {}
      const required: string[] = []

      fields.forEach(field => {
        properties[field.id] = {
          type: field.type === 'textarea' ? 'string' : field.type,
          title: field.label,
          placeholder: field.placeholder,
          ...(field.options && { enum: field.options }),
          ...(field.validation && field.validation)
        }

        if (field.required) {
          required.push(field.id)
        }
      })

      const formData = {
        title: formMetadata.title,
        description: formMetadata.description,
        schema: {
          type: 'object',
          properties,
          required
        },
        settings: {
          allowAnonymous: formMetadata.allowAnonymous,
          requireApproval: formMetadata.requireApproval
        }
      }

      if (isEditing && formId) {
        await api.updateForm(formId, formData)
      } else {
        await api.createForm(formData)
      }

      navigate(`/companies/${companyId}/forms`)
    } catch (error) {
      console.error('Failed to save form:', error)
      alert('Failed to save form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/companies/${companyId}/forms`)
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: theme.spacing.xl }}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <FormBuilderContainer>
      <PageHeader>
        <PageTitle>
          {isEditing ? 'Edit Form' : 'Create New Form'}
        </PageTitle>
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} loading={isLoading}>
            Save Form
          </Button>
        </div>
      </PageHeader>

      <FormMetadata elevation={2}>
        <h3>Form Details</h3>
        <MetadataGrid>
          <Input
            label="Form Title"
            value={formMetadata.title}
            onChange={(value) => setFormMetadata({ ...formMetadata, title: value })}
            placeholder="Enter form title..."
          />
          <Input
            label="Description"
            value={formMetadata.description}
            onChange={(value) => setFormMetadata({ ...formMetadata, description: value })}
            placeholder="Enter form description..."
          />
        </MetadataGrid>
        <div style={{ marginTop: theme.spacing.md }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <input
              type="checkbox"
              checked={formMetadata.allowAnonymous}
              onChange={(e) => setFormMetadata({ ...formMetadata, allowAnonymous: e.target.checked })}
            />
            Allow anonymous submissions
          </label>
        </div>
      </FormMetadata>

      <BuilderContent>
        <Toolbox elevation={2}>
          <ToolboxTitle>Form Fields</ToolboxTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {fieldTypes.map((fieldType) => (
              <FieldType
                key={fieldType.type}
                draggable
                onDragStart={(e) => handleDragStart(e, fieldType.type)}
                onDragEnd={handleDragEnd}
                className={draggedField === fieldType.type ? 'dragging' : ''}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <span style={{ fontSize: '20px' }}>{fieldType.icon}</span>
                  <div>
                    <FieldTypeName>{fieldType.name}</FieldTypeName>
                    <FieldTypeDescription>{fieldType.description}</FieldTypeDescription>
                  </div>
                </div>
              </FieldType>
            ))}
          </div>
        </Toolbox>

        <Canvas elevation={2}>
          <CanvasTitle>Form Canvas</CanvasTitle>
          <DropZone
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={dragOver ? 'drag-over' : ''}
          >
            {fields.length === 0 ? (
              <PlaceholderText>
                <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>🎨</div>
                <div style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing.sm }}>
                  Drag and drop form fields here
                </div>
                <div style={{ fontSize: theme.typography.fontSize.sm }}>
                  Start building your form by dragging field types from the toolbox
                </div>
              </PlaceholderText>
            ) : (
              <FieldList>
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('fieldIndex', index.toString())
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const fromIndex = parseInt(e.dataTransfer.getData('fieldIndex'))
                      if (fromIndex !== index) {
                        moveField(fromIndex, index)
                      }
                    }}
                  >
                    <FieldHeader>
                      <FieldTitle>
                        <span>{fieldTypes.find(ft => ft.type === field.type)?.icon}</span>
                        <Input
                          value={field.label}
                          onChange={(value) => updateField(field.id, { label: value })}
                          placeholder="Field label..."
                          style={{ width: '200px' }}
                        />
                      </FieldTitle>
                      <FieldActions>
                        <ActionButton onClick={() => updateField(field.id, { required: !field.required })}>
                          {field.required ? '★' : '☆'}
                        </ActionButton>
                        <ActionButton onClick={() => removeField(field.id)}>
                          🗑️
                        </ActionButton>
                      </FieldActions>
                    </FieldHeader>
                    <FieldPreview>
                      {renderFieldPreview(field)}
                      
                      {/* Field Configuration */}
                      <div style={{ marginTop: theme.spacing.md, padding: theme.spacing.sm, backgroundColor: theme.colors.background, borderRadius: theme.borderRadius.sm }}>
                        <div style={{ marginBottom: theme.spacing.sm }}>
                          <strong>Field Configuration:</strong>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                          <Input
                            value={field.placeholder || ''}
                            onChange={(value) => updateField(field.id, { placeholder: value })}
                            placeholder="Placeholder text..."
                            style={{ width: '100%' }}
                          />
                          
                          {field.type === 'select' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                              <div style={{ display: 'flex', gap: theme.spacing.sm }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                                  <input
                                    type="radio"
                                    name={`dataSource-${field.id}`}
                                    checked={!field.dataSource || field.dataSource.type === 'manual'}
                                    onChange={() => updateField(field.id, { 
                                      dataSource: { type: 'manual' },
                                      options: field.options || []
                                    })}
                                  />
                                  Manual Options
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                                  <input
                                    type="radio"
                                    name={`dataSource-${field.id}`}
                                    checked={field.dataSource?.type === 'list'}
                                    onChange={() => updateField(field.id, { 
                                      dataSource: { type: 'list' },
                                      options: []
                                    })}
                                  />
                                  From List
                                </label>
                              </div>
                              
                              {(!field.dataSource || field.dataSource.type === 'manual') && (
                                <Input
                                  value={field.options?.join(', ') || ''}
                                  onChange={(value) => updateField(field.id, { options: value.split(',').map(o => o.trim()).filter(o => o) })}
                                  placeholder="Option 1, Option 2, Option 3..."
                                />
                              )}
                              
                              {field.dataSource?.type === 'list' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
                                  <select
                                    value={field.dataSource.listId || ''}
                                    onChange={(e) => updateField(field.id, { 
                                      dataSource: { 
                                        ...field.dataSource, 
                                        listId: e.target.value,
                                        listField: ''
                                      }
                                    })}
                                    style={{ padding: theme.spacing.sm, borderRadius: theme.borderRadius.sm, border: `1px solid ${theme.colors.border}` }}
                                  >
                                    <option value="">Select a list...</option>
                                    {lists.map(list => (
                                      <option key={list.id} value={list.id}>{list.name}</option>
                                    ))}
                                  </select>
                                  
                                  {field.dataSource.listId && (
                                    <select
                                      value={field.dataSource.listField || ''}
                                      onChange={(e) => updateField(field.id, { 
                                        dataSource: { 
                                          ...field.dataSource, 
                                          listField: e.target.value
                                        }
                                      })}
                                      style={{ padding: theme.spacing.sm, borderRadius: theme.borderRadius.sm, border: `1px solid ${theme.colors.border}` }}
                                    >
                                      <option value="">Select a field...</option>
                                      {lists.find(l => l.id === field.dataSource?.listId)?.fields.map((f: any) => (
                                        <option key={f.name} value={f.name}>{f.name}</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </FieldPreview>
                  </FormField>
                ))}
              </FieldList>
            )}
          </DropZone>
        </Canvas>
      </BuilderContent>
    </FormBuilderContainer>
  )
}

export default FormBuilderPage
