import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import qs from 'qs'
Vue.prototype.$qs = qs 

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

import Iview from 'iview';
Vue.use(Iview);
import 'iview/dist/styles/iview.css';
import i18n from '@/common/lang/lang';

import Ebus from '@/utils/ebus';
Vue.use(Ebus);

import Toast from '@/common/toast/toast';
Vue.use(Toast);

import Preview from '@/common/preview/preview';
Vue.use(Preview);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

console && (Object.keys(console).forEach(key => {

    global[key] = process.env.NODE_ENV === 'production' ? function () { } : console[key];
  
}));
log(false||+55)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
