import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Registry from '../views/Registry.vue'
import Login from '../views/Login.vue'
import Apps from '../views/Apps.vue'
import Metrics from '../views/Metrics.vue'
import Sysconfig from '../views/Sysconfig.vue'
import CreateApp from '../views/AppCreate.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    hidden: true,
    children: [
      {
        path: '/viewRegistry',
        name: 'Registry',
        component: Registry,
      },
      {
        path: '/viewApps',
        name: 'Apps',
        component: Apps,
      },
      {
        path: '/viewAppsCreate',
        name: 'AppsCreate',
        component: CreateApp,
        props: route => ({appId: route.query.appId})
      },
      {
        path: '/viewMetrics',
        name: 'Metrics',
        component: Metrics,
      },
      {
        path: '/viewSysconfig',
        name: 'Sysconfig',
        component: Sysconfig,
      }
    ]
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
