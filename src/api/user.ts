import { authClient } from './client'

export const apiGetUser = (id: string) => authClient.get(`/users/${id}`)
export const apiGetCurrentUser = () => apiGetUser('me')
