import type { IMasterDataService } from '../types'
import type { Company, Department, Position, Category } from '@/types'
import { get, post, put, del } from './http-client'

export function createApiMasterDataService(): IMasterDataService {
  return {
    // Companies
    async fetchCompanies() {
      return get<Company[]>('/master-data/companies')
    },
    async createCompany(name, code) {
      await post('/master-data/companies', { name, code })
    },
    async updateCompany(id, updates) {
      await put(`/master-data/companies/${id}`, updates)
    },
    async deleteCompany(id) {
      await del(`/master-data/companies/${id}`)
    },

    // Departments
    async fetchDepartments(companyId?) {
      const query = companyId ? `?company_id=${companyId}` : ''
      return get<Department[]>(`/master-data/departments${query}`)
    },
    async createDepartment(name, companyId) {
      await post('/master-data/departments', { name, company_id: companyId })
    },
    async updateDepartment(id, updates) {
      await put(`/master-data/departments/${id}`, updates)
    },
    async deleteDepartment(id) {
      await del(`/master-data/departments/${id}`)
    },

    // Positions
    async fetchPositions(departmentId?) {
      const query = departmentId ? `?department_id=${departmentId}` : ''
      return get<Position[]>(`/master-data/positions${query}`)
    },
    async createPosition(name, departmentId, level?) {
      await post('/master-data/positions', { name, department_id: departmentId, level })
    },
    async updatePosition(id, updates) {
      await put(`/master-data/positions/${id}`, updates)
    },
    async deletePosition(id) {
      await del(`/master-data/positions/${id}`)
    },

    // Categories
    async fetchCategories() {
      return get<Category[]>('/master-data/categories')
    },
    async createCategory(name, description?, colorCode?) {
      await post('/master-data/categories', { name, description, color_code: colorCode })
    },
    async updateCategory(id, updates) {
      await put(`/master-data/categories/${id}`, updates)
    },
    async deleteCategory(id) {
      await del(`/master-data/categories/${id}`)
    },
  }
}
