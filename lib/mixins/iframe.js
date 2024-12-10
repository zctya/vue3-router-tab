// Iframe tab
export default {
  data() {
    return {
      iframes: [],
      currentIframe: null,
      iframeNamePrefix: 'RouterTabIframe-'
    }
  },

  methods: {
    // Get the Iframe tab routing path
    getIframePath(src, title = null, icon = null) {
      let path = `${this.basePath}/iframe/`.replace(/\/+/g, '/') + encodeURIComponent(src)

      if (title) {
        path += '/' + title

        if (icon) path += '/' + icon
      }

      return path
    },

    // Open the Iframe tab
    openIframe(src, title, icon) {
      let path = this.getIframePath(src, title, icon)
      this.$router.push(path)
    },

    // Close Iframe tab
    closeIframe(src) {
      let path = this.getIframePath(src)
      this.close({
        path,
        match: false
      })
    },

    // Refresh Iframe tab
    refreshIframe(src) {
      let path = this.getIframePath(src)
      this.refresh(path, false)
    },

    // Get iframe node based on url
    getIframeEl(url) {
      const name = this.iframeNamePrefix + url
      return document.getElementsByName(name)[0]
    },

    // iframe node mounted
    iframeMounted(url) {
      const iframe = this.getIframeEl(url)
      this.$emit('iframe-mounted', url, iframe)
    },

    // iframe loaded successfully
    iframeLoaded(url) {
      const iframe = this.getIframeEl(url)
      this.$emit('iframe-loaded', url, iframe)
    }
  }
}
