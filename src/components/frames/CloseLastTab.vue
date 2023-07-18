<template>
  <router-tab :keep-last-tab="false" :routeIndex="routeIndex" />
</template>

<script setup>
import { ref, inject } from 'vue'
import { viewDepthKey } from 'vue-router'

const routeIndex = inject(viewDepthKey)
</script>