<template>
  <div class="router-tab">
    <!-- 탭 헤더 -->
    <header ref="header" class="router-tab__header">
      <div class="router-tab__slot-start">
        <slot name="start" />
      </div>

      <tab-scroll ref="scroll">
        <!-- 탭 목록 -->
        <transition-group
          v-bind="tabTrans"
          @after-enter="onTabTrans"
          @after-leave="onTabTrans"
        >
          <ul class="router-tab__nav" key="0">
            <tab-item
              v-for="(item, index) in items"
              :key="item.id || item.to"
              ref="tab"
              :data="item"
              :index="index"
              @contextmenu="e => showContextmenu(item.id, index, e)"
            />
          </ul>
        </transition-group>
      </tab-scroll>

      <div class="router-tab__slot-end">
        <slot name="end" />
      </div>
    </header>

    <!-- 페이지 컨테이너 -->
    <div class="router-tab__container">
      <slot name="containerHeader" />
      <router-alive
        ref="routerAlive"
        page-class="router-tab-page"
        :keep-alive="keepAlive"
        :reuse="reuse"
        :max="maxAlive"
        :transition="pageTrans"
        :page-scroller="pageScroller"
        @ready="onAliveReady"
        @change="onAliveChange"
      />

      <!-- iframe 페이지 -->
      <transition-group
        v-bind="pageTrans"
        tag="div"
        class="router-tab__iframes"
      >
        <iframe
          v-for="url in iframes"
          v-show="url === currentIframe"
          :key="url"
          :src="url"
          :name="iframeNamePrefix + url"
          frameborder="0"
          class="router-tab__iframe"
          @load="iframeLoaded(url)"
        />
      </transition-group>
      <slot name="containerFooter" />
    </div>

    <!-- 오른쪽 클릭 메뉴 -->
    <transition name="router-tab-zoom">
      <tab-contextmenu
        v-if="contextmenu !== false && contextData.index > -1"
        :data="contextData"
        :menu="contextMenu"
      />
    </transition>
  </div>
</template>

<script src="./RouterTab.js"></script>
