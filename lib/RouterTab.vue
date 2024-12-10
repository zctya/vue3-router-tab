<template>
  <div class="router-tab">
    <!-- Tab header -->
    <header
      ref="header"
      class="router-tab__header"
    >
      <div class="router-tab__slot-start">
        <slot name="start" />
      </div>

      <div v-if="allowPin">
        <div :class="['router-tab__pinned', { 'router-tab__pinned-alone': pinnedGroup.length === 1 }]">
          <!-- Tag list -->
          <transition-group
            v-bind="tabTrans"
            @after-enter="onTabTrans"
            @after-leave="onTabTrans"
          >
            <ul
              class="router-tab__nav"
              key="0"
            >
              <tab-item
                v-for="item in pinnedGroup"
                :key="item.id || item.to"
                ref="tab"
                :data="item"
                :index="items.indexOf(item)"
                @contextmenu.prevent="e => showContextmenu(item.id, item.pinned, items.indexOf(item), e)"
              />
            </ul>
          </transition-group>
        </div>
      </div>

      <transition name="router-tab__slot-divider_trans">
        <slot
          v-if="allowPin && commonGroup.length > 0"
          name="divider"
        />
      </transition>

      <tab-scroll ref="scroll">
        <!-- Tag list -->
        <transition-group
          v-bind="tabTrans"
          @after-enter="onTabTrans"
          @after-leave="onTabTrans"
        >
          <ul
            class="router-tab__nav"
            key="0"
          >
            <tab-item
              v-for="item in commonGroup"
              :key="item.id || item.to"
              ref="tab"
              :data="item"
              :index="items.indexOf(item)"
              @contextmenu.prevent="e => showContextmenu(item.id, item.pinned, items.indexOf(item), e)"
            />
          </ul>
        </transition-group>
      </tab-scroll>

      <div class="router-tab__slot-end">
        <slot name="end" />
      </div>
    </header>

    <!-- Page container -->
    <div class="router-tab__container">
      <slot name="containerHeader" />

      <router-alive
        ref="routerAlive"
        page-class="router-tab-page"
        :keep-alive="keepAlive"
        :reuse="reuse"
        :max="maxAlive"
        :transition="pageTrans"
        :page-scroller="pageScroller"
        @ready="onAliveReady"
        @change="onAliveChange"
      />

      <!-- Iframe page -->
      <transition-group
        v-bind="pageTrans"
        tag="div"
        class="router-tab__iframes"
      >
        <iframe
          v-for="url in iframes"
          v-show="url === currentIframe"
          :key="url"
          :src="url"
          :name="iframeNamePrefix + url"
          frameborder="0"
          class="router-tab__iframe"
          @load="iframeLoaded(url)"
        />
      </transition-group>

      <slot name="containerFooter" />
    </div>

    <!-- Right click menu -->
    <transition name="router-tab-zoom">
      <tab-contextmenu
        v-if="contextmenu !== false && contextData.index > -1"
        :data="contextData"
        :menu="contextMenu"
        :menu-pinned="contextMenuPinned"
      />
    </transition>
  </div>
</template>

