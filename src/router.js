import Vue from "vue";
import Router from "vue-router";
const Login = () => import(/* webpackChunkName: "group-foo" */"./views/Login.vue");
const Home = () => import(/* webpackChunkName: "group-foo" */"./views/Home.vue");
const User = () => import(/* webpackChunkName: "group-foo" */"./views/User.vue");
const Rights = () => import(/* webpackChunkName: "rights" */"./views/rights.vue");
const Roles = () => import(/* webpackChunkName: "rights" */"./views/roles.vue");
const Goods = () => import(/* webpackChunkName: "goods" */"./views/goods.vue");
const Categories = () => import(/* webpackChunkName: "go0ds" */"./views/categories.vue");
const goodsAdd = () => import(/* webpackChunkName: "goods" */"./views/goodsAdd.vue");

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
