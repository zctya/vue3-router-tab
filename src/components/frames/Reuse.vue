<template>
  <router-tab reuse :routeIndex="routeIndex" />
</template>

<script setup>
import { ref, inject } from 'vue'
import { viewDepthKey } from 'vue-router'

const routeIndex = inject(viewDepthKey)
</script>