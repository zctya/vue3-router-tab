import { emptyObj } from '../util'

// Right-click menu
export default {
  data() {
    return {
      // Right-click menu
      contextData: {
        id: null,
        index: -1,
        left: 0,
        top: 0
      }
    }
  },

  computed: {
    // Menu configuration
    contextMenu() {
      return Array.isArray(this.contextmenu) ? this.contextmenu : undefined
    },

    contextMenuPinned() {
      return Array.isArray(this.contextmenuPinned) && this.contextmenuPinned.length > 0 ? this.contextmenuPinned : undefined
    }
  },

  watch: {
    // Hide the right-click menu when switching routes
    $route() {
      this.hideContextmenu()
    },

    // Drag and drop to hide the right-click menu
    onDragSort() {
      this.hideContextmenu()
    }
  },

  mounted() {
    // Display the right-click menu and bind the click-close event
    document.addEventListener('click', this.contextmenuClickOutSide)
  },

  unmounted() {
    // Hide the right-click menu and remove the click-to-close event
    document.removeEventListener('click', this.contextmenuClickOutSide)
  },

  methods: {
    // Show tab right-click menu
    async showContextmenu(id, pinned, index, e) {
      // Close an open menu
      if (id !== null && this.contextData.id !== null) {
        this.hideContextmenu()
        await this.$nextTick()
      }

      // Menu positioning
      let { clientY: top, clientX: left } = e || emptyObj
      Object.assign(this.contextData, { id, pinned, index, top, left })
    },

    // Close the right-click menu of the tab
    hideContextmenu() {
      this.showContextmenu(null, -1)
    },

    // Close by clicking outside the menu
    contextmenuClickOutSide(e) {
      if (e.target !== this.$el.querySelector('.router-tab-contextmenu')) {
        this.hideContextmenu()
      }
    }
  }
}
