import { Response, type Server } from 'miragejs'
import type { AppSchema } from '../types'

export default function (srv: Server) {
  srv.get('/users/:id', (schema: AppSchema, request) => {
    const { id } = request.params

    if (id === 'me') {
      const authorizationHeader =
        request.requestHeaders.Authorization ?? request.requestHeaders.authorization

      if (!authorizationHeader) {
        return new Response(401, {}, { err_msg: 'Unauthorized', err_code: 1 })
      }

      const token = authorizationHeader.replace(/^Bearer\s+/i, '').trim()

      if (!token) {
        return new Response(401, {}, { err_msg: 'Unauthorized', err_code: 1 })
      }

      const user = schema.findBy('user', { token })
      if (!user) {
        return new Response(401, {}, { err_msg: 'Unauthorized', err_code: 1 })
      }
      return new Response(200, {}, { data: user })
    }
    const user = schema.findBy('user', { id })
    if (!user) {
      return new Response(404, {}, { err_msg: 'User not found', err_code: 1 })
    }
    return new Response(200, {}, { data: user })
  })
}
