import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { startMockServer } from './plugins/miragejs'

if (import.meta.env.VITE_MOCK_SERVER === 'true') {
  startMockServer()
}

const app = createApp(App)

app.mount('#app')
