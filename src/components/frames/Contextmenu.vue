<template>
  <router-tab
    :class="{ 'is-fullscreen': fullscreen }"
    :contextmenu="contextmenu"
  />
</template>

<script>
  // Introducing full screen mixins
  import fullscreen from '../../mixins/fullscreen'

  export default {
    mixins: [fullscreen],

    computed: {
      // Right click menu
      contextmenu() {
        return [
          // Use the built-in menu
          'refresh',

          // Extend the built-in menu: add icons
          {
            id: 'close',
            icon: 'rt-icon-close'
          },

          // Extend the built-in menu: modify the execution method
          {
            id: 'closeOthers',
            handler({ $menu }) {
              $menu.closeMulti($menu.others)
              alert('Close other tabs')
            }
          },

          // Custom menu
          {
            id: 'custom',
            title: 'Custom action',
            tips: 'This is a custom operation',
            icon: 'rt-icon-doc',
            class: 'custom-action',
            // Whether to display or not. If not provided, it will be displayed by default.
            visible(context) {
              return context.$tabs.items.length < 3
            },

            // Whether to enable it. If not provided, it will be enabled by default.
            enable(context) {
              return !(context.data.index % 2)
            },

            // Click trigger
            handler(/*context*/) {
              // console.log(context)
              alert('This is a custom operation, please open the console to view the output parameters')
            }
          },

          // Menu with status full screen
          {
            id: 'fullscreen',
            title: () => (this.fullscreen ? 'Exit full screen mode' : 'Full screen'),
            icon: () => (this.fullscreen ? 'rt-icon-fullscreen-exit' : 'rt-icon-fullscreen'),

            // Click trigger
            handler: () =>
              setTimeout(() => {
                this.fullscreen = !this.fullscreen
              }, 300)
          }
        ]
      }
    }
  }
</script>
