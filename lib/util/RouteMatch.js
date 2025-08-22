import { prunePath } from './'
import rules from '../config/rules'

// Parse routing key
function parseRouteKey($route, route, key) {
  const defaultKey = route.path

  if (!key) return defaultKey

  if (typeof key === 'string') {
    // Rule
    const rule = rules[key.toLowerCase()]
    return rule ? rule($route) : key
  }

  if (typeof key === 'function') {
    return parseRouteKey($route, route, key($route))
  }

  return defaultKey
}

// Parse the matching path
function parsePath(path, params) {
  return Object.entries(params).reduce((p, [key, val]) => {
    return p.replace(':' + key, val)
  }, path)
}

// Route matching information
export default class RouteMatch {
  constructor(vm, $route) {
    this.vm = vm
    this.$route = $route
  }

  // Set route
  set $route($route) {
    if ($route && !$route.matched) {
      const { $router } = this.vm
      $route = $router.resolve($route)
    }
    this._$route = $route
  }

  // Get route
  get $route() {
    return this._$route || this.vm.$route
  }

  // Page routing index
  get routeIndex() {
    // return this.vm.routeIndex
    return this.$route.matched.length - 1
  }

  // Lower level routing
  get route() {
    return this.$route.matched[this.routeIndex]
  }

  // Root path
  get basePath() {
    if (this.routeIndex < 1) return '/'

    const baseRoute = this.$route.matched[this.routeIndex - 1] || {}
    const { path } = baseRoute

    return (path && parsePath(path, this.$route.params)) || '/'
  }

  // Cache path, used to determine whether to reuse
  get alivePath() {
    const { $route } = this
    // Nested routing
    if (this.nest) {
      return parsePath(this.route.path, $route.params)
    }

    return prunePath($route.fullPath)
  }

  // Routing element
  get meta() {
    const { route } = this
    const $route = this.$route

    try {
      const matched = ($route && $route.matched) || []
      const metas = matched.map(r => (r && r.meta) || {})
      const meta = metas[this.routeIndex]
      if (meta && Object.keys(meta).length) return meta
    } catch (e) {}

    return (route && route.meta) || ($route && $route.meta) || {}
  }

  // Whether to nest routes
  get nest() {
    return this.$route.matched.length > this.routeIndex + 1
  }

  // Routing key
  get key() {
    if (!this.route) return ''

    return parseRouteKey(this.$route, this.route, this.meta.key)
  }

  // Whether to cache
  get alive() {
    const { keepAlive } = this.meta
    return typeof keepAlive === 'boolean' ? keepAlive : this.vm.keepAlive
  }

  // Whether to reuse components
  get reusable() {
    const { reuse } = this.meta
    return typeof reuse === 'boolean' ? reuse : this.vm.reuse
  }
}
