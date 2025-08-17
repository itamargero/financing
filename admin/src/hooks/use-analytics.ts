import { useApi } from './use-api'
import { analyticsApi } from '@/lib/api'

export function useDashboardAnalytics() {
  return useApi(analyticsApi.getDashboardStats)
}