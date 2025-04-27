import axios from 'axios'

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
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
