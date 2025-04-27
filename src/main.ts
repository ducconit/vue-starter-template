import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { startMockServer } from './plugins/miragejs'
import { i18n } from './plugins/i18n'
import store from './stores'
import router from './routes'

if (import.meta.env.VITE_MOCK_SERVER === 'true') {
  startMockServer()
}

const app = createApp(App)

app.use(i18n)
app.use(store)
app.use(router)

app.mount('#app')
