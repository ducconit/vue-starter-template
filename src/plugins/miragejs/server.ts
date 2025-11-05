import { createServer } from 'miragejs'
import { ulid } from 'ulid'
import setupRoutes from './routes'
import models from './models'
import factories from './factories'

export const startMockServer = () =>
  createServer({
    environment: 'development',
    models,
    factories,

    seeds(server) {
      server.create('user', {
        id: ulid(),
        display_name: 'DNT',
        email: 'admin@example.com',
        password: '123',
        token: 'faketoken',
        verified_at: new Date().toISOString(),
      })
    },

    routes() {
      this.namespace = 'api'

      setupRoutes(this)

      this.passthrough()
    },
  })
