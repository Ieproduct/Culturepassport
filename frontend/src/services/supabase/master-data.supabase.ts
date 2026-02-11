import { supabase } from '@/lib/supabase'
import type { IMasterDataService } from '../types'
import type { Company, Department, Position, Category } from '@/types'

export function createSupabaseMasterDataService(): IMasterDataService {
  return {
    // ── Companies ──
    async fetchCompanies() {
      const { data, error } = await supabase.from('companies').select('*').order('name')
      if (error) throw error
      return (data ?? []) as Company[]
    },
    async createCompany(name, code) {
      const { error } = await supabase.from('companies').insert({ name, code })
      if (error) throw error
    },
    async updateCompany(id, updates) {
      const { error } = await supabase.from('companies').update(updates).eq('id', id)
      if (error) throw error
    },
    async deleteCompany(id) {
      const { error } = await supabase.from('companies').delete().eq('id', id)
      if (error) {
        if (error.code === '23503') throw new Error('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
        throw error
      }
    },

    // ── Departments ──
    async fetchDepartments(companyId?) {
      let query = supabase.from('departments').select('*').order('name')
      if (companyId) query = query.eq('company_id', companyId)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Department[]
    },
    async createDepartment(name, companyId) {
      const { error } = await supabase.from('departments').insert({ name, company_id: companyId })
      if (error) throw error
    },
    async updateDepartment(id, updates) {
      const { error } = await supabase.from('departments').update(updates).eq('id', id)
      if (error) throw error
    },
    async deleteDepartment(id) {
      const { error } = await supabase.from('departments').delete().eq('id', id)
      if (error) {
        if (error.code === '23503') throw new Error('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
        throw error
      }
    },

    // ── Positions ──
    async fetchPositions(departmentId?) {
      let query = supabase.from('positions').select('*').order('name')
      if (departmentId) query = query.eq('department_id', departmentId)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Position[]
    },
    async createPosition(name, departmentId, level?) {
      const { error } = await supabase.from('positions').insert({ name, department_id: departmentId, level: level ?? null })
      if (error) throw error
    },
    async updatePosition(id, updates) {
      const { error } = await supabase.from('positions').update(updates).eq('id', id)
      if (error) throw error
    },
    async deletePosition(id) {
      const { error } = await supabase.from('positions').delete().eq('id', id)
      if (error) {
        if (error.code === '23503') throw new Error('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
        throw error
      }
    },

    // ── Categories ──
    async fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*').order('name')
      if (error) throw error
      return (data ?? []) as Category[]
    },
    async createCategory(name, description?, colorCode?) {
      const { error } = await supabase.from('categories').insert({
        name,
        description: description ?? null,
        color_code: colorCode ?? null,
      })
      if (error) throw error
    },
    async updateCategory(id, updates) {
      const { error } = await supabase.from('categories').update(updates).eq('id', id)
      if (error) throw error
    },
    async deleteCategory(id) {
      const { error } = await supabase.from('categories').delete().eq('id', id)
      if (error) {
        if (error.code === '23503') throw new Error('ไม่สามารถลบได้ เนื่องจากมีข้อมูลที่ผูกอยู่')
        throw error
      }
    },
  }
}
