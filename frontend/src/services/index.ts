import { useContext } from 'react'
import { ServiceContext } from './ServiceProvider'
import type { Services } from './types'

export function useServices(): Services {
  const ctx = useContext(ServiceContext)
  if (!ctx) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  return ctx
}

export { ServiceProvider } from './ServiceProvider'
export type { Services } from './types'
