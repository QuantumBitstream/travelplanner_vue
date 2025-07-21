// router/routes.js

// 导入页面级组件



// 路由 映射 列表
// 公共路由，不需要权限
import BookingPage from "@/views/BookingPage.vue";

export const publicRoutes = [

    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: "/search-details/:city",
        name: "SearchDetails",
        component: () => import('@/views/SearchDetails.vue')
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
        path: '/trips',
        name: 'Trips',
        component: () => import('@/views/Trips.vue')
    },
    {
        path: '/trip/:id',
        name: 'TripDetails',
        component: () => import('@/views/TripDetails.vue')
    },
    {
        path: '/booking',
        name: 'Booking',
        component: BookingPage },
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
    },
    {
        path: '/chat-channel',
        name: 'ChatChannel',
        component: () => import('@/views/ChatView.vue')
    },
    {
        path: '/ai-chatBox',
        name: 'ChatBox',
        component: () => import('@/views/ChatBox.vue')
    },
    {
        path: '/WeatherStream',
        name: 'WeatherStream',
        component: () => import('@/views/WeatherStream.vue')
    },
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
