<template>
  <router-tab :tabs="tabs" />
</template>

<script>
  export default {
    name: 'InitialTabs',

    data() {
      return {
        tabs: [
          // Just set the fullpath, and the program will automatically obtain the title/icon and other information of the tab from the router configuration.
          // (Page routing configured in page meta mode in the Nuxt project is not supported)
          '/initial-tabs/page-leave',

          // Nuxt project requires complete configuration of tab display
          { to: '/initial-tabs/tab-dynamic', title: 'Dynamic tab', closable: false },

          // For tabs with dynamic tab titles, the initial tab title needs to be set to avoid inconsistent titles after entering the tab.
          { to: '/initial-tabs/page/1', title: 'Page1' },

          // <router-link> location mode configuration
          {
            to: {
              path: '/initial-tabs/page/2',
              query: { t: 2 }
            },

            title: 'Page2'
          },

          // Under the default key configuration, this tab is consistent with the key of the '/initial-tabs/page/2' tab, and only the first appearing tab will be retained.
          { to: '/initial-tabs/page/2?t=1', title: 'Page2-1' },

          // Iframe tab
          `/initial-tabs/iframe/${encodeURIComponent('https://cn.vuejs.org')}/Vue.js/rt-icon-web`
        ]
      }
    }
  }
</script>
