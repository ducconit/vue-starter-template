import { computed, ref } from 'vue'

const appError = ref<any>(null)
const hasError = computed(() => appError.value !== null)
const error = computed(() => appError.value?.error)

export const clearAppError = () => {
  appError.value = null
}

export const setAppError = (error: any, instance?: any, info?: any) => {
  appError.value = {
    error,
    instance,
    info,
  }
}

export const useAppError = () => {
  return {
    appError,
    error,
    clearAppError,
    hasError,
  }
}
