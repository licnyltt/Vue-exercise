import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import User from "./views/User.vue";
import Rights from "./views/rights.vue";
import Roles from "./views/roles.vue";
import Goods from "./views/goods.vue"
import Categories from "./views/categories.vue"
import goodsAdd from "./views/goodsAdd.vue"

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/",
      redirect: '/home'
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users",
          component: User,
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/goods",
          component: Goods
        },
        {
          path: "/categories",
          component: Categories
        },
        {
          path: "/goods-add",
          component: goodsAdd
        }
      ]
    }
  ]
})
