<template>
  <router-tab :class="{ 'is-fullscreen': fullscreen }">
    <!-- Start of tab -->
    <template #start>
      <router-link
        class="tab-slot-icon rt-icon-home"
        to="/slot/"
        title="Home page"
      />
    </template>

    <!-- End of tab -->
    <template #end>
      <a
        class="tab-slot-icon"
        :class="fullscreen ? 'rt-icon-fullscreen-exit' : 'rt-icon-fullscreen'"
        :title="fullscreen ? 'Exit full screen mode' : 'Full screen'"
        @click="fullscreen = !fullscreen"
      />
    </template>

    <!-- Page tab item slot -->
    <template #default="tab">
      <i
        v-if="tab.icon"
        class="router-tab__item-icon"
        :class="tab.icon"
      />
      <span
        class="router-tab__item-title"
        :title="tab.tips"
      >
        {{ tab.title }}
      </span>
      <span class="tab-badge">{{ tab.index }}</span>
      <i
        v-if="tab.closable"
        class="router-tab__item-close"
        @click.prevent="tab.close"
      />
    </template>
  </router-tab>
</template>

<script>
  // Introducing full screen mixins
  import fullscreen from '../../mixins/fullscreen'

  export default {
    mixins: [fullscreen]
  }
</script>

<style lang="scss" scoped>
  .tab-badge {
    $s: 1.2em;
    display: inline-block;
    width: $s;
    height: $s;
    margin-left: 3px;
    color: #fff;
    font-size: 12px;
    line-height: $s;
    text-align: center;
    vertical-align: super;
    background-color: #f80;
    border-radius: 100%;
  }

  .router-tab__item.is-active .tab-badge {
    background-color: #f50;
  }

  // Slot styles before and after tabs
  .router-tab {
    :deep(.router-tab__slot-start),
    :deep(.router-tab__slot-end) {
      display: flex;
      align-items: center;
    }
  }

  .tab-slot-icon {
    margin: 0 5px;
    color: #2c3e50;
    font-size: 20px;
    text-decoration: none;
    cursor: pointer;

    &:active {
      opacity: 0.8;
    }
  }
</style>
