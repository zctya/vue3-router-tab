let timeout = null

// Tab scrolling
export default {
  watch: {
    activeTabId: {
      async handler() {
        if (!this.$el) return

        // When activating a tab, if the current tab is not in the visible area, the tab will be scrolled to display.
        await this.$nextTick()

        this.adjust()
      },

      immediate: true
    }
  },

  mounted() {
    // Adjust tab scroll display when browser window size changes
    window.addEventListener('resize', this.adjust)
  },

  unmounted() {
    // Remove listening events after destruction
    window.removeEventListener('resize', this.adjust)
  },

  methods: {
    // Adjust tab scrolling to ensure that the current tab is in the visible area
    adjust() {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        timeout = null

        if (!this.$el) return

        const { scroll } = this.$refs
        const cur = this.$el.querySelector('.router-tab__item.is-active')

        if (scroll && cur && !scroll.isInView(cur)) scroll.scrollIntoView(cur)

        // Close right-click menu
        this.hideContextmenu()
      }, 200)
    },

    // Tab transition
    onTabTrans() {
      this.adjust()
    }
  }
}
