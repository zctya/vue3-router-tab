export default {
  data() {
    return {
      // Is it full screen?
      fullscreen: false
    }
  },

  watch: {
    // Update scroll after toggling fullscreen
    async fullscreen() {
      await this.$nextTick()
      this.$tabs.adjust()
    }
  }
}
