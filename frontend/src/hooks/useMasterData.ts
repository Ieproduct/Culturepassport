import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Company, Department, Position, Category } from '@/types'

export function useMasterData() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCompanies = useCallback(async () => {
    const { data, error: e } = await supabase.from('companies').select('*').order('name')
    if (e) { setError(e.message); return }
    setCompanies(data ?? [])
  }, [])

  const fetchDepartments = useCallback(async (companyId?: string) => {
    let query = supabase.from('departments').select('*').order('name')
    if (companyId) query = query.eq('company_id', companyId)
    const { data, error: e } = await query
    if (e) { setError(e.message); return }
    setDepartments(data ?? [])
  }, [])

  const fetchPositions = useCallback(async (departmentId?: string) => {
    let query = supabase.from('positions').select('*').order('name')
    if (departmentId) query = query.eq('department_id', departmentId)
    const { data, error: e } = await query
    if (e) { setError(e.message); return }
    setPositions(data ?? [])
  }, [])

  const fetchCategories = useCallback(async () => {
    const { data, error: e } = await supabase.from('categories').select('*').order('name')
    if (e) { setError(e.message); return }
    setCategories(data ?? [])
  }, [])

  const createCompany = useCallback(async (name: string, code: string) => {
    setError(null)
    const { error: e } = await supabase.from('companies').insert({ name, code })
    if (e) { setError(e.message); throw e }
    await fetchCompanies()
  }, [fetchCompanies])

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    setError(null)
    const { error: e } = await supabase.from('companies').update(updates).eq('id', id)
    if (e) { setError(e.message); throw e }
    await fetchCompanies()
  }, [fetchCompanies])

  const deleteCompany = useCallback(async (id: string) => {
    setError(null)
    const { error: e } = await supabase.from('companies').delete().eq('id', id)
    if (e) {
      if (e.code === '23503') setError('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
      else setError(e.message)
      throw e
    }
    await fetchCompanies()
  }, [fetchCompanies])

  const createDepartment = useCallback(async (name: string, companyId: string) => {
    setError(null)
    const { error: e } = await supabase.from('departments').insert({ name, company_id: companyId })
    if (e) { setError(e.message); throw e }
    await fetchDepartments()
  }, [fetchDepartments])

  const updateDepartment = useCallback(async (id: string, updates: Partial<Department>) => {
    setError(null)
    const { error: e } = await supabase.from('departments').update(updates).eq('id', id)
    if (e) { setError(e.message); throw e }
    await fetchDepartments()
  }, [fetchDepartments])

  const deleteDepartment = useCallback(async (id: string) => {
    setError(null)
    const { error: e } = await supabase.from('departments').delete().eq('id', id)
    if (e) {
      if (e.code === '23503') setError('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
      else setError(e.message)
      throw e
    }
    await fetchDepartments()
  }, [fetchDepartments])

  const createPosition = useCallback(async (name: string, departmentId: string, level?: number) => {
    setError(null)
    const { error: e } = await supabase.from('positions').insert({ name, department_id: departmentId, level: level ?? null })
    if (e) { setError(e.message); throw e }
    await fetchPositions()
  }, [fetchPositions])

  const updatePosition = useCallback(async (id: string, updates: Partial<Position>) => {
    setError(null)
    const { error: e } = await supabase.from('positions').update(updates).eq('id', id)
    if (e) { setError(e.message); throw e }
    await fetchPositions()
  }, [fetchPositions])

  const deletePosition = useCallback(async (id: string) => {
    setError(null)
    const { error: e } = await supabase.from('positions').delete().eq('id', id)
    if (e) {
      if (e.code === '23503') setError('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
      else setError(e.message)
      throw e
    }
    await fetchPositions()
  }, [fetchPositions])

  const createCategory = useCallback(async (name: string, description?: string, colorCode?: string) => {
    setError(null)
    const { error: e } = await supabase.from('categories').insert({ name, description: description ?? null, color_code: colorCode ?? null })
    if (e) { setError(e.message); throw e }
    await fetchCategories()
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setError(null)
    const { error: e } = await supabase.from('categories').update(updates).eq('id', id)
    if (e) { setError(e.message); throw e }
    await fetchCategories()
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: string) => {
    setError(null)
    const { error: e } = await supabase.from('categories').delete().eq('id', id)
    if (e) {
      if (e.code === '23503') setError('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
      else setError(e.message)
      throw e
    }
    await fetchCategories()
  }, [fetchCategories])

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
