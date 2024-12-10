import { emptyObj } from '../util'

// Route navigation guard
export const leaveGuard = app => async (to, from) => {
  const $tabs = app.$tabs

  if (!$tabs) {
    return true
  }

  const fromId = $tabs.getRouteKey(from)
  const toId = $tabs.getRouteKey(to)
  const { $alive } = $tabs
  const fromCache = $alive && $alive.cache[fromId]
  const { alivePath } = ($alive && $alive.cache[toId]) || emptyObj
  const matched = $tabs.matchRoute(to)

  let id, type

  if (alivePath && alivePath !== matched.alivePath) {
    // The tag address is replaced: to exists in the cache but the cache route is inconsistent
    type = 'replace'
    id = toId
  } else if ($alive.basePath !== matched.basePath) {
    // Leaving the tab component: to is not under the current tab component route
    type = 'leave'
    id = $tabs.activeTabId
  } else if (!fromCache && fromId !== toId) {
    // Leave the tab when the current component is not cached
    type = 'leave'
    id = $tabs.activeTabId
  }

  if (type) {
    try {
      return await $tabs.leavePage(id, type)
    } catch (e) {
      console.error('leaveGuard error', e)
      return false
    }
  }
}

// Page away
export default {
  created() {
    const { $router } = this

    if ($router._RouterTabInit) return

    // Initialize route navigation guard
    $router.beforeEach(leaveGuard(this))
    $router._RouterTabInit = true
  },

  methods: {
    // Page leaves Promise
    async leavePage(id, type) {
      try {
        const tab = this.items.find(item => item.id === id) // Current tab
        const pageLeave = this.$refs.routerAlive.$refs.alive?.$options?.beforePageLeave

        if (tab && pageLeave && typeof pageLeave === 'function') {
          // Before closing the tab
          const result = pageLeave.bind(this.$refs.routerAlive.$refs.alive)(tab, type)
          return result
        }
      } catch (e) {
        console.error('leavePage error', e)
      }
    }
  }
}
