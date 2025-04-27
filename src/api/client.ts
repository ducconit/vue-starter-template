import { useAuthStore } from '@/stores'
import axios from 'axios'
import { storeToRefs } from 'pinia'

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api'

const axiosOptions = {
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const guestClient = axios.create(axiosOptions)
export const authClient = axios.create(axiosOptions)

authClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const { accessToken } = storeToRefs(authStore)
  if (accessToken.value) {
    config.headers.Authorization = `Bearer ${accessToken.value}`
  }
  return config
})
