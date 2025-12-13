import { defineStore } from 'pinia'
import { appStoreState } from './types'

const useAppStore = defineStore('app', {
  state: (): appStoreState => ({
    isOnline: false,
    dashboardData: {
      data: null,
      isEmpty: true,
    },
  }),

  getters: {
    isDashboardEmpty: (state) => state.dashboardData.isEmpty,

    getDashboardData: (state) => state.dashboardData.data ?? null,

    getOnlineStatus: (state) => state.isOnline,
  },

  actions: {
    updateOnlineStatus(status: boolean) {
      this.isOnline = status
    },

    updateDashboardData(data: IDashboard | null) {
      this.dashboardData.data = data
      this.dashboardData.isEmpty = data === null
    },
  },
})

export default useAppStore
