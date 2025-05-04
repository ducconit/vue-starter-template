import { Response, type Server } from 'miragejs'

export default function (srv: Server) {
  srv.get('/users/:id', (schema, request) => {
    const { id } = request.params
    if (id === 'me') {
      const token = request.requestHeaders.Authorization?.replace('Bearer ', '')
      const user = schema.db.users.findBy((u: any) => u.token === token)
      if (!user) {
        return new Response(401, {}, { err_msg: 'Unauthorized', err_code: 1 })
      }
      return new Response(200, {}, { data: user })
    }
    const user = schema.db.users.findBy((u: any) => u.id === id)
    if (!user) {
      return new Response(404, {}, { err_msg: 'User not found', err_code: 1 })
    }
    return new Response(200, {}, { data: user })
  })
}
