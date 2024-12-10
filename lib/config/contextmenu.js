// Menu data
const menuMap = {
  // Refresh
  refresh: {
    handler({ data, $tabs }) {
      $tabs.refreshTab(data.id)
    }
  },

  // Refresh all
  refreshAll: {
    handler({ $tabs }) {
      $tabs.refreshAll()
    }
  },

  // Close
  close: {
    enable({ target }) {
      return target.closable
    },
    handler({ data, $tabs }) {
      $tabs.closeTab(data.id)
    }
  },

  // Move tab to pinned group
  pin: {
    enable({ $tabs }) {
      return $tabs.allowPin
    },
    handler({ data, $tabs, onTabEvent }) {
      const item = $tabs.items.find(el => el.id === data.id || el.to === data.id)
      item.pinned = true
      // Push tab to the end of items
      $tabs.items.splice($tabs.items.indexOf(item), 1)
      $tabs.items.push(item)
      onTabEvent('pin', { data: item, $tabs })
    }
  },

  // Move tab to common group
  unpin: {
    enable({ target }) {
      return target.unpinnable
    },
    handler({ data, $tabs, onTabEvent }) {
      const item = $tabs.items.find(el => el.id === data.id || el.to === data.id)
      item.pinned = false
      // Push tab to the end of items
      $tabs.items.splice($tabs.items.indexOf(item), 1)
      $tabs.items.push(item)
      onTabEvent('unpin', { data: item, $tabs })
    }
  },

  // Close left
  closeLefts: {
    enable({ $menu }) {
      return $menu.lefts.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.lefts)
    }
  },

  // Close right
  closeRights: {
    enable({ $menu }) {
      return $menu.rights.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.rights)
    }
  },

  // Close others
  closeOthers: {
    enable({ $menu }) {
      return $menu.others.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.others)
    }
  }
}

// Traverse fill id
Object.entries(menuMap).forEach(([id, item]) => (item.id = id))

export default menuMap

// Default menu
export const defaultMenu = ['refresh', 'refreshAll', 'close', 'closeLefts', 'closeRights', 'closeOthers', 'pin']

export const defaultMenuPinned = ['refresh', 'close', 'unpin']
