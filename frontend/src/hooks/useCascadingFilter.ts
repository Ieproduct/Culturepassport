import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Company, Department, Position } from '@/types'

export function useCascadingFilter() {
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
    supabase.from('companies').select('*').order('name').then(({ data, error: e }) => {
      if (e) setError(e.message)
      setCompanies(data ?? [])
      setLoading(false)
    })
  }, [])

  // Fetch departments when company changes
  useEffect(() => {
    let query = supabase.from('departments').select('*').order('name')
    if (selectedCompany) query = query.eq('company_id', selectedCompany)
    query.then(({ data, error: e }) => {
      if (e) setError(e.message)
      setDepartments(data ?? [])
    })
  }, [selectedCompany])

  // Fetch positions when department changes
  useEffect(() => {
    let query = supabase.from('positions').select('*').order('name')
    if (selectedDepartment) query = query.eq('department_id', selectedDepartment)
    query.then(({ data, error: e }) => {
      if (e) setError(e.message)
      setPositions(data ?? [])
    })
  }, [selectedDepartment])

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
