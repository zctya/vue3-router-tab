// Restore after tab refresh
export default {
  computed: {
    // Refresh restore storage key
    restoreKey() {
      const { restore, basePath } = this

      if (!restore || typeof sessionStorage === 'undefined') return ''

      let key = `RouterTab:restore:${basePath}`

      typeof restore === 'string' && (key += `:${restore}`)

      return key
    }
  },

  mounted() {
    // Save tab data before page reload
    window.addEventListener('beforeunload', this.saveTabs)
  },

  unmounted() {
    window.removeEventListener('beforeunload', this.saveTabs)
  },

  watch: {
    // Monitor restoreKey changes and automatically restore the tab
    restoreKey() {
      if (this.restoreWatch) {
        const { activeTab } = this
        this.initTabs()

        if (!this.activeTab) {
          this.items.push(activeTab)
        }
      }
    }
  },

  methods: {
    // Save tab data
    saveTabs() {
      this.restoreKey && sessionStorage.setItem(this.restoreKey, JSON.stringify(this.items))
    },

    // Clear tab cache data
    clearTabsStore() {
      this.restoreKey && sessionStorage.removeItem(this.restoreKey)
    },

    // Read tabs from cache
    restoreTabs() {
      if (!this.restoreKey) return false

      let tabs = sessionStorage.getItem(this.restoreKey)
      let hasStore = false

      try {
        tabs = JSON.parse(tabs)

        if (Array.isArray(tabs) && tabs.length) {
          hasStore = true
          this.presetTabs(tabs)
        }
      } catch (e) {
        /* empty */
      }

      return hasStore
    }
  }
}
