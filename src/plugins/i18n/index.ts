import { createI18n } from 'vue-i18n'
import en from '@/locales/en.json'

export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  messages: {
    en,
  },
})

export default i18n
