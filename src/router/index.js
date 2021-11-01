import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/main',
    children: [{
      path: 'main',
      name: 'main',
      component: () => import('@/views/main.vue'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },

// 账号管理菜单
  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'accountManager',
        name: 'account',
        component: () => import('@/views/account/accountManager.vue'),
        meta: { title: '账号管理', icon: 'form' }
      }
    ]
  },

// 配置中心菜单
  {
    path: '/config',
    component: Layout,
    children: [
      {
        path: 'config',
        name: 'config',
        component: () => import('@/views/config/configCenter.vue'),
        meta: { title: '配置中心', icon: 'example' }
      }
    ]
  },

  // 定时任务菜单
  {
    path: '/schedule',
    component: Layout,
    children: [
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('@/views/schedule/scheduleJob.vue'),
        meta: { title: '定时任务', icon: 'form' }
      }
    ]
  },

  // 签到管理菜单
  {
    path: '/sign',
    component: Layout,
    children: [
      {
        path: 'sign',
        name: 'sign',
        component: () => import('@/views/sign/signLog.vue'),
        meta: { title: '签到日志', icon: 'form' }
      }
    ]
  },

  

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
