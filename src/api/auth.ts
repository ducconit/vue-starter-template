import { guestClient } from './client'

export const apiLogin = (credentials: object) => guestClient.post('/auth/login', credentials)
export const apiLogout = () => guestClient.post('/auth/logout')
export const apiForgotPassword = (payload: object) =>
  guestClient.post('/auth/forgot-password', payload)
export const apiRegister = (payload: object) => guestClient.post('/auth/register', payload)
export const apiVerifyOtp = (payload: { otp: string }) =>
  guestClient.post('/auth/verify-otp', payload)
