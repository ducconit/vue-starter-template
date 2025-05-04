import { type Server } from 'miragejs'
import authRoutes from './auth'
import userRoutes from './user'

const setupRoutes = (srv: Server) => {
  authRoutes(srv)
  userRoutes(srv)
}
export default setupRoutes
