import { defineStore } from 'pinia'
import type { userStoreState, userStoreType } from './types'

const useUserStore = defineStore('user', {
  state: (): userStoreState => ({
    user: null,
  }),

  getters: {
    getUserInfo: (state) => state.user,

    getRole: (state) => state.user?.role ?? '',

    getToken: (state) => state.user?.token ?? '',

    getBaseInfo: (state) => {
      return {
        id: state.user?.id ?? '',
        username: state.user?.username ?? '',
        password: state.user?.password ?? '',
        token: state.user?.token ?? '',
      }
    },
  },

  actions: {
    updateUser(user: userStoreType) {
      // this.user = {
      //   ...user,
      //   token: this.user.token ?? '', // 防止token丢失
      // }
      this.user = user
    },

    clearUser() {
      this.user = null
    },
  },
})

export default useUserStore
