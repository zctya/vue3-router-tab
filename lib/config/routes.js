import Iframe, { iframeMeta } from '../page/Iframe.vue'

// Injected routes
export default [
  {
    // iframe routing
    path: 'iframe/:src/:title?/:icon?',
    component: Iframe,
    props: true,
    meta: iframeMeta
  }
]

export { Iframe }
