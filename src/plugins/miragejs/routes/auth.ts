import { Response, type Server } from 'miragejs'
import type { AppSchema } from '../types'
import { ulid } from 'ulid'

const OTP_CODE = '12345'
const OTP_TTL = 5 * 60 * 1000
export const OTP_TYPES = {
  VERIFY_ACCOUNT: 'verify-account',
  FORGOT_PASSWORD: 'forgot-password',
}

export default function (srv: Server) {
  srv.post('/auth/login', (schema: AppSchema, request) => {
    const { email, password } = JSON.parse(request.requestBody)
    const user = schema.findBy('user', { email, password })

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
    const user = schema.findBy('user', { email } as any)
    if (user) {
      const otp = schema.findBy('otp', { identify: email, type: OTP_TYPES.FORGOT_PASSWORD } as any)
      if (otp) {
        otp.update({ expires_at: Date.now() + OTP_TTL })
        return new Response(
          200,
          {},
          {
            err_code: 0,
            err_msg: 'Success',
          },
        )
      }
      schema.create('otp', {
        identify: email,
        type: OTP_TYPES.FORGOT_PASSWORD,
        code: OTP_CODE,
        expires_at: Date.now() + OTP_TTL,
      } as any)
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
    const { email, otp } = JSON.parse(request.requestBody)
    const result = schema.findBy('otp', {
      identify: email,
      type: OTP_TYPES.FORGOT_PASSWORD,
      code: otp,
    } as any)

    if (result) {
      result.destroy()
      return new Response(
        200,
        {},
        {
          err_code: 0,
          err_msg: 'OTP verified',
        },
      )
    }
    return new Response(
      400,
      {},
      {
        err_code: 1,
        err_msg: 'Invalid OTP',
      },
    )
  })

  srv.post('/auth/forgot-password/reset', (schema, request) => {
    const { email, otp, password } = JSON.parse(request.requestBody)
    const user = schema.findBy('user', { email } as any)

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

    const result = schema.findBy('otp', {
      identify: email,
      type: OTP_TYPES.FORGOT_PASSWORD,
      code: otp,
    } as any)

    if (!result) {
      return new Response(
        400,
        {},
        {
          err_code: 1,
          err_msg: 'Invalid OTP',
        },
      )
    }

    user.update({ password })
    result.destroy()

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
    const { email, password, first_name, last_name } = JSON.parse(request.requestBody)
    const existingUser = schema.findBy('user', { email } as any)

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

    const userData = {
      email,
      password,
      first_name,
      last_name,
      verified_at: null,
    }
    const token = ulid()
    const userCreated = schema.create('user', {
      ...userData,
      token,
    } as any)

    schema.create('otp', {
      identify: email,
      type: OTP_TYPES.VERIFY_ACCOUNT,
      code: OTP_CODE,
      expires_at: Date.now() + OTP_TTL,
    } as any)

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
    const user = schema.findBy('user', { email } as any)

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

    const result = schema.findBy('otp', {
      identify: email,
      type: OTP_TYPES.VERIFY_ACCOUNT,
      code: otp,
    } as any)

    if (!result) {
      return new Response(
        400,
        {},
        {
          err_code: 1,
          err_msg: 'Invalid OTP',
        },
      )
    }

    result.destroy()
    user.update({ verified_at: Date.now().toString() })

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
