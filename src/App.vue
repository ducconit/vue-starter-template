<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import { useHead } from '@unhead/vue'
import { computed, onBeforeMount, onErrorCaptured, toValue } from 'vue'
import { useAppError, setAppError } from './composables/useAppError'
import { useRoute } from 'vue-router'
import EmptyLayout from '@/layouts/EmptyLayout.vue'
import AppLayout from './layouts/AppLayout.vue'
import { useAuthStore } from './stores'
import { storeToRefs } from 'pinia'
import { apiGetCurrentUser } from './api'
import { toast } from 'vue-sonner'

useHead({
  title: 'Dashboard',
  titleTemplate: `%s %separator %appName`,
  templateParams: {
    separator: ' | ',
    appName: import.meta.env.VITE_APP_NAME,
  },
})

const route = useRoute()
const { hasError } = useAppError()

const Layout = computed(() => {
  if (!route.meta.layout) {
    // default layout
    return EmptyLayout
  }
  if (typeof route.meta.layout === 'string') {
    return getLayoutComponent(route.meta.layout)
  }
  return route.meta.layout
})

const getLayoutComponent = (layout: string) => {
  switch (layout) {
    case 'AppLayout':
      return AppLayout
    default:
      console.debug('Layout not found', layout)
      return EmptyLayout
  }
}

onErrorCaptured((err, instance, info) => {
  setAppError(err, instance, info)

  // prevent default error handler
  return false
})

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

onBeforeMount(async () => {
  // Nếu đã đăng nhập thì phải tải dữ liệu thông tin người dùng mới nhất
  // Đoạn code này được thực thi nếu refresh trang hoặc mở tab mới
  if (toValue(isLoggedIn)) {
    try {
      const { data } = await apiGetCurrentUser()
      authStore.setUser(data.data)
    } catch (e) {
      console.log(e)
      toast.error('Error', {
        description: 'Failed to load user data',
      })
    }
  }
})
</script>

<template>
  <div>
    <AppError v-if="hasError" />
    <Component v-else :is="Layout" />
    <Toaster rich-colors />
  </div>
</template>
