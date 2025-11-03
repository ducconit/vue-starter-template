import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authMiddleware, guestMiddleware } from './middlewares'
import { useAppStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authMiddleware)
router.beforeEach(guestMiddleware)

router.beforeEach((to, from, next) => {
  const appStore = useAppStore()
  if (to.name !== from.name) {
    appStore.setAppLoading(true)
  }
  next()
})

router.afterEach(() => {
  const appStore = useAppStore()
  appStore.setAppLoading(false)
})

router.onError(() => {
  const appStore = useAppStore()
  appStore.setAppLoading(false)
})

export default router
