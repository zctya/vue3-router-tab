<template>
  <router-tab :restore="restoreKey" restore-watch :routeIndex="routeIndex" />
</template>

<script>
export default {
  data() {
    return {
      restoreKey: undefined
    }
  },

  mounted() {
    // 动态更新 restoreKey 后，组件会自动还原页签数据
    setTimeout(() => {
      this.restoreKey = '12312312'
    }, Math.random() * 1000)
  }
}
</script>

<script setup>
import { ref, inject } from 'vue'
import { viewDepthKey } from 'vue-router'

const routeIndex = inject(viewDepthKey)
</script>