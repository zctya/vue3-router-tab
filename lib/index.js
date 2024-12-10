import RouterTab from './RouterTab.vue'
import RouterAlive from './components/RouterAlive.vue'
import RouterTabRoutes, { Iframe } from './config/routes'
import routerPage from './mixins/routerPage'

import './scss/routerTab.scss'
import './scss/transition.scss'

// Install
RouterTab.install = function install(Vue) {
  if (install.installed) return

  RouterTab.Vue = Vue
  install.installed = true

  Vue.component(RouterTab.name, RouterTab)
  Vue.mixin(routerPage)
}

// Install components automatically if the browser environment has a global Vue
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(RouterTab)
}

export default RouterTab

// Export
export { RouterAlive, RouterTabRoutes, Iframe }
