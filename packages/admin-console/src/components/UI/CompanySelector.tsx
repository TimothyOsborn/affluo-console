import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import { apiClient } from '../../services/api'
import Button from './Button'
import Card from './Card'

const CompanySelectorContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const CompanyCard = styled(Card)`
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
  }
`

const CompanyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.md};
`

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
`

const CompanyName = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.textPrimary};
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: 600;
`

const CompanyDomain = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
`

const CompanyPlan = styled.span<{ plan: string }>`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.plan) {
      case 'enterprise': return props.theme.colors.primary + '20'
      case 'professional': return '#6366f1' + '20'
      case 'starter': return '#10b981' + '20'
      default: return props.theme.colors.secondary + '20'
    }
  }};
  color: ${props => {
    switch (props.plan) {
      case 'enterprise': return props.theme.colors.primary
      case 'professional': return '#6366f1'
      case 'starter': return '#10b981'
      default: return props.theme.colors.secondary
    }
  }};
`

const CompanyStats = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
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

interface Company {
  id: string
  name: string
  domain: string
  plan: string
  createdAt: string
  settings: {
    allowAnonymousForms: boolean
    requireApproval: boolean
    maxUsers: number
    maxForms: number
  }
}

interface CompanySelectorProps {
  onCompanySelect: (companyId: string) => void
  selectedCompanyId?: string
}

const CompanySelector: React.FC<CompanySelectorProps> = ({ 
  onCompanySelect, 
  selectedCompanyId 
}) => {
  const { user } = useAuth()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getAllCompanies()
        setCompanies(response.data)
      } catch (err) {
        setError('Failed to load companies')
        console.error('Error fetching companies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <CompanySelectorContainer>
        <h2>Select Company</h2>
        <p>Loading companies...</p>
      </CompanySelectorContainer>
    )
  }

  if (error) {
    return (
      <CompanySelectorContainer>
        <h2>Select Company</h2>
        <p>Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </CompanySelectorContainer>
    )
  }

  return (
    <CompanySelectorContainer>
      <CompanyHeader>
        <h2>Select Company</h2>
        <p>Choose which company you want to manage</p>
      </CompanyHeader>
      
      <CompanyGrid>
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            className={selectedCompanyId === company.id ? 'selected' : ''}
            onClick={() => onCompanySelect(company.id)}
            elevation={selectedCompanyId === company.id ? 3 : 1}
          >
            <CompanyName>{company.name}</CompanyName>
            <CompanyDomain>{company.domain}</CompanyDomain>
            <CompanyPlan plan={company.plan}>{company.plan}</CompanyPlan>
            
            <CompanyStats>
              <Stat>
                <StatValue>{company.settings.maxUsers}</StatValue>
                <StatLabel>Users</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{company.settings.maxForms}</StatValue>
                <StatLabel>Forms</StatLabel>
              </Stat>
              <Stat>
                <StatValue>{company.settings.allowAnonymousForms ? 'Yes' : 'No'}</StatValue>
                <StatLabel>Anonymous</StatLabel>
              </Stat>
            </CompanyStats>
          </CompanyCard>
        ))}
      </CompanyGrid>
    </CompanySelectorContainer>
  )
}

export default CompanySelector
