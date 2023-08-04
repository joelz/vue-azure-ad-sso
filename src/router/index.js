//导入模块
import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from "@/views/home";
import Login from "@/views/login";

//注册路由组件
Vue.use(VueRouter);

//编写路由规则
const routes = [
  {
    path: "/",
    name: 'Home',
    component: Home
  },
  {
    path: "/login",
    name: 'login',
    component: Login
  }
]

//创建路由
const router = new VueRouter({
  mode: 'history',
  routes
})

//导出
export default router;
