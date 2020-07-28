import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '@/components/common/Home'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@/components/page/Dashboard'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '@/components/page/Icon'),
                    meta: { title: '自定义图标' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '@/components/page/I18n'),
                    meta: { title: '国际化' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '@/components/page/404'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/403'),
                    meta: { title: '403' }
                },
                {
                    path: '/menu',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/Menu'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/user',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/User'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/role',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/Role'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/loginLog',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/User'),
                    meta: { title: '登陆日志' }
                },
                {
                    path: '/dict',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/User'),
                    meta: { title: '字典管理' }
                },
                {
                    path: '/businessLog',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/system/User'),
                    meta: { title: '业务日志' }
                }



                ,
                {
                    path: '/invest',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/finance/Invest'),
                    meta: { title: '投资管理' }
                },
                {
                    path: '/account',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/finance/Account'),
                    meta: { title: '帐套管理' }
                },
                {
                    path: '/subject',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/finance/Subject'),
                    meta: { title: '会计科目' }
                },
                {
                    path: '/asset',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/finance/Asset'),
                    meta: { title: '资产管理' }
                },
                {
                    path: '/assetReport',
                    component: () => import(/* webpackChunkName: "403" */ '@/components/page/Test'),
                    meta: { title: '资产报表' }
                },
                {
                    path: 'allocMenu',
                    name: 'allocMenu',
                    component: () => import('@/components/page/system/allocMenu'),
                    meta: {title: '分配菜单'},
                    hidden: true
                }
                // ,
                // {
                //     path: '/donate',
                //     component: () => import(/* webpackChunkName: "donate" */ '@/components/page/Donate'),
                //     meta: { title: '支持作者' }
                // }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '@/components/page/Login'),
            meta: { title: '登录' }
        },

        {
            path: '*',
            redirect: '/404'
        }
    ]
});
