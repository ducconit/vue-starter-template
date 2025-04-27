import { defineStore } from 'pinia'
import { toValue, type Ref } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as object | null,
    token: null as string | null,
    isLoggedIn: false,
  }),
  getters: {
    accessToken: (state) => state.token,
  },
  actions: {
    setUserLoggedIn(token: string | Ref<string>, user: object | Ref<object>) {
      this.$patch({
        user: toValue(user),
        token: toValue(token),
        isLoggedIn: true,
      })
    },

    logout() {
      this.$patch({
        user: null,
        token: null,
        isLoggedIn: false,
      })
    },
  },
})
