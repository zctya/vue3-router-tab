<template>
  <router-tab
    :restore="restoreKey"
    restore-watch
  />
</template>

<script>
  export default {
    data() {
      return {
        restoreKey: undefined
      }
    },

    mounted() {
      // After dynamically updating restoreKey, the component will automatically restore the tab data.
      setTimeout(() => {
        this.restoreKey = '12312312'
      }, Math.random() * 1000)
    }
  }
</script>
