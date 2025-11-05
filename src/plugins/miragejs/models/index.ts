import { Model } from 'miragejs'
import type { UserFake } from '../types'

export const UserModel = Model.extend<Partial<UserFake>>({})

export default {
  user: UserModel,
  otp: Model.extend<Partial<any>>({}),
}
