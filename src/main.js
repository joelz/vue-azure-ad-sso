import Vue from 'vue'
import App from './App.vue'
import router from './router'
Vue.config.productionTip = false

import { PublicClientApplication } from '@azure/msal-browser'
import msalConfig from './config/msal'

// 初始化 MSAL 实例
Vue.prototype.$msalInstance = new PublicClientApplication(msalConfig.config)

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
