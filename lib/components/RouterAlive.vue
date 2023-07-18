<template>
  <div class="router-alive">
    <router-view
      ref="page"
      :class="pageClass"
      v-slot="{ Component }"
    >
      <transition
        v-bind="pageTrans"
        appear
        @after-enter="onTrans('enter')"
        @after-leave="onTrans('leave')"
      >
        <keep-alive v-if="alive" ref="keepAlive" :max="max" :exclude="keepAliveExclude">
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
        <component v-else :is="Component" ref="alive" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { mapGetters, getTransOpt, getCtorId } from '../util'
import RouteMatch from '../util/RouteMatch'

/**
 * 路由缓存控件
 */
export default {
  name: 'RouterAlive',

  provide() {
    // 提供实例给子组件调用
    return {
      RouterAlive: this
    }
  },

  props: {
    // 默认是否开启缓存
    keepAlive: {
      type: Boolean,
      default: false
    },

    // 是否复用路由组件
    reuse: {
      type: Boolean,
      default: false
    },

    // 최대 캐시 수, 0은 무제한입니다.
    max: {
      type: Number,
      default: 0
    },

    // 页面 class
    pageClass: {
      type: [Array, Object, String],
      default: 'router-alive-page'
    },

    // 页面滚动元素选择器
    pageScroller: {
      type: String,
      default: ''
    },

    // 过渡效果
    transition: {
      type: [String, Object]
    },
  },

  emits: ['ready', 'change'],
  
  data() {
    // 캐시 레코드
    this.cache = {}

    return {
      // 路由匹配信息
      routeMatch: new RouteMatch(this),

      // 是否正在更新
      onRefresh: false,

      keepAliveExclude: null,
      keepAliveExcludeIndex: 1
    }
  },

  computed: {
    // 从 this.routeMatch 提取计算属性
    ...mapGetters('routeMatch', [
      'key',
      'meta',
      'nest',
      'alive',
      'reusable',
      'basePath',
      'alivePath'
    ]),

    // 页面过渡
    pageTrans() {
      return getTransOpt(this.transition)
    }
  },

  watch: {
    // 监听路由
    $route: {
      handler($route, old) {
        // 구성 요소 준비
        if (!old) this.$emit('ready', this)

        if (!$route.matched.length) return

        const { key, alive, reusable, alivePath, nest } = this
        const cacheItem = this.cache[key] || {}
        let {
          alivePath: cacheAlivePath,
          fullPath: cacheFullPath,
          vm: cacheVM
        } = cacheItem

        // 재사용되지 않고 경로가 변경되는 경우 구성 요소 캐시를 정리합니다.
        if (cacheAlivePath && !reusable && cacheAlivePath !== alivePath) {
          cacheAlivePath = ''
          this.refresh(key)
        }

        // 嵌套路由，地址跟缓存不一致
        if (nest && cacheVM && $route.fullPath !== cacheFullPath) {
          const oldKey = this.matchRoute(old).key
          if (oldKey !== key) {
            this.nestForceUpdate = true
          }
        }

        // 类型：更新或者新建缓存
        const type = cacheAlivePath ? 'update' : 'create'

        this.$emit('change', type, this.routeMatch)

        // 更新缓存路径
        if (alive) {
          cacheItem.fullPath = $route.fullPath
        }
      },

      immediate: true
    }
  },

  // 销毁后清理
  unmounted() {
    this.cache = null
    this.routeMatch = null
    this._match = null
  },

  methods: {
    // 移除缓存
    async remove(key = this.key) {
      const $alive = this.$refs.alive

      if (!$alive) return

      const cacheItem = this.cache[key]

      // 캐시 구성 요소 인스턴스를 삭제하고 RouterAlive 캐시 레코드를 지웁니다.
      if (cacheItem) {
        // console.log('remove', key, cacheItem.vm.type.__name, cacheItem.vm.type.name, cacheItem.vm)
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

    // 刷新
    refresh(key = this.key) {
      this.remove(key)

      // 非当前缓存，直接移除
      if (key === this.key) {
        this.reload()
      }
    },

    // 重新加载
    reload() {
      if (this.onRefresh) return

      this.onRefresh = true
    },

    // 缓存页面组件钩子
    pageHook(hook) {
      const handler = this[`pageHook:${hook}`]
      if (typeof handler === 'function') handler()
    },

    // 页面创建
    pageHookCreated() {
      this.cache[this.key] = {
        alivePath: this.alivePath,
        fullPath: this.$route.fullPath
      }
    },

    // 页面挂载
    pageHookMounted(target) {
      if (this.cache[this.key]) {
        this.cache[this.key].vm = target

        // 重置初始滚动位置
        this.resetScrollPosition()
      } else {
        this.cache[this.key] = {
          alivePath: this.alivePath,
          fullPath: this.$route.fullPath,
          vm: target
        }
      }
    },

    // 页面激活
    pageHookActivated(target) {
      const pageVm = this.$refs.page

      // 热重载更新
      if (this.checkHotReloading(target, 'activated')) return

      // 嵌套路由缓存导致页面不匹配时强制更新
      if (this.nestForceUpdate) {
        delete this.nestForceUpdate
        pageVm.$forceUpdate()
      }

      // 还原滚动位置
      this.restoreScrollPosition(target)
    },

    // 页面失活
    pageHookDeactivated(target) {
      if (this.checkHotReloading(target, 'deactivated')) return

      // 保存滚动位置
      this.saveScrollPosition(target)
    },

    // 页面销毁后清理 cache
    async pageHookUnmounted() {
      await this.$nextTick()

      if (!this.cache) return

      // 清理已销毁页面的缓存信息
      Object.entries(this.cache).forEach(([key, item]) => {
        const { vm } = item || {}
        if (vm && vm._isDestroyed) {
          this.remove(key)
        }
      })
    },

    // 页面过渡后结束刷新状态
    onTrans(from) {
      if (this.onRefresh) {
        this.onRefresh = false
        this.$emit('change', 'create', this.routeMatch)
      }
    },

    // 匹配路由信息
    matchRoute($route) {
      const matched = this._match

      // 当前路由
      if (
        $route === this.$route ||
        $route.fullPath === this.$route.fullPath ||
        $route === this.$route.fullPath
      ) {
        return this.routeMatch
      }

      if (matched) {
        matched.$route = $route
        return matched
      }

      return (this._match = new RouteMatch(this, $route))
    },

    // 핫 리로드 감지
    checkHotReloading(target, from) {
      const lastCid = target._lastCtorId
      const cid = (target._lastCtorId = getCtorId(target))

      // 热重载更新
      if (lastCid && lastCid !== cid) {
        this.refresh()
        return true
      }

      return false
    },

    // 获取滚动元素
    getScroller(selector) {
      return selector.startsWith('$')
        ? document.querySelector(selector.replace(/^\$/, ''))
        : this.$el.querySelector(selector)
    },

    // 스크롤 위치 저장
    saveScrollPosition(target) {
      // 페이지 내부에 구성된 스크롤 요소
      let pageScroller = target.$options.pageScroller

      if (typeof pageScroller === 'string' && pageScroller.length) {
        pageScroller = pageScroller.split(/\s?,\s?/)
      }

      if (!Array.isArray(pageScroller)) {
        pageScroller = []
      }

      // 기본적으로 페이지 루트 노드 위치 저장
      pageScroller.push('.' + this.pageClass)

      // 전역 스크롤 요소 구성 추가
      // 구성 요소 외부 선택자는 $ 접두사를 사용하여 구분됩니다.
      if (this.pageScroller) {
        pageScroller.push('$' + this.pageScroller)
      }

      // 기록 위치
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

    // 스크롤 위치 복원
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

    // 전역 스크롤 위치 재설정
    resetScrollPosition() {
      if (!this.pageScroller) return

      const el = this.getScroller('$' + this.pageScroller)

      if (!el) return

      el.scrollLeft = 0
      el.scrollTop = 0
    },

    // 페이지 데이터가 성공적으로 로드되었습니다.
    async onPageLoaded() {
      await this.$nextTick()
      // 페이지 데이터가 성공적으로 로드된 후 스크롤 위치 복원
      this.restoreScrollPosition()
    }
  }
}
</script>