// router/routes.js

// 导入页面级组件
import HomeView from "@/views/HomeView.vue";


// 路由 映射 列表
// 公共路由，不需要权限
export const publicRoutes = [

    {
        path: '/home',
        name: '首页',
        component: HomeView
    },


    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('@/views/Home.vue')
    // },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/LoginView.vue')
    }
];

// 需要权限的路由
// export const asyncRoutes = [
//     {
//         path: '/admin',
//         name: 'Admin',
//         component: () => import('@/views/Admin.vue'),
//         meta: { roles: ['admin'] }
//     },
//     {
//         path: '/editor',
//         name: 'Editor',
//         component: () => import('@/views/Editor.vue'),
//         meta: { roles: ['editor', 'admin'] }
//     },
//     {
//         path: '/user',
//         name: 'User',
//         component: () => import('@/views/User.vue'),
//         meta: { roles: ['user', 'admin'] }
//     }
// ];
