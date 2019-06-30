import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios"

// 1. 引入EelementUI库
import ElementUI from "element-ui";
// 2. 引入CSS文件
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem("token")
    console.log(111,config)
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
})
Vue.prototype.$http = axios

// 3. 安装ElementUI
Vue.use(ElementUI);

router.beforeEach(  (to,from,next) => {
  console.log(to,from)
  if(to.path === "/login") {
    return next()
  } else {
    if(localStorage.getItem("token")) {
      next()
    } else {
      router.push("/login")
    }
  }
})

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
