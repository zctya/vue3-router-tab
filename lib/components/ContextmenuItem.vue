<template>
  <a
    v-if="visible"
    class="router-tab__contextmenu-item"
    :class="menuClass"
    :data-action="id"
    :disabled="!enable || undefined"
    :title="tips"
    @click="enable && data.handler(context)"
  >
    <i
      v-if="icon"
      class="router-tab__contextmenu-icon"
      :class="icon"
    />
    {{ title }}
  </a>
</template>

<script>
  import { mapGetters } from '../util'

  export default {
    name: 'ContextmenuItem',

    inject: ['$tabs', 'onTabEvent'],

    props: {
      // Menu data
      data: {
        type: Object,
        required: true
      }
    },

    computed: {
      // Parameters
      context() {
        const { $tabs, $parent: $menu, onTabEvent } = this
        const { target, data } = $menu
        return { $tabs, $menu, target, data, onTabEvent }
      },

      // Extract computed properties from this.data
      ...mapGetters(
        'data',
        {
          id: '',
          // Menu title
          title() {
            return this.$tabs.langs.contextmenu[this.id]
          },
          icon: '',
          tips: '',
          class: {
            default: '',
            alias: 'menuClass'
          },
          visible: true, // Display
          enable: true // Is it enabled?
        },
        'context'
      )
    }
  }
</script>
