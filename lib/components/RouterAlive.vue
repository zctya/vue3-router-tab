<template>
  <div
    class="router-alive"
    @drop="onDrop($event)"
    @dragover.prevent="onDragOver($event)"
    @dragenter.prevent
  >
    <router-view
      ref="page"
      :class="pageClass"
      v-slot="{ Component }"
    >
      <keep-alive
        v-if="alive"
        ref="keepAlive"
        :max="max"
        :exclude="keepAliveExclude"
      >
        <component
          v-if="!onRefresh"
          :is="Component"
          :key="key"
          ref="alive"
          @vue:created="pageHookCreated"
          @vue:mounted="pageHookMounted"
          @vue:activated="pageHookActivated"
          @vue:deactivated="pageHookDeactivated"
          @vue:unmounted="pageHookUnmounted"
          @page-loaded="onPageLoaded"
        />
      </keep-alive>

      <component
        v-else
        :is="Component"
        ref="alive"
      />
    </router-view>
  </div>
</template>

<script>
  import { mapGetters, getTransOpt, getCtorId } from '../util'
  import RouteMatch from '../util/RouteMatch'

  const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

  /**
   * Route cache control
   */
  export default {
    name: 'RouterAlive',

    inject: ['onTabEvent'],

    provide() {
      // Provide an instance to the child component to call
      return {
        RouterAlive: this
      }
    },

    props: {
      // Is caching enabled by default?
      keepAlive: {
        type: Boolean,
        default: false
      },

      // Whether to reuse routing components
      reuse: {
        type: Boolean,
        default: false
      },

      // Maximum number of caches, 0 means no limit
      max: {
        type: Number,
        default: 0
      },

      // Page class
      pageClass: {
        type: [Array, Object, String],
        default: 'router-alive-page'
      },

      // Page scroll element selector
      pageScroller: {
        type: String,
        default: ''
      },

      // Transition effects
      transition: {
        type: [String, Object]
      }
    },

    emits: ['ready', 'change'],

    data() {
      // Cache records
      this.cache = {}

      return {
        // Route matching information
        routeMatch: new RouteMatch(this),

        // Is it updating?
        onRefresh: false,

        keepAliveExclude: null,
        keepAliveExcludeIndex: 1
      }
    },

    computed: {
      // Extract computed properties from this.routeMatch
      ...mapGetters('routeMatch', ['key', 'meta', 'nest', 'alive', 'reusable', 'basePath', 'alivePath']),

      // Page transition
      pageTrans() {
        return getTransOpt(this.transition)
      }
    },

    watch: {
      // Watch route
      $route: {
        handler($route, old) {
          // Component ready
          if (!old) this.$emit('ready', this)

          if (!$route.matched.length) return

          const { key, alive, reusable, alivePath, nest } = this
          const cacheItem = this.cache[key] || {}
          let { alivePath: cacheAlivePath, fullPath: cacheFullPath, vm: cacheVM } = cacheItem

          // If it is not reused and the route changes, the component cache is cleaned up
          if (cacheAlivePath && !reusable && cacheAlivePath !== alivePath) {
            cacheAlivePath = ''
            this.refresh(key)
          }

          // Nested routing, the address is inconsistent with the cache
          if (nest && cacheVM && $route.fullPath !== cacheFullPath) {
            const oldKey = this.matchRoute(old).key
            if (oldKey !== key) {
              this.nestForceUpdate = true
            }
          }

          // Type: update or new cache
          const type = cacheAlivePath ? 'update' : 'create'

          this.$emit('change', type, this.routeMatch)

          // Update cache path
          if (alive) {
            cacheItem.fullPath = $route.fullPath
          }
        },

        immediate: true
      }
    },

    // Cleaning up after unmounted
    unmounted() {
      this.cache = null
      this.routeMatch = null
      this._match = null
    },

    methods: {
      onDragOver(e) {
        e.dataTransfer.dropEffect = 'link'
      },

      onDrop(e) {
        const { items } = this.$tabs
        const raw = e.dataTransfer.getData('text')

        if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

        const fromIndex = raw.replace(TRANSFER_PREFIX, '')
        const tab = items[fromIndex]

        this.onTabEvent('drop-alive', { $tabs: this.$tabs, data: tab })
      },

      // Remove cache
      async remove(key = this.key) {
        const $alive = this.$refs.alive

        if (!$alive) return

        const cacheItem = this.cache[key]

        // Destroy the cache component instance and clean up the Router Alive cache records
        if (cacheItem) {
          let excludeName = cacheItem.vm.type.__name || cacheItem.vm.type.name
          if (!excludeName) {
            console.warn('missing name of component')
          }
          this.keepAliveExclude = excludeName
          cacheItem.vm = null
          this.cache[key] = null

          setTimeout(() => {
            this.keepAliveExclude = null
          }, 1000)
        }
      },

      // Refresh
      refresh(key = this.key) {
        this.remove(key)

        // Not the current cache, remove directly
        if (key === this.key) {
          this.reload()
        }
      },

      // Reload
      reload() {
        if (this.onRefresh) return

        this.onRefresh = true
      },

      // Cache page component hook
      pageHook(hook) {
        const handler = this[`pageHook:${hook}`]
        if (typeof handler === 'function') handler()
      },

      // Page creation
      pageHookCreated() {
        this.cache[this.key] = {
          alivePath: this.alivePath,
          fullPath: this.$route.fullPath
        }
      },

      // Page mounting
      pageHookMounted(target) {
        if (this.cache[this.key]) {
          this.cache[this.key].vm = target

          // Reset initial scroll position
          this.resetScrollPosition()
        } else {
          this.cache[this.key] = {
            alivePath: this.alivePath,
            fullPath: this.$route.fullPath,
            vm: target
          }
        }
      },

      // Page activation
      pageHookActivated(target) {
        const pageVm = this.$refs.page

        // Hot reload updates
        if (this.checkHotReloading(target, 'activated')) return

        // Nested routing cache causes forced update when page does not match
        if (this.nestForceUpdate) {
          delete this.nestForceUpdate
          pageVm.$forceUpdate()
        }

        // Restore scroll position
        this.restoreScrollPosition(target)
      },

      // Page deactivation
      pageHookDeactivated(target) {
        if (this.checkHotReloading(target, 'deactivated')) return

        // Save scroll position
        this.saveScrollPosition(target)
      },

      // Clean up cache after page unmounted
      async pageHookUnmounted() {
        await this.$nextTick()

        if (!this.cache) return

        // Clear cached information of destroyed pages
        Object.entries(this.cache).forEach(([key, item]) => {
          const { vm } = item || {}
          if (vm && vm._isDestroyed) {
            this.remove(key)
          }
        })
        if (this.onRefresh) {
          this.onRefresh = false
          this.$emit('change', 'create', this.routeMatch)
        }
      },

      // Match routing information
      matchRoute($route) {
        const matched = this._match

        // Current routes
        if ($route === this.$route || $route.fullPath === this.$route.fullPath || $route === this.$route.fullPath) {
          return this.routeMatch
        }

        if (matched) {
          matched.$route = $route
          return matched
        }

        return (this._match = new RouteMatch(this, $route))
      },

      // Detect hot reload
      checkHotReloading(target) {
        const lastCid = target._lastCtorId
        const cid = (target._lastCtorId = getCtorId(target))

        // Hot reload update
        if (lastCid && lastCid !== cid) {
          this.refresh()
          return true
        }

        return false
      },

      // Get the scroll element
      getScroller(selector) {
        return selector.startsWith('$') ? document.querySelector(selector.replace(/^\$/, '')) : this.$el.querySelector(selector)
      },

      // Save scroll position
      saveScrollPosition(target) {
        // Scroll elements configured inside the page
        let pageScroller = target.$options.pageScroller

        if (typeof pageScroller === 'string' && pageScroller.length) {
          pageScroller = pageScroller.split(/\s?,\s?/)
        }

        if (!Array.isArray(pageScroller)) {
          pageScroller = []
        }

        // The default save page root node location
        pageScroller.push('.' + this.pageClass)

        // Add global scroll element configuration
        // Component external selectors are distinguished by the $ prefix
        if (this.pageScroller) {
          pageScroller.push('$' + this.pageScroller)
        }

        // Recording location
        const position = pageScroller.reduce((pos, selector) => {
          const el = this.getScroller(selector)

          if (el) {
            pos[selector] = {
              left: el.scrollLeft,
              top: el.scrollTop
            }
          }

          return pos
        }, {})

        target._pageScrollPosition = position
      },

      // Restore scroll position
      restoreScrollPosition(target) {
        const position = target?._pageScrollPosition

        if (!position) return

        Object.entries(position).forEach(([selector, pos]) => {
          const el = this.getScroller(selector)
          if (el) {
            this.$nextTick(() => {
              el.scrollLeft = pos.left
              el.scrollTop = pos.top
            })
          }
        })
      },

      // Reset global scroll position
      resetScrollPosition() {
        if (!this.pageScroller) return

        const el = this.getScroller('$' + this.pageScroller)

        if (!el) return

        el.scrollLeft = 0
        el.scrollTop = 0
      },

      // Page data loaded successfully
      async onPageLoaded() {
        await this.$nextTick()
        // Restore scroll position after page data is loaded successfully
        this.restoreScrollPosition()
      }
    }
  }
</script>
