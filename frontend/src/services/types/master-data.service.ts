import type { Company, Department, Position, Category } from '@/types'

export interface IMasterDataService {
  fetchCompanies(): Promise<Company[]>
  createCompany(name: string, code: string): Promise<void>
  updateCompany(id: string, updates: Partial<Company>): Promise<void>
  deleteCompany(id: string): Promise<void>

  fetchDepartments(companyId?: string): Promise<Department[]>
  createDepartment(name: string, companyId: string): Promise<void>
  updateDepartment(id: string, updates: Partial<Department>): Promise<void>
  deleteDepartment(id: string): Promise<void>

  fetchPositions(departmentId?: string): Promise<Position[]>
  createPosition(name: string, departmentId: string, level?: number): Promise<void>
  updatePosition(id: string, updates: Partial<Position>): Promise<void>
  deletePosition(id: string): Promise<void>

  fetchCategories(): Promise<Category[]>
  createCategory(name: string, description?: string, colorCode?: string): Promise<void>
  updateCategory(id: string, updates: Partial<Category>): Promise<void>
  deleteCategory(id: string): Promise<void>
}
