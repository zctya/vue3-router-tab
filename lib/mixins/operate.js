import { warn } from '../util/warn'

// Get shutdown parameters
function getCloseArgs(args) {
  args = Array.from(args)

  let argsLen = args.length
  let arg = args[0] // First option

  if (!argsLen) {
    // close()
    return {}
  } else if (arg && typeof arg === 'object' && !arg.name && !arg.fullPath && !arg.params && !arg.query && !arg.hash) {
    // close({id, path, match, force, to, refresh})
    return arg
  } else {
    // close(path, to)
    let [path, to] = args
    return { path, to }
  }
}

// Are the paths consistent?
function equalPath(path1, path2) {
  const reg = /\/$/
  return path1.replace(reg, '') === path2.replace(reg, '')
}

// Tab operation
export default {
  methods: {
    /**
     * Open the tab (open fresh by default)
     * @param {location} path Tab path
     * @param {Boolean} [isReplace = false] Whether to replace the current route with replace method
     * @param {Boolean | String} [refresh = true] Whether to open it freshly. If it is `sameTab`, only the same tab will be opened freshly.
     * @param {Boolean} [isInheritable=false] Sets in opening tab prop that links to parent tab and using for redirecting path when closing
     */
    async open(path, isReplace = false, refresh = true, isInheritable = false) {
      let { items } = this
      const curId = this.activeTabId
      const tarId = this.getRouteKey(path)
      const isSameTab = equalPath(curId, tarId)

      // Open the routing tab that is the same as the current routing before refreshing.
      refresh === 'sameTab' && (refresh = isSameTab)

      refresh && this.refresh(path, false)

      try {
        await this.$router[isReplace ? 'replace' : 'push'](path)

        this.useInheritance && isInheritable && !isReplace && (items.find(item => item.id === tarId || item.to === tarId).parentPath = curId)
      } catch (e) {
        /* empty */
      } finally {
        isSameTab && this.reload()
      }
    },

    // Remove tab item
    async removeTab(id, force = false) {
      let { items } = this
      const idx = items.findIndex(item => item.id === id)

      // The last tab is not allowed to be closed
      if (!force && this.keepLastTab && items.length === 1) {
        throw new Error(this.langs.msg.keepLastTab)
      }

      if (!force) await this.leavePage(id, 'close')

      // Promise to remove tabs and cache after closing
      this.$alive.remove(id)
      idx > -1 && items.splice(idx, 1)
    },

    /**
     * Close tab
     * Supports calling in the following ways:
     *   1. this.$tabs.close({id, path, match, force, to, refresh})
     *   2. this.$tabs.close(path, to)
     * @param {String} id Close by tab id
     * @param {location} path Close the tab through the routing path. If id and path are not configured, the current tab will be closed.
     * @param {Boolean} [match = true] When the path mode is turned off, whether to match the full path of path
     * @param {Boolean} [force = true] Whether to force close
     * @param {location} to The address to jump to after closing. If it is null, no jump will occur.
     * @param {Boolean} [refresh = false] Whether to open a new jump address
     */
    async close() {
      // Parse parameters
      let { id, path, match = true, force = true, to, refresh = false } = getCloseArgs(arguments)

      let { activeTabId, items } = this
      let parentPath
      // Get id based on path
      if (!id && path) {
        id = this.getIdByPath(path, match)
        if (!id) return
      }

      // Default current tab
      if (!id) id = activeTabId

      try {
        const idx = items.findIndex(item => item.id === id)

        // Remove tab
        items[idx] && items[idx].parentPath && (parentPath = items[idx].parentPath)
        await this.removeTab(id, force)

        // If null, do not jump
        if (to === null) return

        // If you close the current tab, open the next tab
        if (activeTabId === id) {
          !to && (to = parentPath)
          if (!to || !items.find(item => item.id === to || item.to === to)) {
            let nextTab = items[idx] || items[idx - 1]
            to = nextTab ? nextTab.to : this.defaultPath
          }

          if (to) {
            this.open(to, true, refresh === false ? 'sameTab' : true)
          }
        }
      } catch (e) {
        warn(false, e)
      }
    },

    // Close tab by tab id
    async closeTab(id = this.activeTabId, to, force = false) {
      this.close({ id, to, force })
    },

    /**
     * Refresh the tab by routing address
     * @param {location} path Address that needs to be refreshed
     * @param {Boolean} [match = true] Whether to match the target full path
     * @param {Boolean} [force = true] Whether to force refresh
     */
    refresh(path, match = true, force = true) {
      let id = (path && this.getIdByPath(path, match)) || undefined
      this.refreshTab(id, force)
    },

    // Refresh the specified tab
    async refreshTab(id = this.activeTabId, force = false) {
      try {
        if (!force) await this.leavePage(id, 'refresh')
        this.$alive.refresh(id)
      } catch (e) {
        warn(false, e)
      }
    },

    /**
     * Refresh all tabs
     * @param {Boolean} [force = false] Whether to force refresh, if forced, ignore the page beforePageLeave
     */
    async refreshAll(force = false) {
      const { cache } = this.$alive
      for (const id in cache) {
        try {
          if (!force) await this.leavePage(id, 'refresh')
          this.$alive.refresh(id)
        } catch (e) {
          /* empty */
        }
      }
    },

    /**
     * Reset RouterTab to default state, close all tabs and clear cached tab data
     * @param {location} [to = this.defaultPath] Jump to page after reset
     */
    reset(to = this.defaultPath) {
      // Traverse delete cache
      this.items.forEach(({ id }) => this.$alive.remove(id))

      // Clear cache tab
      this.clearTabsStore()

      // Initial tab data
      this.initTabs()

      this.open(to, true, true)
    }
  }
}
