<template>
  <div>
    <h2 @click="click">Page{{ pageId }}</h2>

    <page-timer />

    <h3>Tab operations</h3>

    <p>
      <router-link
        class="demo-btn"
        :to="nextId"
      >
        Open "Page{{ nextId }}"
      </router-link>

      <a
        class="demo-btn"
        @click="$tabs.open(nextId, false, true, true)"
      >
        New "Page{{ nextId }}" with parent link
      </a>
    </p>

    <p v-if="prevId > 0">
      <router-link
        class="demo-btn"
        :to="prevId"
      >
        Open "Page{{ prevId }}"
      </router-link>

      <a
        class="demo-btn"
        @click="$tabs.open(prevId, false, true, true)"
      >
        Open "Page{{ prevId }}"
      </a>
    </p>

    <p>
      <a
        class="demo-btn"
        @click="$router.push('../tab-dynamic')"
      >
        Open the "Dynamic updates tab"
      </a>

      <a
        class="demo-btn"
        @click="$tabs.close('../tab-dynamic')"
      >
        Close the "Dynamic updates tab"
      </a>
    </p>

    <p>
      <a
        class="demo-btn"
        @click="$tabs.refresh()"
      >
        Refresh the current page
      </a>

      <a
        class="demo-btn"
        @click="$tabs.close()"
      >
        Close the current page
      </a>

      <a
        class="demo-btn"
        @click="$tabs.close(null, '../tab-dynamic')"
      >
        Close the current tab and go
      </a>
    </p>

    <p>
      <a
        class="demo-btn"
        @click="$tabs.refreshAll()"
      >
        Refresh all pages
      </a>

      <a
        class="demo-btn"
        @click="$tabs.reset()"
      >
        Reset tab
      </a>
    </p>

    <iframe-operate />

    <h3>Routing information</h3>

    <page-route-info />
  </div>
</template>

<script>
  import PageTimer from '../components/PageTimer.vue'
  import PageRouteInfo from '../components/PageRouteInfo.vue'
  import IframeOperate from './IframeOperate.vue'

  export default {
    name: 'Page',

    components: { PageTimer, PageRouteInfo, IframeOperate },

    data() {
      let id = this.$route.params.id
      return {
        pageId: id,
        nextId: +id + 1 + '',
        prevId: +id - 1 + ''
      }
    },

    methods: {
      click() {
        // eslint-disable no-console
        console.log(`Page${this.pageId}`)
      }
    }
  }
</script>
