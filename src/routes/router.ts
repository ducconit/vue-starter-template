import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { authMiddleware, guestMiddleware } from './middlewares'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authMiddleware)
router.beforeEach(guestMiddleware)

export default router
