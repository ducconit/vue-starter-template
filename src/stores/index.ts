import { acceptHMRUpdate, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { useAuthStore } from './auth.store'
import { useAppStore } from './app.store'
import { useOtpStore } from './otp.store'

const store = createPinia()

store.use(piniaPluginPersistedstate)

// make sure to pass the right store definition.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
  import.meta.hot.accept(acceptHMRUpdate(useOtpStore, import.meta.hot))
}

export default store
export { useAuthStore, useAppStore, useOtpStore }
