<template>
  <div>
    <h3>Iframe 탭 작업</h3>

    <p>
      <a class="demo-btn" @click="$tabs.openIframe(site.src, site.title, icon)">
        열려 있는“{{ site.title }}”
      </a>

      <a class="demo-btn" @click="$tabs.refreshIframe(site.src)">
        새로 고침“{{ site.title }}”
      </a>

      <a class="demo-btn" @click="$tabs.closeIframe(site.src)">
        닫혀 있는“{{ site.title }}”
      </a>
    </p>

    <p>
      <a
        class="demo-btn"
        title="XSS 교차 사이트 연결 iframe 빈 페이지를 표시합니다"
        @click="$tabs.openIframe(xss.js, 'XSS - JS', icon)"
      >
        XSS - JS
      </a>

      <a
        class="demo-btn"
        title="XSS 교차 사이트 연결 iframe 빈 페이지가 표시됩니다"
        @click="$tabs.openIframe(xss.base64, 'XSS - Base64', icon)"
      >
        XSS - Base64
      </a>
    </p>

    <h3>열려 있는 Iframe 탭</h3>

    <div class="custom-iframe">
      <label>
        이름：
        <input v-model="iframe.title" name="title" placeholder="탭 제목" />
      </label>

      <label>
        URL：
        <input v-model="iframe.src" name="src" placeholder="전체 URL을 입력하세요." />
      </label>

      <a
        class="demo-btn primary"
        @click="iframe.src && $tabs.openIframe(iframe.src, iframe.title, icon)"
      >
        열린 탭
      </a>
    </div>

    <template v-if="/^\/iframe\//.test($route.path)">
      <h3 class="text-strong">
        힌트：
      </h3>

      <p>
        브라우저 개발자 도구 열기 console 탭，Iframe 탭을 열고 보기
        <code>iframe-mounted</code>
        그리고
        <code>iframe-loaded</code>
        이벤트 매개변수 인쇄
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
        base64:
          'data:text/html;base64,' +
          window.btoa('<script>alert(1)</s' + 'cript>')
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
