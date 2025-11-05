import type { Registry } from 'miragejs'
import type models from '../models'
import type Schema from 'miragejs/orm/schema'
import type { User } from '@/types/user'
import type factories from '../factories'

export interface UserFake extends User {
  token: string
}

export type AppRegistry = Registry<
  {
    user: typeof models.user
  },
  typeof factories
>
export type AppSchema = Schema<AppRegistry>
