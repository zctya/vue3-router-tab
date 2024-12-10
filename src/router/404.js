import { importPage } from '../utils'

// 404 routing
export default {
  path: '404',
  component: importPage('404'),
  meta: {
    title: 'Page not found',
    icon: 'rt-icon-warning'
  }
}
