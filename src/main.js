import '@/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import { Integrations } from '@sentry/tracing'
import * as Sentry from '@sentry/vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU' // lang i18n
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// set ElementUI lang
Vue.use(ElementUI, { locale })

// add moment.js
Vue.prototype.$moment = moment

Sentry.init({
  Vue,
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['laboratory.kvd-rostov.ru', /^\//]
    })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
