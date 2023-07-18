<template>
  <router-tab
    page-scroller=".router-tab__container"
    :tabs="[
      '/page-scroller/page/1',
      '/page-scroller/scroll-position',
      '/page-scroller/scroll-multi',
      '/page-scroller/scroll-async'
    ]"
    :routeIndex="routeIndex"
  />
</template>

<script setup>
import { ref, inject } from 'vue'
import { viewDepthKey } from 'vue-router'

const routeIndex = inject(viewDepthKey)
</script>