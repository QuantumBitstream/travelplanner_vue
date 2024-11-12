// router/routes.js

// 导入页面级组件



// 路由 映射 列表
// 公共路由，不需要权限
export const publicRoutes = [

    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/destinations',
        name: 'Destinations',
        component: () => import('@/views/Destinations.vue')
    },
    {
        path: '/destination/:id',
        name: 'DestinationDetails',
        component: () => import('@/views/DestinationDetails.vue')
    },
    {
        path: '/trip-planner',
        name: 'TripPlanner',
        component: () => import('@/views/TripPlanner.vue')
    },
    {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/Community.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue')
    },
    {
        path: '/my-trips',
        name: 'MyTrips',
        component: () => import('@/views/MyTrips.vue')
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
