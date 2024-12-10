<template>
  <div>
    <h2>Dynamic tab</h2>

    <div class="form-item">
      <label>
        <p>Modify tab title</p>
        <input
          v-model="routeTab.title"
          type="text"
        />
      </label>
    </div>

    <div class="form-item">
      <label>
        <p>Modify tab tips</p>
        <input
          v-model="routeTab.tips"
          type="text"
        />
      </label>
    </div>

    <div class="form-item tab-icons">
      <p>Toggle icon</p>
      <a
        v-for="icon in icons"
        :key="icon"
        class="tab-icon"
        :class="`${icon === routeTab.icon ? 'is-active' : ''} ${icon}`"
        title="Set tab icon"
        @click="routeTab.icon = icon"
      />
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        routeTab: {
          title: 'Dynamic tab',
          icon: 'rt-icon-log',
          tips: ''
        },

        icons: ['rt-icon-log', 'rt-icon-doc', 'rt-icon-contact']
      }
    }
  }
</script>

<style lang="scss" scoped>
  .form-item {
    margin-bottom: 1rem;

    p {
      margin: 0.5em 0;
    }
  }

  .tab-icons {
    a {
      margin-right: 1em;
      font-size: 20px;
      cursor: pointer;

      &.is-active {
        color: $color;
      }
    }
  }
</style>
