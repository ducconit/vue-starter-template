import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createHead } from '@unhead/vue/client'
import { TemplateParamsPlugin } from 'unhead/plugins'

import App from './App.vue'
import { startMockServer } from './plugins/miragejs'
import { i18n } from './plugins/i18n'
import store from './stores'
import router from './routes'
import dayjs from './plugins/dayjs'

if (import.meta.env.VITE_MOCK_SERVER === 'true') {
  startMockServer()
}

const head = createHead({ plugins: [TemplateParamsPlugin] })
const app = createApp(App)

app.use(VueQueryPlugin)
app.use(i18n)
app.use(store)
app.use(router)
app.use(head)
app.use(dayjs)

app.mount('#app')
