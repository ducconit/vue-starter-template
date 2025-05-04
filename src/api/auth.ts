import { guestClient } from './client'

export const apiLogin = (credentials: object) => guestClient.post('/auth/login', credentials)
export const apiLogout = () => guestClient.post('/auth/logout')
export const apiForgotPassword = (payload: object) =>
  guestClient.post('/auth/forgot-password', payload)
