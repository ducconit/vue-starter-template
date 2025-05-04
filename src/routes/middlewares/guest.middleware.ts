import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const guestMiddleware = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  const { isLoggedIn } = storeToRefs(authStore)

  // Nếu đang truy cập route cần khách vãng lai nhưng đã đăng nhập
  if (to.meta.guest && isLoggedIn.value) {
    // Chuyển hướng về trang chủ
    return next({ name: 'home' })
  }

  return next()
}
