import { Response, type Server } from 'miragejs'

export default function (srv: Server) {
  srv.post('/auth/login', (schema, request) => {
    const { email, password } = JSON.parse(request.requestBody)
    const user = schema.db.users.findBy((u: any) => u.email === email && u.password === password)
    if (user) {
      return new Response(
        200,
        {},
        {
          user,
          token: user.token,
        },
      )
    }
    return new Response(
      400,
      {},
      {
        err_msg: 'Invalid credentials',
        err_code: 1,
      },
    )
  })
}
