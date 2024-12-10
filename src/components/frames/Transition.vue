<template>
  <router-tab
    page-transition="page-fade"
    tab-transition="tab-scale"
  />
</template>

<style lang="scss" scoped>
  // Page fade transition
  :deep(.page-fade-enter-active),
  :deep(.page-fade-leave-active) {
    transition: opacity 0.5s;
  }

  :deep(.page-fade-enter),
  :deep(.page-fade-leave-to) {
    opacity: 0;
  }

  // Tab scale transition
  :deep(.tab-scale-enter-active),
  :deep(.tab-scale-leave-active) {
    transition: opacity 0.5s, transform 0.5s;
  }

  :deep(.tab-scale-enter),
  :deep(.tab-scale-leave-to) {
    transform: scale(1.5);
    opacity: 0;
  }
</style>
