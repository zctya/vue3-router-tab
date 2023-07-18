<template>
  <RouterLink :to="to" custom >
    <template #default="{ navigate }">
      <li
        :class="classList"
        :draggable="$tabs.dragsort"
        @click="navigate"
        @dragstart="onDragStart"
        @dragend="onDragEnd"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="() => (isDragOver = false)"
        @drop.stop.prevent="onDrop"
        @click.middle="() => closable && close()"
        @contextmenu.prevent="e => $emit('contextmenu', e)"
      >
        <i v-if="icon" :class="['router-tab__item-icon', icon]" />
        <span class="router-tab__item-title" :title="tips">
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

// 拖拽传输数据前缀
const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

// 排序拖拽数据
// 用以解决双核浏览器兼容模式下无法通过 dataTransfer.getData 获取数据
let dragSortData = null

// 页签项
// @vue/component
export default {
  name: 'TabItem',
  inject: ['$tabs'],

  props: {
    // 页签原始数据，方便 slot 插槽自定义数据
    data: {
      type: Object,
      required: true
    },

    // 页签项索引
    index: Number
  },

  data() {
    return {
      onDragSort: false, // 是否正在拖拽
      isDragOver: false // 是否拖拽经过
    }
  },

  emits: ['contextmenu'],

  computed: {
    // 从 this.data 提取计算属性
    ...mapGetters('data', ['id', 'to', 'icon', 'tabClass', 'target', 'href']),

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

    // 国际化
    i18nText() {
      return this.$tabs.i18nText
    },

    // 未命名页签
    untitled() {
      return this.$tabs.langs.tab.untitled
    },

    // 页签标题
    title() {
      return this.i18nText(this.data.title) || this.untitled
    },

    // 页签提示
    tips() {
      return this.i18nText(this.data.tips || this.data.title) || this.untitled
    },

    // 是否可关闭
    closable() {
      const { keepLastTab, items } = this.$tabs
      return this.data.closable !== false && !(keepLastTab && items.length < 2)
    }
  },

  methods: {
    // 关闭当前页签
    close() {
      this.$tabs.closeTab(this.id)
    },

    // 拖拽
    onDragStart(e) {
      this.onDragSort = this.$tabs.onDragSort = true
      dragSortData = TRANSFER_PREFIX + this.index
      e.dataTransfer.setData('text', dragSortData)
      e.dataTransfer.effectAllowed = 'move'
    },

    // 拖拽悬浮
    onDragOver(e) {
      this.isDragOver = true
      e.dataTransfer.dropEffect = 'move'
    },

    // 拖拽结束
    onDragEnd() {
      this.onDragSort = this.$tabs.onDragSort = false
      dragSortData = null
    },

    // 释放后排序
    onDrop(e) {
      const { items } = this.$tabs
      const raw = e.dataTransfer.getData('text') || dragSortData

      this.isDragOver = false

      if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

      const fromIndex = raw.replace(TRANSFER_PREFIX, '')
      const tab = items[fromIndex]

      items.splice(fromIndex, 1)
      items.splice(this.index, 0, tab)
    }
  }
}
</script>