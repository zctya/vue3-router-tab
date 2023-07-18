<template>
  <router-tab :lang="'en'" :routeIndex="routeIndex" />
</template>

<script>
export default {
  name: 'Language',
  data() {
    return {
      lang: {
        tab: {
          untitled: 'Untitled Page'
        },

        contextmenu: {
          refresh: 'Refresh This',
          refreshAll: 'Refresh All',
          close: 'Close This',
          closeLefts: 'Close to the Left',
          closeRights: 'Close to the Right',
          closeOthers: 'Close Others'
        },

        msg: {
          keepLastTab: 'Keep at least 1 tab'
        }
      }
    }
  }
}
</script>

<script setup>
import { ref, inject } from 'vue'
import { viewDepthKey } from 'vue-router'

const routeIndex = inject(viewDepthKey)
</script>