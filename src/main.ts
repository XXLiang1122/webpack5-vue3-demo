import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import Store from './store'
import './style/index.less'

createApp(App).use(Router).use(Store).mount('#app')