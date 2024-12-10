import { emptyObj } from '../util'

// Close or refresh the browser window
const beforeunload = ($tabs, tabId, beforePageLeave) => e => {
  if (!$tabs && $tabs._isDestroyed) return

  const tab = $tabs.items.find(item => item.id === tabId)
  const msg = beforePageLeave(tab, 'unload')

  if (msg && typeof msg === 'string') {
    e.preventDefault()
    e.returnValue = msg

    // Switch to non-current tab
    if ($tabs.activeTabId !== tabId) {
      $tabs.open(tab.to, false, false)
    }

    return msg
  }
}

// Update tab
function updateTab(info) {
  const tab = typeof info === 'string' ? { title: info } : info
  const { activeTab } = this.$tabs || emptyObj

  if (tab && activeTab) {
    for (const key in tab) {
      if (!['id', 'to'].includes(key)) {
        activeTab[key] = tab[key]
      }
    }
  }
}

// Routing page mixin
export default {
  emits: ['vnodeCreated', 'vnodeActivated', 'vnodeDeactivated', 'vnodeUnmounted'],

  watch: {
    // Monitor the routerTab field and update the tab information
    routeTab: {
      handler(val) {
        if (!val || this._inactive) return
        updateTab.call(this, val)
      },
      deep: true,
      immediate: true
    }
  },

  created() {
    this.$emit('vnodeCreated')
  },

  // Record cache before creation
  mounted() {
    const { $tabs } = this
    const beforePageLeave = this.$options.beforePageLeave

    // Page exit confirmation
    if ($tabs && beforePageLeave) {
      window.addEventListener('beforeunload', (this._beforeunload = beforeunload($tabs, $tabs.activeTabId, beforePageLeave.bind(this))))
    }
  },

  // Update the tab when it is activated
  activated() {
    this.routeTab && updateTab.call(this, this.routeTab)
    this.$emit('vnodeActivated', this)
  },

  deactivated() {
    this.$emit('vnodeDeactivated', this)
  },

  unmounted() {
    if (this._beforeunload) {
      window.removeEventListener('beforeunload', this._beforeunload)
    }
  }
}
