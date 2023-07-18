<template>
  <div>
    <h2 @click="click">페이지{{ pageId }}</h2>

    <page-timer />

    <h3>탭 작업</h3>

    <p>
      <router-link class="demo-btn" :to="nextId">
        페이지 열기“{{ nextId }}”
      </router-link>

      <a class="demo-btn" @click="$tabs.open(nextId, true)">
        새로운 오픈“페이지{{ nextId }}”
      </a>
    </p>

    <p v-if="prevId > 0">
      <router-link class="demo-btn" :to="prevId">
        페이지 열기{{ prevId }}”
      </router-link>

      <a class="demo-btn" @click="$tabs.open(prevId, true)">
        새로운 오픈“페이지{{ prevId }}”
      </a>
    </p>

    <p>
      <a class="demo-btn" @click="$router.push('../tab-dynamic')">
        열려 있는“동적 업데이트 탭”
      </a>

      <a class="demo-btn" @click="$tabs.close('../tab-dynamic')">
        닫혀 있는“동적 업데이트 탭”
      </a>
    </p>

    <p>
      <a class="demo-btn" @click="$tabs.refresh()">현재 페이지 새로 고침</a>

      <a class="demo-btn" @click="$tabs.close()">현재 페이지 닫기</a>

      <a class="demo-btn" @click="$tabs.close(null, '../tab-dynamic')">
        현재를 닫고 점프
      </a>
    </p>

    <p>
      <a class="demo-btn" @click="$tabs.refreshAll()">모든 페이지 새로 고침</a>

      <a class="demo-btn" @click="$tabs.reset()">재설정 탭</a>
    </p>

    <iframe-operate />

    <h3>라우팅 정보</h3>

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
      console.log(`페이지${this.pageId}`)
    }
  }
}
</script>
