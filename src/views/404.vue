<template>
  <div
    class="page-404"
    :class="{
      'global-404': $route.path === '/404'
    }"
  >
    <div>
      <h2>Page not found!!!</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .global-404 {
    padding: 15px;
  }
</style>
