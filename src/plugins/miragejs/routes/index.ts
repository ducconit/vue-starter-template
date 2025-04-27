import { type Server } from 'miragejs'
import authRoutes from './auth'
const setupRoutes = (srv: Server) => {
  authRoutes(srv)
}
export default setupRoutes
