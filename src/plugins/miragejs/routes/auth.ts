import { Response, type Server } from 'miragejs'
import { ulid } from 'ulid'

export default function (srv: Server) {
  srv.post('/auth/login', (schema, request) => {
    const { email, password } = JSON.parse(request.requestBody)
    const user = schema.db.users!.findBy((u: any) => u.email === email && u.password === password)
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

  srv.post('/auth/forgot-password', (schema, request) => {
    const { email } = JSON.parse(request.requestBody)
    const user = schema.db.users!.findBy((u: any) => u.email === email)
    if (user) {
      return new Response(
        200,
        {},
        {
          err_code: 0,
          err_msg: 'Success',
        },
      )
    }
    return new Response(
      400,
      {},
      {
        err_msg: 'User not found',
        err_code: 1,
      },
    )
  })

  srv.post('/auth/register', (schema, request) => {
    const { email, password, first_name, last_name } = JSON.parse(request.requestBody)
    const user = schema.db.users!.findBy((u: any) => u.email === email)
    if (!user) {
      const userCreated = schema.db.users!.insert({
        email,
        password,
        first_name,
        last_name,
        token: ulid(),
      })
      return new Response(
        200,
        {},
        {
          err_code: 0,
          err_msg: 'Success',
          user: userCreated,
          token: userCreated.token,
        },
      )
    }
    return new Response(
      400,
      {},
      {
        err_msg: 'User already exists',
        err_code: 1,
      },
    )
  })
}
