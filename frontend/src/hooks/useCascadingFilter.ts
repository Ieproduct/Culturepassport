import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { Company, Department, Position } from '@/types'

export function useCascadingFilter() {
  const { masterData } = useServices()
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [selectedCompany, setSelectedCompanyState] = useState<string | null>(null)
  const [selectedDepartment, setSelectedDepartmentState] = useState<string | null>(null)
  const [selectedPosition, setSelectedPositionState] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch companies on mount
  useEffect(() => {
    setLoading(true)
    masterData.fetchCompanies()
      .then((data: Company[]) => setCompanies(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed'))
      .finally(() => setLoading(false))
  }, [masterData])

  // Fetch departments when company changes
  useEffect(() => {
    masterData.fetchDepartments(selectedCompany ?? undefined)
      .then((data: Department[]) => setDepartments(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [masterData, selectedCompany])

  // Fetch positions when department changes
  useEffect(() => {
    masterData.fetchPositions(selectedDepartment ?? undefined)
      .then((data: Position[]) => setPositions(data))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed'))
  }, [masterData, selectedDepartment])

  const setSelectedCompany = useCallback((value: string | null) => {
    setSelectedCompanyState(value)
    setSelectedDepartmentState(null)
    setSelectedPositionState(null)
  }, [])

  const setSelectedDepartment = useCallback((value: string | null) => {
    setSelectedDepartmentState(value)
    setSelectedPositionState(null)
  }, [])

  const setSelectedPosition = useCallback((value: string | null) => {
    setSelectedPositionState(value)
  }, [])

  return {
    companies, departments, positions,
    selectedCompany, selectedDepartment, selectedPosition,
    setSelectedCompany, setSelectedDepartment, setSelectedPosition,
    loading, error,
  }
}
