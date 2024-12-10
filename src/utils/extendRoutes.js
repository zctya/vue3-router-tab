// ! Introduce RouterTab extended routing
import { RouterTabRoutes } from '../../lib'
import route404 from '../router/404'

// Sub-routing extension
export default route => {
  route.children.push(route404, ...RouterTabRoutes)
}
