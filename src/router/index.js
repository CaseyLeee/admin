import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/robin',
    component: () => import('@/views/equip/Equipenter'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/main/robots',
    component: Layout,
    redirect: "/main/robots/list",
    meta: {
      title: "设备管理", icon: 'own-icon-sb'
    },
    children: [
      {
        path: '/main/robots/add',
        component: (resolve) => require(['@/views/equip/EquipAdd'], resolve),
        meta: {
          title: "添加设备", icon: ''
        },
       
      },
      {
        path: '/main/robots/EquipAddBatch',
        component: (resolve) => require(['@/views/equip/EquipAddBatch'], resolve),
        meta: {
          title: "批量添加", icon: ''
        },
       
      },
      {
        path: '/main/robots/list',
        component: (resolve) => require(['@/views/equip/EquipList'], resolve),
        meta: {
          title: "设备管理", icon: ''
        },
      },
      {
        path: '/main/robots/edit',
        component: (resolve) => require(['@/views/equip/EquipEdit'], resolve),
        meta: {
          title: "设备编辑", icon: ''
        },
        hidden: true
      },
      
    ]
  },
  {
    path: '/main',
    component: Layout,
    name: 'Example',
    
  },
  {
    path: '/main/personnel',
    component: Layout,
    name: 'Example',
    meta: { title: '人员管理', icon: 'own-icon-ry' },

    children: [

      {
        path: '/main/visitor/add',
        component: (resolve) => require(['@/views/personnel/staff/StaffAdd'], resolve),
        meta: { title: "添加人员", icon: '' },
      },
      {
        path: '/main/visitor/registerbatch',
        component: (resolve) => require(['@/views/personnel/visitor/registerbatch'], resolve),

        meta: { title: "批量添加", icon: '' },
      },

      {
        path: '/main/personnel/visitor',
        component: (resolve) => require(['@/views/personnel/visitor/Visitor'], resolve),
        meta: { title: "管理人员", icon: '' },
        redirect: '/main/visitor/list',

        //有列表的父层和编辑or新增的子层是为了面包屑显示  列表>编辑  列表>新增
        children: [
          {//有三个平级是为了视图切换
            path: '/main/visitor/list',
            component: (resolve) => require(['@/views/personnel/visitor/VisitorList'], resolve),
            meta: { title: "管理人员", icon: '', breadcrumb: false },

          },
          {
            path: '/main/visitor/edit',
            component: (resolve) => require(['@/views/personnel/visitor/VisitorEdit'], resolve),
            meta: { title: "人员编辑", icon: '' },
            hidden: true
          }

        ]
      },
    
      

      // {
      //   path: '/main/sync',
      //   component: (resolve) => require(['@/views/personnel/staff/synchro'], resolve),
      //   redirect: "/main/synchro",

      //   children: [
      //     {
      //       name:"synchro",
      //       path: '/main/synchro',
      //       component: (resolve) => require(['@/views/personnel/staff/synchro'], resolve),
      //       meta: { title: "人员同步", icon: 'el-icon-refresh' },

      //     },
      //   ]
      // },
    ]


  },

  {
    path: '/',
    component: Layout,
    redirect: '/main',

  },

  {
    path: '/main/group',
    component: Layout,
    redirect: "/main/group/list",
    meta: {
      title: "权限设置", icon: 'own-icon-qx'
    },
    children: [
      {
        path: '/main/group/list',
        component: (resolve) => require(['@/views/group/GroupList'], resolve),
        meta: {
          title: "分组列表", icon: ''
        },
      },
      {
        name: 'edit',
        path: '/main/group/edit',
        component: (resolve) => require(['@/views/group/GroupEdit'], resolve),
        meta: {
          title: "分组编辑", icon: ''
        },
        hidden: true
      },
      {
        name: 'add',
        path: '/main/group/add',
        component: (resolve) => require(['@/views/group/GroupEdit'], resolve),
        meta: {
          title: "分组新增", icon: ''
        },
        hidden: true
      },
    ]
  },
  {
    path: '/main/visitor/inout',
    component: Layout,
    redirect: "/main/visitor/inoutrecord",
    meta: {
      title: "通行记录", icon: 'el-icon-s-help'
    },
    children: [
      {
        path: '/main/visitor/inoutrecord',
        component: (resolve) => require(['@/views/personnel/visitor/Personnel'], resolve),
        meta: { title: "通行记录", icon: 'el-icon-document' },
      }]
  },

  {
    path: '/main/password',
    component: Layout,
    redirect: "/main/password/modify",
    meta: {
      title: "密码修改"
    },
    children: [
      {
        path: '/main/password/modify',
        component: (resolve) => require(['@/views/password/Modify'], resolve),
        meta: {
          title: "密码修改", icon: 'el-icon-setting'
        },
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [


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
