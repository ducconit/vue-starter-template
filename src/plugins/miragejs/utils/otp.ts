const OTP_CODE = '12345'
const OTP_TTL = 5 * 60 * 1000

export const OTP_TYPES = {
  VERIFY_ACCOUNT: 'verify-account',
  FORGOT_PASSWORD: 'forgot-password',
} as const

export type OtpType = (typeof OTP_TYPES)[keyof typeof OTP_TYPES]

export const getOtpCollection = (db: any) => db?.otps

export const upsertOtp = (
  db: any,
  identify: string,
  type: OtpType,
  code = OTP_CODE,
  ttl = OTP_TTL,
) => {
  const collection = getOtpCollection(db)
  if (!collection) {
    return null
  }
  const expiresAt = Date.now() + ttl
  const existing = collection.findBy({ identify, type })
  if (existing) {
    collection.update(existing.id, { code, expires_at: expiresAt })
    return collection.find(existing.id)
  }
  return collection.insert({ identify, type, code, expires_at: expiresAt })
}

export const validateOtp = (db: any, identify: string, type: OtpType, code: string) => {
  const collection = getOtpCollection(db)
  if (!collection) {
    return { valid: false, reason: 'not_found', record: null as any }
  }
  const record = collection.findBy({ identify, type })
  if (!record) {
    return { valid: false, reason: 'not_found', record: null as any }
  }
  if (record.expires_at <= Date.now()) {
    return { valid: false, reason: 'expired', record }
  }
  if (record.code !== code) {
    return { valid: false, reason: 'invalid', record }
  }
  return { valid: true, reason: null, record }
}

export const clearOtp = (db: any, record: any) => {
  const collection = getOtpCollection(db)
  if (collection && record) {
    collection.remove(record.id)
  }
}

export const mapOtpError = (reason: string | null) => {
  if (reason === 'expired') {
    return {
      err_code: 3,
      err_msg: 'OTP expired',
    }
  }

  return {
    err_code: 2,
    err_msg: 'Invalid OTP',
  }
}
