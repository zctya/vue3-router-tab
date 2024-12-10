<template>
  <RouterLink
    :to="to"
    custom
  >
    <template #default="{ navigate }">
      <li
        :class="classList"
        :draggable="$tabs.dragsort && !nodrag && (pinned ? allowDragPinned : true)"
        @click="navigate"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="() => (isDragOver = false)"
        @drop.stop.prevent="onDrop"
        @click.middle="() => closable && (pinned ? allowClosePinned : true) && close()"
        @contextmenu.prevent="e => $emit('contextmenu', e)"
      >
        <i
          v-if="icon"
          :class="['router-tab__item-icon', icon]"
        />
        <span
          v-if="!(pinned && hideTitlePinned)"
          class="router-tab__item-title"
          :title="tips"
        >
          {{ title }}
        </span>
        <i
          v-if="closable"
          class="router-tab__item-close"
          @click.prevent.stop="close"
        />
      </li>
    </template>
  </RouterLink>
</template>

<script>
  import { mapGetters } from '../util'

  // Drag transfer data prefix
  const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

  // Sort drag data
  // To solve the problem that data cannot be obtained through dataTransfer.getData in dual-core browser compatibility mode
  let dragSortData = null

  // Tab Item
  // @vue/component
  export default {
    name: 'TabItem',

    inject: ['$tabs', 'allowDragPinned', 'allowClosePinned', 'hideTitlePinned'],

    props: {
      // Original data of the tab, convenient for slot to customize data
      data: {
        type: Object,
        required: true
      },

      // Tab item index
      index: Number
    },

    data() {
      return {
        onDragSort: false, // Is dragging in progress?
        isDragOver: false // Whether to drag through
      }
    },

    emits: ['contextmenu'],

    computed: {
      // Extract computed properties from this.data
      ...mapGetters('data', ['id', 'to', 'icon', 'tabClass', 'target', 'href', 'nodrag', 'pinned']),

      // class
      classList() {
        return [
          'router-tab__item',
          this.tabClass,
          {
            'is-active': this.$tabs.activeTabId === this.id,
            'is-closable': this.closable,
            'is-contextmenu': this.$tabs.contextData.id === this.id,
            'is-drag-over': this.isDragOver && !this.onDragSort
          }
        ]
      },

      // Internationalization
      i18nText() {
        return this.$tabs.i18nText
      },

      // Untitled tab
      untitled() {
        return this.$tabs.langs.tab.untitled
      },

      // Tab title
      title() {
        return this.i18nText(this.data.title) || this.untitled
      },

      // Tab tips
      tips() {
        return this.i18nText(this.data.tips || this.data.title) || this.untitled
      },

      // Can it be closed?
      closable() {
        const { keepLastTab, items } = this.$tabs
        return (this.pinned ? this.allowClosePinned : true) && this.data.closable !== false && !(keepLastTab && items.length < 2)
      },

      unpinnable() {
        return this.data.unpinnable != false ? true : false
      }
    },

    methods: {
      // Close current tab
      close() {
        this.$tabs.closeTab(this.id)
      },

      // Drag
      onDragStart(e) {
        if (this.nodrag) return

        this.onDragSort = this.$tabs.onDragSort = true
        dragSortData = TRANSFER_PREFIX + this.index
        e.dataTransfer.setData('text', dragSortData)
        e.dataTransfer.effectAllowed = 'all'
      },

      // Drag and drop
      onDragOver(e) {
        const { items } = this.$tabs
        const raw = e.dataTransfer.getData('text') || dragSortData

        this.isDragOver = false

        if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

        const fromIndex = raw.replace(TRANSFER_PREFIX, '')
        const tab = items[fromIndex]

        this.isDragOver = true

        if (this.nodrag || tab.pinned !== this.pinned) {
          e.dataTransfer.dropEffect = 'none'
        } else {
          e.dataTransfer.dropEffect = 'move'
        }
      },

      // Drag ends
      onDragEnd() {
        if (this.nodrag) return

        this.onDragSort = this.$tabs.onDragSort = false
        dragSortData = null
      },

      // Sort by release
      onDrop(e) {
        if (this.nodrag) return

        const { items } = this.$tabs
        const raw = e.dataTransfer.getData('text') || dragSortData

        this.isDragOver = false

        if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

        const fromIndex = raw.replace(TRANSFER_PREFIX, '')
        const tab = items[fromIndex]
        if (tab.pinned === this.pinned) {
          items.splice(fromIndex, 1)
          items.splice(this.index, 0, tab)
        }
      }
    }
  }
</script>
