import { ref } from 'vue'

export const breadcrumbs = ref<any[]>([])

export const setBreadcrumbs = (items: any[]) => {
  breadcrumbs.value = items
}

export const clearBreadcrumbs = () => {
  breadcrumbs.value = []
}
