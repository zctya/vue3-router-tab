<template>
  <div>
    <h3>Iframe tab operations</h3>

    <p>
      <a
        class="demo-btn"
        @click="$tabs.openIframe(site.src, site.title, icon)"
      >
        Open "{{ site.title }}"
      </a>
      <a
        class="demo-btn"
        @click="$tabs.refreshIframe(site.src)"
      >
        Refresh "{{ site.title }}"
      </a>
      <a
        class="demo-btn"
        @click="$tabs.closeIframe(site.src)"
      >
        Close "{{ site.title }}"
      </a>
    </p>

    <p>
      <a
        class="demo-btn"
        title="XSS cross-site linked iframe will display a blank page"
        @click="$tabs.openIframe(xss.js, 'XSS - JS', icon)"
      >
        XSS - JS
      </a>
      <a
        class="demo-btn"
        title="XSS cross-site linked iframe will display a blank page"
        @click="$tabs.openIframe(xss.base64, 'XSS - Base64', icon)"
      >
        XSS - Base64
      </a>
    </p>

    <h3>Open the Iframe tab</h3>

    <div class="custom-iframe">
      <label>
        Name:
        <input
          v-model="iframe.title"
          name="title"
          placeholder="Tab title"
        />
      </label>
      <label>
        URL:
        <input
          v-model="iframe.src"
          name="src"
          placeholder="Please enter full URL"
        />
      </label>
      <a
        class="demo-btn primary"
        @click="iframe.src && $tabs.openIframe(iframe.src, iframe.title, icon)"
      >
        Open tab
      </a>
    </div>

    <template v-if="/^\/iframe\//.test($route.path)">
      <h3 class="text-strong">Hint:</h3>
      <p>
        Open the console tab of the browser developer tools, open the Iframe tab and view
        <code>iframe-mounted</code>
        and
        <code>iframe-loaded</code>
        event parameter printing
      </p>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'IframeOperate',

    data() {
      return {
        icon: 'rt-icon-web',

        site: {
          src: 'https://cn.vuejs.org',
          title: 'Vue.js'
        },

        iframe: {
          src: 'https://router.vuejs.org/zh/',
          title: 'Vue Router'
        },

        xss: {
          js: 'javascript:alert(1)',
          base64: 'data:text/html;base64,' + window.btoa('<script>alert(1)</s' + 'cript>')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-iframe {
    label {
      display: block;
      margin-bottom: 0.8em;
    }

    input {
      padding: 0.4em 0.8em;
    }
  }
</style>
