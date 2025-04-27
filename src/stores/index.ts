import { acceptHMRUpdate, createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { useAuthStore } from './auth.store'

const store = createPinia()

store.use(piniaPluginPersistedstate)

// make sure to pass the right store definition.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}

export default store
export { useAuthStore }
