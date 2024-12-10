import { createApp } from 'vue'
import RouterTab from '../lib'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(RouterTab)
app.use(router)

app.mount('#app')
