import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { Company, Department, Position, Category } from '@/types'

export function useMasterData() {
  const { masterData } = useServices()
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    try {
      const data = await masterData.fetchCompanies()
      setCompanies(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch companies')
    }
  }, [masterData])

  const fetchDepartments = useCallback(async (companyId?: string) => {
    try {
      const data = await masterData.fetchDepartments(companyId)
      setDepartments(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch departments')
    }
  }, [masterData])

  const fetchPositions = useCallback(async (departmentId?: string) => {
    try {
      const data = await masterData.fetchPositions(departmentId)
      setPositions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch positions')
    }
  }, [masterData])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await masterData.fetchCategories()
      setCategories(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch categories')
    }
  }, [masterData])

  const createCompany = useCallback(async (name: string, code: string) => {
    setError(null)
    await masterData.createCompany(name, code)
    await fetchCompanies()
  }, [masterData, fetchCompanies])

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    setError(null)
    await masterData.updateCompany(id, updates)
    await fetchCompanies()
  }, [masterData, fetchCompanies])

  const deleteCompany = useCallback(async (id: string) => {
    setError(null)
    try {
      await masterData.deleteCompany(id)
      await fetchCompanies()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete company')
      throw e
    }
  }, [masterData, fetchCompanies])

  const createDepartment = useCallback(async (name: string, companyId: string) => {
    setError(null)
    await masterData.createDepartment(name, companyId)
    await fetchDepartments()
  }, [masterData, fetchDepartments])

  const updateDepartment = useCallback(async (id: string, updates: Partial<Department>) => {
    setError(null)
    await masterData.updateDepartment(id, updates)
    await fetchDepartments()
  }, [masterData, fetchDepartments])

  const deleteDepartment = useCallback(async (id: string) => {
    setError(null)
    try {
      await masterData.deleteDepartment(id)
      await fetchDepartments()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete department')
      throw e
    }
  }, [masterData, fetchDepartments])

  const createPosition = useCallback(async (name: string, departmentId: string, level?: number) => {
    setError(null)
    await masterData.createPosition(name, departmentId, level)
    await fetchPositions()
  }, [masterData, fetchPositions])

  const updatePosition = useCallback(async (id: string, updates: Partial<Position>) => {
    setError(null)
    await masterData.updatePosition(id, updates)
    await fetchPositions()
  }, [masterData, fetchPositions])

  const deletePosition = useCallback(async (id: string) => {
    setError(null)
    try {
      await masterData.deletePosition(id)
      await fetchPositions()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete position')
      throw e
    }
  }, [masterData, fetchPositions])

  const createCategory = useCallback(async (name: string, description?: string, colorCode?: string) => {
    setError(null)
    await masterData.createCategory(name, description, colorCode)
    await fetchCategories()
  }, [masterData, fetchCategories])

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setError(null)
    await masterData.updateCategory(id, updates)
    await fetchCategories()
  }, [masterData, fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    setError(null)
    try {
      await masterData.deleteCategory(id)
      await fetchCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete category')
      throw e
    }
  }, [masterData, fetchCategories])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchCompanies(), fetchDepartments(), fetchPositions(), fetchCategories()])
      .finally(() => setLoading(false))
  }, [fetchCompanies, fetchDepartments, fetchPositions, fetchCategories])

  return {
    companies, departments, positions, categories, loading, error,
    fetchCompanies, createCompany, updateCompany, deleteCompany,
    fetchDepartments, createDepartment, updateDepartment, deleteDepartment,
    fetchPositions, createPosition, updatePosition, deletePosition,
    fetchCategories, createCategory, updateCategory, deleteCategory,
  }
}
