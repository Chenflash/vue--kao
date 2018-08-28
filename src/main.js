// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import { Header, Picker, Lazyload ,Swipe, SwipeItem,Field, Checklist, Cell, DatetimePicker, Radio, InfiniteScroll, Navbar, Loadmore, TabItem, MessageBox, Search, Toast } from 'mint-ui';

Vue.component(Radio.name, Radio, Checklist.name, Swipe.name, Swipe, SwipeItem.name, SwipeItem,Checklist,DatetimePicker.name, DatetimePicker, DatetimePicker, Field.name, Field, Picker.name, Loadmore.name, Picker, InfiniteScroll, Lazyload);

Vue.use(Vuex)
import store from './VueX/store'
Vue.config.productionTip = false

Vue.use(Lazyload);
import axios from 'axios'
Vue.prototype.$axios = axios; //使用axios网络请求
axios.defaults.timeout = 5000
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;
Vue.use(InfiniteScroll);
Vue.component(Search.name, Search);
Vue.component(Navbar.name, Navbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Loadmore.name, Loadmore);
Vue.component(Cell.name, Cell);
Vue.component(Header.name, Header);
Vue.use(MintUI)
Vue.config.productionTip = false;

//定义设置标题栏
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
    console.log(document.title);
  }
  next()
})


//定义axios拦截器
axios.interceptors.response.use(
  config => {
    config.headers['X-Requested-With'] = 'XMLHttpRequst'
    return config;
  },
  err => {
    if (err.message.indexOf('timeout') > -1) {
      Toast('请求超时，请稍后重试');
    }
  }
);



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  router,
  components: { App },
  template: '<App/>'
})
