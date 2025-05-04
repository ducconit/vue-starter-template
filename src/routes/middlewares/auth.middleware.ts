import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const authMiddleware = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  // Nếu đang truy cập route cần xác thực nhưng chưa đăng nhập
  if (to.meta.auth && !isLoggedIn.value) {
    // Chuyển hướng về trang login
    return next({ name: 'login' })
  }

  return next()
}
