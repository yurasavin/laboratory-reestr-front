import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU' // lang i18n
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// set ElementUI lang
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
