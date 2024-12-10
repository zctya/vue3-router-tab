<template>
  <p>
    You opened this page
    <strong class="text-strong">{{ pageTime }}</strong> seconds ago
  </p>
</template>

<script>
  // Page timer
  export default {
    name: 'PageTimer',

    data() {
      return {
        openTime: new Date(),
        pageTime: 0
      }
    },

    mounted() {
      this.updatePageTime()
    },

    activated() {
      this.updatePageTime()
    },

    deactivated() {
      this.clearPageTimer()
    },

    beforeUnmounted() {
      this.clearPageTimer()
    },

    methods: {
      calcPageTime() {
        this.pageTime = Math.floor((new Date() - this.openTime) / 1000)
      },

      updatePageTime() {
        this.calcPageTime()

        this.clearPageTimer()

        // Scheduled update events
        this.pageTimer = setInterval(this.calcPageTime, 1000)
      },

      clearPageTimer() {
        clearInterval(this.pageTimer)
      }
    }
  }
</script>
