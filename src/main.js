import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import RouterTab from '../lib'
// import RouterTab from '../dist/vue-router-tab'

const app = createApp(App)

app.use(RouterTab)
app.use(router)

app.mount('#app')