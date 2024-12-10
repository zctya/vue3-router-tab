<template>
  <router-tab
    @iframe-mounted="iframeMounted"
    @iframe-loaded="iframeLoaded"
  />
</template>

<script>
  export default {
    methods: {
      // iframe mounted
      iframeMounted(url, iframe) {
        // eslint-disable no-console
        console.log('iframe-mounted:', url, iframe.contentWindow)
      },

      // iframe content loaded successfully
      iframeLoaded(url, iframe) {
        // eslint-disable no-console
        console.log('iframe-loaded:', url, iframe.contentWindow)
      }
    }
  }
</script>
