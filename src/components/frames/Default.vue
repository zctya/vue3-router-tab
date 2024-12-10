<template>
  <router-tab
    :contextmenu="contextMenu"
    :contextmenu-pinned="contextMenuPinned"
    use-inheritance
    :tabs="tabs"
    allow-pin
    hide-title-pinned
    @on-drop-alive="onDropAlive"
    @on-pin="onPin"
    @on-unpin="onUnpin"
  >
    <template #divider>
      <div class="pin-divider" />
    </template>
  </router-tab>
</template>

<script>
  export default {
    name: 'Default',

    data() {
      return {
        contextMenu: [{ id: 'refresh', icon: 'fas fa-sync-alt' }, 'refreshAll', { id: 'close', icon: 'fas fa-times' }, 'closeLefts', 'closeRights', 'closeOthers', 'pin'],

        contextMenuPinned: [{ id: 'refresh', icon: 'fas fa-sync-alt' }, 'refreshAll', { id: 'close', icon: 'fas fa-times' }, { id: 'unpin', icon: 'fa-solid fa-thumbtack' }],

        tabs: [
          '/default/page/1',
          {
            to: '/default/page/2',
            title: 'kavo',
            pinned: true,
            nodrag: true,
            unpinnable: false,
            closable: false
          }
        ]
      }
    },

    methods: {
      onDropAlive(context) {
        // eslint-disable no-console
        console.log('on-drop-alive', context)
      },

      onPin(context) {
        // eslint-disable no-console
        console.log('on-pin', context)
      },

      onUnpin(context) {
        // eslint-disable no-console
        console.log('on-unpin', context)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pin-divider {
    top: 0;
    bottom: 0;
    width: 3px;
    margin: 2px;
    background: grey;
  }

  .router-tab__slot-divider_trans-enter-active,
  .router-tab__slot-divider_trans-leave-active {
    transition: opacity 0.5s ease-in-out;
  }
  .router-tab__slot-divider_trans-enter-from,
  .router-tab__slot-divider_trans-leave-to {
    opacity: 0;
  }
</style>
