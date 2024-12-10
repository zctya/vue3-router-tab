<template>
  <div class="router-tab-iframe-fake" />
</template>

<script>
  // Iframe routing element
  export const iframeMeta = {
    key: route => `iframe-${route.params.src}`,
    title: route => route.params.title,
    icon: route => route.params.icon
  }

  // Iframe tab page
  export default {
    inject: ['$tabs'],

    meta: iframeMeta, // Nuxt page routing element

    props: {
      src: String,
      title: String,
      icon: String
    },

    computed: {
      /**
       * Link security filtering, blocking the following XSS attacks and returning a blank page:
       * 1. `javascript:` Execution code: `javascript:alert(1)`
       * 2. `data:` Base64 link: `'data:text/html;base64,' + window.btoa('<script>alert(1)<\/script>')`
       */
      url() {
        let src = decodeURIComponent(this.src)

        if (/^(javascript|data):/i.test(src)) {
          return 'about:blank'
        }

        // Checking src in the allowlist
        if (this.$tabs.allowList.length > 0) {
          if (
            !this.$tabs.allowList.some(v => {
              let re
              if (/^\/.*\/([gimy]*)$/.test(v)) {
                const flags = v.replace(/.*\/([gimy]*)$/, '$1')
                const pattern = v.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1')
                re = new RegExp(pattern, flags)
              } else {
                re = new RegExp(v)
              }
              return re.test(src)
            })
          ) {
            return 'about:blank'
          }
        }

        return src
      }
    },

    async mounted() {
      let { url, $tabs } = this
      let { iframes } = $tabs

      if (!iframes.includes(url)) {
        iframes.push(url)
      }

      $tabs.currentIframe = url

      await this.$nextTick()
      this.$tabs.iframeMounted(url)
    },

    activated() {
      this.$tabs.currentIframe = this.url
    },

    deactivated() {
      this.$tabs.currentIframe = null
    },

    // Remove iframe after component is destroyed
    unmounted() {
      let { url } = this
      let { iframes } = this.$tabs
      let index = iframes.indexOf(url)

      if (index > -1) {
        iframes.splice(index, 1)
      }
    }
  }
</script>
