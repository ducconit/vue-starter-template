import { defineStore } from 'pinia'

export const useOtpStore = defineStore('otp', {
  state: () => ({
    registrationEmail: '' as string,
  }),
  actions: {
    setRegistrationEmail(email: string) {
      this.registrationEmail = email
    },
    clearRegistrationEmail() {
      this.registrationEmail = ''
    },
  },
  persist: {
    storage: sessionStorage,
    pick: ['registrationEmail'],
  },
})
