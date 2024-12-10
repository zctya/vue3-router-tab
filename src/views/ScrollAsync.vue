<script>
  import ScrollPosition from './ScrollPosition.vue'

  export default {
    name: 'ScrollAsync',

    extends: ScrollPosition,

    emits: ['page-loaded'],

    activated() {
      this.list = []
      this.loading = true

      setTimeout(() => {
        this.list = new Array(100)
        this.loading = false
        // Pages that load data asynchronously need to throw an event "page-loaded" after the data is loaded successfully.
        this.$emit('page-loaded')
      }, Math.random() * 1000)
    }
  }
</script>
