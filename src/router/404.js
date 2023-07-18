import { importPage } from '../utils'

// 404 路由
export default {
  path: '404',
  component: importPage('404'),
  meta: {
    title: '페이지를 찾을 수 없음',
    icon: 'rt-icon-warning'
  }
}
