import React from 'react'
import styled from 'styled-components'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'

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
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
  
  &:active {
    cursor: grabbing;
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
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
`

const PlaceholderText = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`

const FormBuilderPage: React.FC = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const { companyId, formId } = useParams<{ companyId: string; formId?: string }>()
  const navigate = useNavigate()
  
  const isEditing = !!formId

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

  const handleSave = () => {
    // TODO: Implement form saving
    alert('Form builder functionality will be implemented with drag-and-drop')
  }

  const handleCancel = () => {
    navigate(`/companies/${companyId}/forms`)
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
          <Button variant="primary" onClick={handleSave}>
            Save Form
          </Button>
        </div>
      </PageHeader>

      <BuilderContent>
        <Toolbox elevation={2}>
          <ToolboxTitle>Form Fields</ToolboxTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}>
            {fieldTypes.map((fieldType) => (
              <FieldType key={fieldType.type}>
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
          <DropZone>
            <PlaceholderText>
              <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>🎨</div>
              <div style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing.sm }}>
                Drag and drop form fields here
              </div>
              <div style={{ fontSize: theme.typography.fontSize.sm }}>
                Start building your form by dragging field types from the toolbox
              </div>
            </PlaceholderText>
          </DropZone>
        </Canvas>
      </BuilderContent>
    </FormBuilderContainer>
  )
}

export default FormBuilderPage
