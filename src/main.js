import Vue from "vue";
import App from "./App.vue";
import router from "./router";

// 1. 引入EelementUI库
import ElementUI from "element-ui";
// 2. 引入CSS文件
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";

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
