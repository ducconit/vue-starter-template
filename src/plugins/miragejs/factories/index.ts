import { Factory } from 'miragejs'
import { ulid } from 'ulid'
import { faker } from '@faker-js/faker'
import type { UserFake } from '../types'

export const userFactory = Factory.extend<Partial<UserFake>>({
  id(): string {
    return ulid()
  },
  display_name(): string {
    return faker.person.fullName()
  },
  email(): string {
    return faker.internet.email()
  },
  password(): string {
    return faker.internet.password()
  },
  token(): string {
    return ulid()
  },
})

export default {
  user: userFactory,
}
