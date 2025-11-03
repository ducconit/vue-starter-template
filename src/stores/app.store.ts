import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    isAppLoading: false,
  }),
  actions: {
    setAppLoading(status: boolean) {
      this.isAppLoading = status
    },
  },
})
