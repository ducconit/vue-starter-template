import { Response, type Server } from 'miragejs'
import { ulid } from 'ulid'
import { OTP_TYPES, clearOtp, mapOtpError, upsertOtp, validateOtp } from '../utils/otp'

const base64UrlEncode = (value: string) =>
  btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

const createFakeJwt = (subject: string) => {
  const now = Math.floor(Date.now() / 1000)
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = base64UrlEncode(
    JSON.stringify({
      sub: subject,
      jti: ulid(),
      iat: now,
      exp: now + 60 * 60,
    }),
  )
  const signatureSeed = `${subject}.${now}.${Math.random().toString(36).slice(2)}`
  const signature = base64UrlEncode(signatureSeed)
  return `${header}.${payload}.${signature}`
}

export default function (srv: Server) {
  srv.post('/auth/login', (schema, request) => {
    const { email, password } = JSON.parse(request.requestBody)
    const user = schema.db.users!.findBy((u: any) => u.email === email && u.password === password)
    if (user) {
      const token = createFakeJwt(email)
      schema.db.users!.update(user.id, { token })
      const hydratedUser = schema.db.users!.find(user.id)
      return new Response(
        200,
        {},
        {
          user: hydratedUser,
          token,
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
    const { email } = JSON.parse(request.requestBody) as { email: string }
    const user = schema.db.users!.findBy((u: any) => u.email === email)
    if (user) {
      upsertOtp(schema.db, email, OTP_TYPES.FORGOT_PASSWORD)
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

  srv.post('/auth/forgot-password/verify', (schema, request) => {
    const { email, otp } = JSON.parse(request.requestBody) as { email: string; otp: string }
    const result = validateOtp(schema.db, email, OTP_TYPES.FORGOT_PASSWORD, otp)

    if (result.valid) {
      return new Response(
        200,
        {},
        {
          err_code: 0,
          err_msg: 'OTP verified',
        },
      )
    }
    const error = mapOtpError(result.reason)
    return new Response(400, {}, error)
  })

  srv.post('/auth/forgot-password/reset', (schema, request) => {
    const { email, otp, password } = JSON.parse(request.requestBody) as {
      email: string
      otp: string
      password: string
    }
    const user = schema.db.users!.findBy((u: any) => u.email === email)

    if (!user) {
      return new Response(
        400,
        {},
        {
          err_code: 1,
          err_msg: 'User not found',
        },
      )
    }

    const result = validateOtp(schema.db, email, OTP_TYPES.FORGOT_PASSWORD, otp)

    if (!result.valid) {
      const error = mapOtpError(result.reason)
      return new Response(400, {}, error)
    }

    schema.db.users!.update(user.id, { password })
    clearOtp(schema.db, result.record)

    return new Response(
      200,
      {},
      {
        err_code: 0,
        err_msg: 'Password updated',
      },
    )
  })

  srv.post('/auth/register', (schema, request) => {
    const { email, password, first_name, last_name } = JSON.parse(request.requestBody) as {
      email: string
      password: string
      first_name: string
      last_name: string
    }
    const existingUser = schema.db.users!.findBy((u: any) => u.email === email)

    if (existingUser) {
      return new Response(
        400,
        {},
        {
          err_msg: 'User already exists',
          err_code: 1,
        },
      )
    }

    const token = createFakeJwt(email)
    const userCreated = schema.db.users!.insert({
      email,
      password,
      first_name,
      last_name,
      token,
      verified_at: null,
    })

    upsertOtp(schema.db, email, OTP_TYPES.VERIFY_ACCOUNT)

    return new Response(
      200,
      {},
      {
        err_code: 0,
        err_msg: 'Success',
        user: userCreated,
        token,
      },
    )
  })

  srv.post('/auth/verify-otp', (schema, request) => {
    const { email, otp } = JSON.parse(request.requestBody) as { email: string; otp: string }
    const user = schema.db.users!.findBy((u: any) => u.email === email)

    if (!user) {
      return new Response(
        400,
        {},
        {
          err_code: 1,
          err_msg: 'User not found',
        },
      )
    }

    const result = validateOtp(schema.db, email, OTP_TYPES.VERIFY_ACCOUNT, otp)

    if (!result.valid) {
      const error = mapOtpError(result.reason)
      return new Response(400, {}, error)
    }

    clearOtp(schema.db, result.record)
    schema.db.users!.update(user.id, { verified_at: Date.now() })

    return new Response(
      200,
      {},
      {
        err_code: 0,
        err_msg: 'OTP verified',
      },
    )
  })
}
