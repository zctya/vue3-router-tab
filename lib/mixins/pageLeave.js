import { emptyObj } from '../util'

// 路由导航守卫
export const leaveGuard = (app) => async (to, from) => {
  const $tabs = app.$tabs

  if (!$tabs) {
    return false
  }

  const fromId = $tabs.getRouteKey(from)
  const toId = $tabs.getRouteKey(to)
  const { $alive } = $tabs
  const fromCache = $alive && $alive.cache[fromId]
  const { alivePath } = ($alive && $alive.cache[toId]) || emptyObj
  const matched = $tabs.matchRoute(to)

  let id, type

  if (alivePath && alivePath !== matched.alivePath) {
    // 页签地址被替换：to 存在缓存但缓存路由不一致
    type = 'replace'
    id = toId
  } else if ($alive.basePath !== matched.basePath) {
    // 离开页签组件：to 不在当前页签组件路由下
    type = 'leave'
    id = $tabs.activeTabId
  } else if (!fromCache && fromId !== toId) {
    // 当前组件未缓存时离开页签
    type = 'leave'
    id = $tabs.activeTabId
  }

  if (type) {
    try {
      return await $tabs.leavePage(id, type)
    } catch {
      return false
    }
  }
}

// 페이지 떠나기
export default {
  created() {
    const { $router } = this

    if ($router._RouterTabInit) return

    // 라우팅 및 탐색 가드 초기화
    $router.beforeEach(leaveGuard(this))
    $router._RouterTabInit = true
  },

  methods: {
    // 페이지 떠나기 Promise
    async leavePage(id, type) {
      const tab = this.items.find(item => item.id === id) // 当前页签
      const pageLeave = this.$refs.routerAlive.$refs.alive.$options?.beforePageLeave

      if (tab && pageLeave && typeof pageLeave === 'function') {
        // 탭을 닫기 전
        const result = pageLeave.bind(this.$refs.routerAlive.$refs.alive)(tab, type)
        return result
      }
    }
  }
}
