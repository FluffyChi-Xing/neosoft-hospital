import type { IDashboard } from '@/types/common'

export type appStoreState = {
  isOnline: boolean
  dashboardData: {
    data: IDashboard | null
    isEmpty: boolean
  }
}