<script>
  // Methods
  import { emptyObj, prunePath, getTransOpt } from './util'

  // Function module mixin
  import contextmenu from './mixins/contextmenu'
  import i18n from './mixins/i18n'
  import iframe from './mixins/iframe'
  import operate from './mixins/operate'
  import pageLeave from './mixins/pageLeave'
  import scroll from './mixins/scroll'
  import restore from './mixins/restore'

  // Child components
  import RouterAlive from './components/RouterAlive.vue'
  import TabItem from './components/TabItem.vue'
  import TabScroll from './components/TabScroll.vue'
  import TabContextmenu from './components/Contextmenu.vue'

  // RouterTab coomponent
  // @vue/component
  const RouterTab = {
    name: 'RouterTab',

    components: { RouterAlive, TabItem, TabScroll, TabContextmenu },

    mixins: [contextmenu, i18n, iframe, operate, pageLeave, scroll, restore],

    // Inject child components
    provide() {
      return {
        $tabs: this,
        allowDragPinned: this.allowDragPinned,
        allowClosePinned: this.allowClosePinned,
        hideTitlePinned: this.hideTitlePinned,
        onTabEvent: this.onTabEvent
      }
    },

    props: {
      // Allow pinned group
      allowPin: {
        type: Boolean,
        default: false
      },

      // Allow drag the pinned tab
      allowDragPinned: {
        type: Boolean,
        default: true
      },

      // Allow close the pinned tab
      allowClosePinned: {
        type: Boolean,
        default: false
      },

      // Hide the title of pinned tab
      hideTitlePinned: {
        type: Boolean,
        default: false
      },

      // Allow setting up links between tabs
      useInheritance: {
        type: Boolean,
        default: false
      },

      // Initial tab data
      tabs: {
        type: Array,
        default: () => []
      },

      // Whether to restore tabs after page refresh
      restore: {
        type: [Boolean, String],
        default: false
      },

      // Whether to monitor "restoreKey" changes and automatically restore the tab
      restoreWatch: {
        type: Boolean,
        default: false
      },

      // Page scroll element selector
      pageScroller: {
        type: String,
        default: '.router-tab__container'
      },

      // Default page
      defaultPage: [String, Object],

      // Tab transition effect
      tabTransition: {
        type: [String, Object],
        default: 'router-tab-zoom'
      },

      // Page transition effect
      pageTransition: {
        type: [String, Object],
        default: () => ({
          name: 'router-tab-swap',
          mode: 'out-in'
        })
      },

      /**
       * Customize the context menu
       * 1. Disable when "false"
       * 2. The context menu can be customized when it is an array
       */
      contextmenu: {
        type: [Boolean, Array],
        default: true
      },

      contextmenuPinned: {
        type: Array,
        default: () => []
      },

      // Whether to support tab drag and drop sorting
      dragsort: {
        type: Boolean,
        default: true
      },

      // New tab insertion position, "last" end, "next" next
      append: {
        type: String,
        default: 'last'
      },

      // Whether to keep the last tab from being closed
      keepLastTab: {
        type: Boolean,
        default: true
      },

      // Whether to cache by default, it can be reset by routing "meta.keepAlive"
      keepAlive: {
        type: Boolean,
        default: true
      },

      // Maximum number of caches, 0 is unlimited
      maxAlive: {
        type: Number,
        default: 0
      },

      // Whether to reuse routing components, which can be reset by routing "meta.reuse"
      reuse: {
        type: Boolean,
        default: false
      },

      // Tab internationalization configuration i18n (key, [args])
      i18n: Function,

      /**
       * Component language
       * - When it is a string, optional values: 'zh'-Chinese, 'en'-English
       * - When it is an object, you can set a custom language
       * - Default: 'auto'. Component language is automatically recognized based on browser language.
       */
      lang: {
        type: [String, Object],
        default: 'auto'
      },

      // Allow list of hostnames
      allowList: {
        type: Array,
        default: () => []
      }
    },

    data() {
      return {
        items: [], // Tab items
        onDragSort: false, // Drag and drop sorting
        aliveReady: false, // RouterAlive initialization
        routerAlive: null
      }
    },

    computed: {
      pinnedGroup() {
        return this.items.filter(tab => tab.pinned)
      },

      commonGroup() {
        return this.items.filter(tab => !tab.pinned)
      },

      // Router alive
      $alive() {
        return this.aliveReady ? this.routerAlive : null
      },

      // Currently activated tab id
      activeTabId() {
        return this.$alive ? this.$alive.key : null
      },

      // Currently active tab index
      activeTabIndex() {
        return this.items.findIndex(item => item.id === this.activeTabId)
      },

      // Currently active tab
      activeTab() {
        return this.items[this.activeTabIndex]
      },

      // Root path
      basePath() {
        return this.$alive ? this.$alive.basePath : '/'
      },

      // Default path
      defaultPath() {
        return this.defaultPage || this.basePath || '/'
      },

      // Tab transition
      tabTrans() {
        return getTransOpt(this.tabTransition)
      },

      // Page transition
      pageTrans() {
        return getTransOpt(this.pageTransition)
      }
    },

    created() {
      // Add to prototype chain
      this.$.appContext.config.globalProperties.$tabs = this
    },

    unmounted() {
      const proto = this.$.appContext.config.globalProperties
      // Cancel prototype mounting
      if (proto.$tabs === this) {
        proto.$tabs = null
      }
    },

    methods: {
      // RouterAlive component ready
      onAliveReady($alive) {
        // Get keepAlive component instance
        this.routerAlive = $alive
        this.aliveReady = true
        this.initTabs()
      },

      // Initial tab data
      initTabs() {
        if (this.restoreTabs()) return

        this.presetTabs()
      },

      // Default tab
      presetTabs(tabs = this.tabs) {
        let ids = {}

        this.items = tabs
          .map(item => {
            item = typeof item === 'string' ? { to: item } : item || emptyObj

            const matched = item.to && this.matchRoute(item.to)

            if (matched) {
              const tab = this.getRouteTab(matched)
              const id = tab.id

              // Remove duplicates based on id
              if (!ids[id]) {
                // id is not allowed to change
                delete item.id

                // Initial tab data
                return (ids[id] = Object.assign(tab, item))
              }
            }
          })
          .filter(item => !!item)
      },

      // RouterAlive synchronizes tab changes when cache is updated
      onAliveChange(type, matched) {
        const { items, lastMatchedKey } = this
        const { key } = matched
        const matchIdx = items.findIndex(({ id }) => id === key)
        const item = this.getRouteTab(matched)

        // Tab already exists
        if (matchIdx > -1) {
          if (
            type === 'create' || // Create cache
            (type === 'update' && items[matchIdx].to !== matched.$route.fullPath) // The cache is updated and the address changes
          ) {
            // Replace original tab
            items[matchIdx] = item
          }
        } else {
          // Add new tab
          if (this.append === 'next' && lastMatchedKey !== undefined) {
            const lastIndex = this.items.findIndex(item => item.id === lastMatchedKey)
            items.splice(lastIndex + 1, 0, item)
          } else {
            items.push(item)
          }
        }

        // Last cached key
        this.lastMatchedKey = key
      },

      // Get tab configuration from route
      getRouteTab({ key, $route, meta }) {
        const tab = { ...meta }

        // Supports tab properties returned by routing functions
        const props = ['title', 'tips', 'icon', 'closable', 'nodrag', 'pinned']

        for (let i in tab) {
          if (props.includes(i)) {
            const val = tab[i]
            if (typeof val === 'function') {
              tab[i] = val($route)
            }
          }
        }

        return Object.assign(tab, {
          id: key,
          to: $route.fullPath
        })
      },

      // Reload route view
      async reload() {
        this.$alive.reload()
      },

      // Match routing information
      matchRoute($route) {
        return this.$alive.matchRoute($route)
      },

      // Get route cache key
      getRouteKey(route = this.$route) {
        return this.matchRoute(route).key
      },

      // Match tag id from routing address
      getIdByPath(path, match = true) {
        if (!path) return

        const matched = this.matchRoute(path)
        const { key } = matched

        if (match) {
          // Routing address exact match tab
          const matchTab = this.items.find(({ to }) => prunePath(to) === prunePath(matched.$route.fullPath))

          if (matchTab) {
            return key
          }
        }

        return key
      },

      // Emit tab events
      onTabEvent(type, data) {
        this.$emit(`on-${type}`, data)
      }
    }
  }

  export default RouterTab
</script>
