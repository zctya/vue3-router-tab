<template>
  <div
    :class="['router-tab__contextmenu', { 'has-icon': hasIcon }]"
    :style="{
      left: `${data.left}px`,
      top: `${data.top}px`
    }"
  >
    <tab-contextmenu-item
      v-for="item in menuList"
      :key="item.id"
      :data="item"
    />
  </div>
</template>

<script>
  import TabContextmenuItem from './ContextmenuItem.vue'
  import menuMap, { defaultMenu, defaultMenuPinned } from '../config/contextmenu'

  export default {
    name: 'TabContextmenu',

    components: { TabContextmenuItem },

    inject: ['$tabs'],

    props: {
      // Right click data
      data: {
        type: [Boolean, Object]
      },

      // Menu configuration
      menu: {
        type: Array,
        default: () => defaultMenu
      },

      // Pinned menu configuration
      menuPinned: {
        type: Array,
        default: () => defaultMenuPinned
      }
    },

    computed: {
      // Activate the menu tab
      target() {
        return this.tabMap[this.data.id]
      },

      // Menu options
      menuList() {
        return (this.data.pinned ? this.menuPinned : this.menu)
          .map(item => {
            if (typeof item === 'string') {
              // Built-in menu
              return menuMap[item]
            } else if (item && item.id) {
              // Expand the built-in menu
              let origin = menuMap[item.id]
              return origin ? { ...origin, ...item } : item
            }
          })
          .filter(item => item)
      },

      // Whether to display the icon
      hasIcon() {
        return this.menuList.some(item => item.icon)
      },

      // Tab map
      tabMap() {
        return this.$tabs.$refs.tab.reduce((map, item) => {
          map[item.id] = item
          return map
        }, {})
      },

      // Tab component list
      tabs() {
        return this.$tabs.items.map(item => this.tabMap[item.id])
      },

      // Closeable tabs on the left
      lefts() {
        return this.tabs.slice(0, this.data.index).filter(item => item.closable)
      },

      // Closeable tabs on the right
      rights() {
        return this.tabs.slice(this.data.index + 1).filter(item => item.closable)
      },

      // Other closable tabs
      others() {
        return this.tabs.filter(item => item.closable && this.data.id !== item.id)
      }
    },

    mounted() {
      this.adjust()
    },

    methods: {
      // Close multiple tabs
      async closeMulti(tabs) {
        for (let { id } of tabs) {
          try {
            await this.$tabs.removeTab(id)
          } catch (e) {
            /* empty */
          }
        }

        // If the current tab is closed, open it by right clicking and selecting the tab
        if (!this.$tabs.activeTab) {
          this.$router.replace(this.target.to)
        }
      },

      // Adapt to boundary position
      adjust() {
        const { clientWidth } = this.$el
        const winWidth = window.innerWidth
        if (this.data.left + clientWidth > winWidth) {
          this.data.left = winWidth - clientWidth - 5
        }
      }
    }
  }
</script>
