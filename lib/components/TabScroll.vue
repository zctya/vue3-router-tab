<template>
  <div
    class="router-tab__scroll"
    @wheel.prevent="onWheel"
    @mouseenter="update"
  >
    <div
      ref="container"
      class="router-tab__scroll-container"
      :class="{ 'is-mobile': isMobile }"
      @scroll="update"
    >
      <slot />
    </div>

    <div
      v-show="hasScroller"
      ref="bar"
      class="router-tab__scrollbar"
      :class="{ 'is-dragging': dragData }"
    >
      <div
        ref="thumb"
        class="router-tab__scrollbar-thumb"
        :style="{
          width: `${thumbWidth}px`,
          transform: `translateX(${thumbLeft}px`
        }"
        @mousedown.prevent="onDragStart"
      />
    </div>
  </div>
</template>

<script>
  import { scrollTo, scrollIntoView, getScrollbarWidth } from '../util'

  // Scrollbars
  export default {
    name: 'TabScroll',

    props: {
      // Scroll distance per time
      space: {
        type: Number,
        default: 300
      }
    },

    data() {
      return {
        isMobile: false, // Is it mobile?

        scrollData: {
          clientWidth: 0,
          scrollWidth: 0,
          scrollLeft: 0
        },

        dragData: null
      }
    },

    computed: {
      // Whether there is a scroll bar
      hasScroller() {
        return !this.isMobile && !this.$tabs.onDragSort && this.scrollData.scrollWidth > this.scrollData.clientWidth
      },

      // Thumb width
      thumbWidth() {
        if (!this.hasScroller) return

        const { clientWidth, scrollWidth } = this.scrollData
        return (clientWidth / scrollWidth) * clientWidth
      },

      // Thumb left
      thumbLeft() {
        if (!this.hasScroller) return

        // Drag and scroll
        if (this.dragData) {
          return this.dragData.thumbLeft
        }

        const { clientWidth, scrollWidth, scrollLeft } = this.scrollData

        return (clientWidth - this.thumbWidth) * (scrollLeft / (scrollWidth - clientWidth))
      }
    },

    mounted() {
      this.update()
    },

    methods: {
      // Update scrolling data
      update() {
        const { container } = this.$refs

        if (!container) return

        const { clientWidth, scrollWidth, scrollLeft } = container

        // Determine whether it is a mobile terminal
        // The userAgent contains the mobile field, or the browser scroll bar width is 0
        this.isMobile = /mobile/i.test(navigator.userAgent) || !getScrollbarWidth()

        Object.assign(this.scrollData, { clientWidth, scrollWidth, scrollLeft })
      },

      // Scroll to the specified position
      scrollTo(left, smooth = true) {
        scrollTo({ wrap: this.$refs.container, left, smooth })
      },

      // Scroll to element
      scrollIntoView(el) {
        scrollIntoView({ el, wrap: this.$refs.container, inline: 'center' })
      },

      // Determine whether the child node is completely in the visible area
      isInView(el) {
        const { container } = this.$refs
        const offsetLeft = el.offsetLeft
        const scrollLeft = container.scrollLeft

        if (offsetLeft < scrollLeft || offsetLeft + el.clientWidth > scrollLeft + container.clientWidth) {
          return false
        }

        return true
      },

      // Mouse scrolling on tabs
      onWheel(e) {
        const now = +new Date()
        const enable = now - (this.lastWheel || 0) > 100

        if (!enable) return

        this.lastWheel = now

        const { space } = this
        const isWheelUp = e.deltaY < 0

        this.scrollTo(this.$refs.container.scrollLeft + (isWheelUp ? -space : space))
      },

      // Drag
      onDragStart(e) {
        const { thumbLeft } = this

        this.dragData = {
          startPageX: e.pageX,
          startScrollLeft: this.$refs.container.scrollLeft,
          startThumbLeft: thumbLeft,
          thumbLeft
        }

        document.addEventListener('mousemove', this.onDragMove)
        document.addEventListener('mouseup', this.onDragEnd)
      },

      // Drag to move
      onDragMove(e) {
        const { dragData, thumbWidth } = this
        const { clientWidth, scrollWidth } = this.scrollData
        let thumbLeft = dragData.startThumbLeft + e.pageX - dragData.startPageX
        const maxThumbLeft = clientWidth - thumbWidth

        if (thumbLeft < 0) {
          thumbLeft = 0
        } else if (thumbLeft > maxThumbLeft) {
          thumbLeft = maxThumbLeft
        }

        // Update thumb positioning
        dragData.thumbLeft = thumbLeft

        // Scroll
        this.scrollTo((thumbLeft * (scrollWidth - clientWidth)) / (clientWidth - thumbWidth), false)

        e.preventDefault()
      },

      // Drag ends
      onDragEnd(e) {
        this.dragData = null

        document.removeEventListener('mousemove', this.onDragMove)
        document.removeEventListener('mouseup', this.onDragEnd)

        e.preventDefault()
      }
    }
  }
</script>
