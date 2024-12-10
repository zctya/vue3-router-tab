<template>
  <div>
    <h2>Page exit confirmation</h2>

    <page-timer />

    <p>The page will confirm the prompt when the tab is closed/refreshed/replaced.</p>

    <p>
      <a
        class="demo-btn"
        @click="$tabs.refresh(null, true, false)"
      >
        Refresh tab
      </a>

      <a
        class="demo-btn"
        @click="$tabs.close({ force: false })"
      >
        Close tab
      </a>

      <router-link
        class="demo-btn"
        :to="`?id=${+($route.query.id || 0) + 1}`"
      >
        Replace tab
      </router-link>

      <router-link
        class="demo-btn"
        to="/default/page/1"
      >
        Leave route
      </router-link>

      <a
        class="demo-btn"
        @click="reload"
      >
        Refresh browser
      </a>
    </p>
  </div>
</template>

<script>
  import PageTimer from '../components/PageTimer.vue'

  export default {
    name: 'PageLeave',

    components: { PageTimer },

    /**
     * Confirm before leaving the page
     * @param {Object} tab tab information
     * @param {String} type leaving type:
     *   close: close tab
     *   refresh: refresh tab
     *   replace: replace tab
     *   leave: route leaves
     *   unload: browser refresh or close
     * @returns {String|Promise}
     */
    beforePageLeave(tab, type) {
      // Supported browsers will display a confirmation message when the browser window is refreshed or closed.
      if (type === 'unload') {
        return `Your changes on the "${tab.title}" tab have not been completed. Do you want to leave?`
      }

      // Leave type
      const action = {
        close: 'close',
        refresh: 'refresh',
        replace: 'replace',
        leave: 'leave'
      }[type]

      const msg = `Are you sure you want the ${action} tab "${tab.title}"?`

      // Return promise, resolve to leave, reject to prevent leaving
      return new Promise((resolve, reject) => {
        // Confirm prompt if value changes
        if (confirm(msg)) {
          resolve()
        } else {
          reject(`You rejected to ${action} tab`)
        }
      })

      // The confirm component of Element is used here
      // closeOnHashChange needs to be configured as false to avoid routing switching causing the confirmation box to close
      // return this.$confirm(msg, 'hint', { closeOnHashChange: false })
    },

    methods: {
      // Browser refresh
      reload() {
        location.reload()
      }
    }
  }
</script>
